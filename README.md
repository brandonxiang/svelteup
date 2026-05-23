# svelteup

[![GitHub license](https://img.shields.io/github/license/brandonxiang/svelteup)](https://github.com/brandonxiang/svelteup/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](https://github.com/brandonxiang/svelteup/compare)
[![npm version](https://badgen.net/npm/v/svelteup)](https://npm.im/svelteup)
[![npm downloads](https://badgen.net/npm/dm/svelteup)](https://npm.im/svelteup)

Svelteup bundles Svelte components into web components with Rolldown. It gives small Svelte projects a direct way to ship custom elements, run a local development server, or bundle a group of components as separate browser-ready files.

## Installation

```bash
pnpm add -D svelteup
```

You can also run the CLI through your package manager:

```bash
pnpm exec svelteup --help
```

## Entry Points

Svelteup accepts a JavaScript or TypeScript file, or a directory of Svelte components.

- Use a file entry when you want to bundle all imported components into one output.
- Use a directory entry when you want each `.svelte` file in that directory to become a separate bundle.

See [examples](./examples) for both modes.

## CLI

By default, Svelteup reads from `components` and writes bundles to `public/dist`.

```bash
svelteup [entry] [options]
```

### Options

| Option             | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `-o, --outdir`     | Set the output directory. Defaults to `public/dist`.        |
| `-c, --config`     | Set the config file path. Defaults to `svelteup.config.js`. |
| `--format`         | Set the output format: `esm` or `iife`. Defaults to `esm`.  |
| `--global-name`    | Set the IIFE global name. Defaults to `SvelteupBundle`.     |
| `--code-splitting` | Enable ESM code splitting. Defaults to `false`.             |
| `-d, --dev`        | Start development mode with a static file server.           |
| `-w, --watch`      | Watch and rebuild without starting the static file server.  |
| `-v, --version`    | Print the installed version.                                |
| `-h, --help`       | Print CLI help.                                             |

### Examples

```bash
svelteup bundle.js
svelteup components -o public/dist
svelteup components -d
```

## Configuration

Create `svelteup.config.js`, `svelteup.config.mjs`, or `svelteup.config.ts` in your project root. CLI options override matching config values.

```javascript
import { defineConfig } from 'svelteup';
import { sveltePreprocess } from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  entry: 'components/index.js',
  outdir: 'public/dist',
  format: 'esm',
  globalName: 'SvelteupBundle',
  codeSplitting: false,
  compilerOptions: {
    customElement: false,
  },
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [autoprefixer()],
    },
  }),
  serveOptions: {
    servedir: 'public',
    port: 9527,
    host: 'localhost',
  },
});
```

### Config Reference

| Parameter         | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `entry`           | File or directory entry used when the CLI entry is omitted.         |
| `outdir`          | Directory for generated bundles.                                    |
| `format`          | Output format. Use `esm` or `iife`.                                 |
| `globalName`      | Global variable name used for `iife` output.                        |
| `codeSplitting`   | Enable Rolldown code splitting for ESM output. Defaults to `false`. |
| `compilerOptions` | Options passed to the Svelte compiler.                              |
| `preprocess`      | Svelte preprocess configuration.                                    |
| `serveOptions`    | Development server options used in development mode.                |
| `onRebuild`       | Rebuild hook for development workflows.                             |

Svelteup sets `compilerOptions.customElement` to `true` by default. Set it to `false` when you want to use Svelte as a client-rendered app without custom elements.

### Code Splitting

Svelteup keeps code splitting disabled by default so a custom element can be embedded as one predictable file. Enable it when you ship ESM output and want dynamic imports or shared chunks:

```javascript
export default defineConfig({
  entry: 'components/index.js',
  format: 'esm',
  codeSplitting: true,
});
```

Code splitting is not available for `iife` output because split chunks are loaded through native ESM imports.

## JavaScript API

```javascript
import svelteup from 'svelteup';

svelteup('components/index.js', {
  outdir: 'public/dist',
  serveOptions: {
    servedir: 'public',
  },
});
```

## Examples

Run one of the example projects locally:

```bash
cd examples/custom-element
pnpm exec svelteup -d
```

Available examples:

- [custom-element](./examples/custom-element)
- [custom-element-split](./examples/custom-element-split)
- [code-splitting](./examples/code-splitting)
- [no-custom-element](./examples/no-custom-element)

## Templates

- [svelteup-starter](https://github.com/brandonxiang/svelteup-starter)
- [keynote-svelte](https://github.com/WhatisHappyPlanet/keynote-svelte)
- [chrome-extension-svelte](https://github.com/brandonxiang/chrome-extension-svelte)

## License

[MIT](./LICENSE) @brandonxiang
