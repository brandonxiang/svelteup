import { expect, test } from 'vitest';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { svelteup } from '../../dist/index.mjs';

const writeFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
};

const waitFor = async (predicate) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 5000) {
    if (await predicate()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error('Timed out waiting for condition');
};

test('dev server serves static files, injects reload script, rebuilds, and closes', async () => {
  const root = fs.mkdtempSync(path.join(process.cwd(), '.svelteup-test-dev-'));
  const previous = process.cwd();
  let rebuilds = 0;
  let handle;

  try {
    process.chdir(root);
    writeFile(
      path.join(root, 'public/index.html'),
      '<!doctype html><script type="module" src="/dist/index.js"></script>',
    );
    writeFile(path.join(root, 'components/index.js'), "document.body.dataset.version = 'one';");

    handle = await svelteup('components/index.js', {
      _: [],
      dev: true,
      watch: false,
      minify: false,
      outdir: 'public/dist',
      onRebuild: () => {
        rebuilds += 1;
      },
      serveOptions: {
        servedir: 'public',
        host: '127.0.0.1',
        port: 0,
      },
    });

    const response = await fetch(`http://${handle.host}:${handle.port}/`);
    expect(response.status).toBe(200);
    expect(await response.text()).toMatch(/dist\/index\.js/);

    const outputPath = path.join(root, 'public/dist/index.js');
    expect(fs.readFileSync(outputPath, 'utf-8')).toMatch(/EventSource\('\/svelteup-events'\)/);

    const bundleResponse = await fetch(`http://${handle.host}:${handle.port}/dist/index.js`);
    expect(bundleResponse.status).toBe(200);
    expect(await bundleResponse.text()).toMatch(/document\.body\.dataset\.version = ["']one["']/);

    fs.writeFileSync(
      path.join(root, 'components/index.js'),
      "document.body.dataset.version = 'two';",
    );

    await waitFor(() => fs.readFileSync(outputPath, 'utf-8').includes('two'));
    expect(rebuilds).toBeGreaterThan(0);
  } finally {
    if (handle) {
      await handle.close();
    }
    process.chdir(previous);
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('dev server exits with a clear error when the port is already in use', async () => {
  const root = fs.mkdtempSync(path.join(process.cwd(), '.svelteup-test-dev-'));
  const previous = process.cwd();
  const occupiedServer = http.createServer();
  const originalExit = process.exit;
  const originalError = console.error;
  let exitCode;
  let errorMessage;

  process.exit = (code) => {
    exitCode = code;
    throw new Error(`process.exit:${code}`);
  };
  console.error = (message) => {
    errorMessage = message;
  };

  try {
    await new Promise((resolve) => {
      occupiedServer.listen(0, '127.0.0.1', resolve);
    });
    const address = occupiedServer.address();
    const port = typeof address === 'object' && address ? address.port : 0;

    process.chdir(root);
    writeFile(
      path.join(root, 'public/index.html'),
      '<!doctype html><script type="module" src="/dist/index.js"></script>',
    );
    writeFile(path.join(root, 'components/index.js'), "document.body.dataset.version = 'one';");

    try {
      await svelteup('components/index.js', {
        _: [],
        dev: true,
        watch: false,
        minify: false,
        outdir: 'public/dist',
        serveOptions: {
          servedir: 'public',
          host: '127.0.0.1',
          port,
        },
      });
    } catch (error) {
      expect(error.message).toBe('process.exit:1');
    }

    expect(exitCode).toBe(1);
    expect(errorMessage).toBe(`[Error] Port ${port} is already in use on 127.0.0.1`);
  } finally {
    process.exit = originalExit;
    console.error = originalError;
    await new Promise((resolve) => occupiedServer.close(resolve));
    process.chdir(previous);
    fs.rmSync(root, { recursive: true, force: true });
  }
});
