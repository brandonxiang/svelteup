import { test } from 'uvu';
import * as assert from 'uvu/assert';
import fs from 'node:fs';
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
    writeFile(
      path.join(root, 'components/index.js'),
      "document.body.dataset.version = 'one';",
    );

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
    assert.is(response.status, 200);
    assert.match(await response.text(), /dist\/index\.js/);

    const outputPath = path.join(root, 'public/dist/index.js');
    assert.match(fs.readFileSync(outputPath, 'utf-8'), /EventSource\('\/svelteup-events'\)/);

    fs.writeFileSync(
      path.join(root, 'components/index.js'),
      "document.body.dataset.version = 'two';",
    );

    await waitFor(() => fs.readFileSync(outputPath, 'utf-8').includes('two'));
    assert.ok(rebuilds > 0);
  } finally {
    if (handle) {
      await handle.close();
    }
    process.chdir(previous);
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test.run();
