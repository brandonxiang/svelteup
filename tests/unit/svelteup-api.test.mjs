import { test } from 'uvu';
import * as assert from 'uvu/assert';
import fs from 'node:fs';
import path from 'node:path';
import { svelteup } from '../../dist/index.mjs';

const createFixture = () => {
  return fs.mkdtempSync(path.join(process.cwd(), '.svelteup-test-'));
};

const writeFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
};

const withCwd = async (dir, fn) => {
  const previous = process.cwd();
  process.chdir(dir);
  try {
    await fn();
  } finally {
    process.chdir(previous);
  }
};

test.after.each(() => {
  for (const entry of fs.readdirSync(process.cwd())) {
    if (entry.startsWith('.svelteup-test-')) {
      fs.rmSync(path.join(process.cwd(), entry), { recursive: true, force: true });
    }
  }
});

test('uses the default components directory when no entry is provided', async () => {
  const root = createFixture();

  await withCwd(root, async () => {
    writeFile(
      path.join(root, 'components', 'counter-app.svelte'),
      '<svelte:options customElement="counter-app" /><p>counter</p>',
    );

    await svelteup('', {
      _: [],
      watch: false,
      outdir: 'public/dist',
    });

    assert.ok(fs.existsSync(path.join(root, 'public', 'dist', 'counter-app.js')));
  });
});

test('prefers explicit entry and API options over config values', async () => {
  const root = createFixture();

  await withCwd(root, async () => {
    writeFile(path.join(root, 'config-entry.js'), 'globalThis.configEntry = true;');
    writeFile(path.join(root, 'explicit-entry.js'), 'globalThis.explicitEntry = true;');
    writeFile(
      path.join(root, 'svelteup.config.js'),
      "export default { entry: 'config-entry.js', outdir: 'config-dist' };",
    );

    await svelteup('explicit-entry.js', {
      _: [],
      config: 'svelteup.config.js',
      watch: false,
      outdir: 'api-dist',
    });

    assert.ok(fs.existsSync(path.join(root, 'api-dist', 'explicit-entry.js')));
    assert.not.ok(fs.existsSync(path.join(root, 'config-dist')));
  });
});

test('uses config entry and output directory when API values are omitted', async () => {
  const root = createFixture();

  await withCwd(root, async () => {
    writeFile(path.join(root, 'config-entry.js'), 'globalThis.configEntry = true;');
    writeFile(
      path.join(root, 'svelteup.config.js'),
      "export default { entry: 'config-entry.js', outdir: 'config-dist' };",
    );

    await svelteup('', {
      _: [],
      config: 'svelteup.config.js',
      watch: false,
    });

    assert.ok(fs.existsSync(path.join(root, 'config-dist', 'config-entry.js')));
  });
});

test('exits with code 1 for missing entries', async () => {
  const root = createFixture();
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
    await withCwd(root, async () => {
      try {
        await svelteup('missing.js', {
          _: [],
          watch: false,
          outdir: 'dist',
        });
      } catch (error) {
        assert.is(error.message, 'process.exit:1');
      }
    });

    assert.is(exitCode, 1);
    assert.is(errorMessage, '[Error] Entry does not existed');
  } finally {
    process.exit = originalExit;
    console.error = originalError;
  }
});

test.run();
