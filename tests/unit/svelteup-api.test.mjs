import { afterEach, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, svelteup } from '../../dist/index.mjs';

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

afterEach(() => {
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

    expect(fs.existsSync(path.join(root, 'public', 'dist', 'counter-app.js'))).toBe(true);
  });
});

test('defineConfig returns the provided config object', () => {
  const config = defineConfig({
    entry: 'components/index.js',
    format: 'iife',
    globalName: 'ExampleBundle',
  });

  expect(config).toEqual({
    entry: 'components/index.js',
    format: 'iife',
    globalName: 'ExampleBundle',
  });
});

test('guards custom element registration for duplicate script loads', async () => {
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

    const output = fs.readFileSync(path.join(root, 'public', 'dist', 'counter-app.js'), 'utf-8');
    expect(output).toContain('customElements.get');
    expect(output).toContain('customElements.define');
  });
});

test('supports iife output format for classic script embeds', async () => {
  const root = createFixture();

  await withCwd(root, async () => {
    writeFile(path.join(root, 'entry.js'), 'globalThis.iifeEntry = true; export const value = 1;');

    await svelteup('entry.js', {
      _: [],
      watch: false,
      outdir: 'dist',
      format: 'iife',
      globalName: 'SvelteupIifeTest',
    });

    const output = fs.readFileSync(path.join(root, 'dist', 'entry.js'), 'utf-8');
    expect(output).toContain('SvelteupIifeTest');
    expect(output).toContain('globalThis.iifeEntry');
  });
});

test('supports esm output format for module script embeds', async () => {
  const root = createFixture();

  await withCwd(root, async () => {
    writeFile(path.join(root, 'entry.js'), 'export const value = 1;');

    await svelteup('entry.js', {
      _: [],
      watch: false,
      outdir: 'dist',
      format: 'esm',
    });

    const output = fs.readFileSync(path.join(root, 'dist', 'entry.js'), 'utf-8');
    expect(output).toContain('export');
    expect(output).toContain('value');
  });
});

test('inlines dynamic imports by default', async () => {
  const root = createFixture();

  await withCwd(root, async () => {
    writeFile(path.join(root, 'entry.js'), "export const load = () => import('./lazy.js');");
    writeFile(path.join(root, 'lazy.js'), 'export const lazyValue = 1;');

    await svelteup('entry.js', {
      _: [],
      watch: false,
      outdir: 'dist',
      format: 'esm',
    });

    const outputFiles = fs
      .readdirSync(path.join(root, 'dist'))
      .filter((file) => file.endsWith('.js'));
    const output = fs.readFileSync(path.join(root, 'dist', 'entry.js'), 'utf-8');

    expect(outputFiles).toEqual(['entry.js']);
    expect(output).toContain('lazyValue');
  });
});

test('supports esm code splitting for dynamic imports', async () => {
  const root = createFixture();

  await withCwd(root, async () => {
    writeFile(path.join(root, 'entry.js'), "export const load = () => import('./lazy.js');");
    writeFile(path.join(root, 'lazy.js'), 'export const lazyValue = 1;');

    await svelteup('entry.js', {
      _: [],
      watch: false,
      outdir: 'dist',
      format: 'esm',
      codeSplitting: true,
    });

    const outputFiles = fs
      .readdirSync(path.join(root, 'dist'))
      .filter((file) => file.endsWith('.js'));
    const entryOutput = fs.readFileSync(path.join(root, 'dist', 'entry.js'), 'utf-8');

    expect(outputFiles).toEqual(expect.arrayContaining(['entry.js', 'lazy.js']));
    expect(outputFiles.length).toBeGreaterThan(1);
    expect(entryOutput).toContain('import(');
    expect(entryOutput).toContain('lazy.js');
  });
});

test('supports shared chunks across multiple entries when code splitting is enabled', async () => {
  const root = createFixture();

  await withCwd(root, async () => {
    writeFile(path.join(root, 'components', 'one.svelte'), '<p>one</p>');
    writeFile(path.join(root, 'components', 'two.svelte'), '<p>two</p>');

    await svelteup('components', {
      _: [],
      watch: false,
      outdir: 'dist',
      format: 'esm',
      codeSplitting: true,
      compilerOptions: {
        customElement: false,
      },
    });

    const outputFiles = fs
      .readdirSync(path.join(root, 'dist'))
      .filter((file) => file.endsWith('.js'));

    expect(outputFiles).toEqual(expect.arrayContaining(['one.js', 'two.js']));
    expect(outputFiles.length).toBeGreaterThan(2);
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

    expect(fs.existsSync(path.join(root, 'api-dist', 'explicit-entry.js'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'config-dist'))).toBe(false);
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

    expect(fs.existsSync(path.join(root, 'config-dist', 'config-entry.js'))).toBe(true);
  });
});

test('exits with code 1 for invalid output formats', async () => {
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
      writeFile(path.join(root, 'entry.js'), 'globalThis.entry = true;');

      try {
        await svelteup('entry.js', {
          _: [],
          watch: false,
          outdir: 'dist',
          format: 'umd',
        });
      } catch (error) {
        expect(error.message).toBe('process.exit:1');
      }
    });

    expect(exitCode).toBe(1);
    expect(errorMessage).toBe('[Error] Output format must be "esm" or "iife"');
  } finally {
    process.exit = originalExit;
    console.error = originalError;
  }
});

test('exits with code 1 when code splitting is enabled for iife output', async () => {
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
      writeFile(path.join(root, 'entry.js'), 'globalThis.entry = true;');

      try {
        await svelteup('entry.js', {
          _: [],
          watch: false,
          outdir: 'dist',
          format: 'iife',
          codeSplitting: true,
        });
      } catch (error) {
        expect(error.message).toBe('process.exit:1');
      }
    });

    expect(exitCode).toBe(1);
    expect(errorMessage).toBe('[Error] Code splitting requires "esm" output format');
  } finally {
    process.exit = originalExit;
    console.error = originalError;
  }
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
        expect(error.message).toBe('process.exit:1');
      }
    });

    expect(exitCode).toBe(1);
    expect(errorMessage).toBe('[Error] Entry does not existed');
  } finally {
    process.exit = originalExit;
    console.error = originalError;
  }
});
