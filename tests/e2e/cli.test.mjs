import { expect, test } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const run = promisify(execFile);
const root = process.cwd();
const bin = path.join(root, 'bin.js');

test('CLI builds a single file custom-element entry', async () => {
  const outdir = path.join(root, 'examples/custom-element/public/dist');
  fs.rmSync(outdir, { recursive: true, force: true });

  await run('node', [
    bin,
    'examples/custom-element/components/index.js',
    '-o',
    'examples/custom-element/public/dist',
  ]);

  expect(fs.existsSync(path.join(outdir, 'index.js'))).toBe(true);
});

test('CLI builds split custom-element directory entries', async () => {
  const outdir = path.join(root, 'examples/custom-element-split/public/dist');
  fs.rmSync(outdir, { recursive: true, force: true });

  await run('node', [
    bin,
    'examples/custom-element-split/components',
    '-o',
    'examples/custom-element-split/public/dist',
  ]);

  expect(fs.existsSync(path.join(outdir, 'counter-app.js'))).toBe(true);
  expect(fs.existsSync(path.join(outdir, 'main-app.js'))).toBe(true);
});

test('CLI loads a TypeScript config file', async () => {
  const cwd = path.join(root, 'examples/no-custom-element');
  const outdir = path.join(cwd, 'public/dist');
  fs.rmSync(outdir, { recursive: true, force: true });

  await run('node', [path.join(root, 'bin.js'), '-c', 'svelteup.config.ts'], {
    cwd,
  });

  expect(fs.existsSync(path.join(outdir, 'index.js'))).toBe(true);
});
