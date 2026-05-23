# svelteup

[![GitHub license](https://img.shields.io/github/license/brandonxiang/svelteup)](https://github.com/brandonxiang/svelteup/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](https://github.com/brandonxiang/svelteup/compare)
[![npm version](https://badgen.net/npm/v/svelteup)](https://npm.im/svelteup)
[![npm downloads](https://badgen.net/npm/dm/svelteup)](https://npm.im/svelteup)

Svelteup bundles Svelte components into browser-ready custom elements with Rolldown.

It is built for small, precise embeds: widgets, page fragments, custom elements, and Svelte-powered UI that you can insert into an existing website without moving that website to a full Svelte app stack.

## Features

- Custom element output by default through `compilerOptions.customElement: true`.
- File and directory entries for single-bundle or multi-component output.
- ESM output by default, with optional `iife` output for classic script embeds.
- Optional ESM code splitting for dynamic imports and shared chunks.
- Static dev server with watch rebuilds and live reload.
- Build reports with raw, gzip, and brotli sizes.
- Embed snippets for output scripts and inferred custom-element tags.
- External dependency and IIFE global configuration.
- Relative CSS `url(...)` asset copying with `publicPath` support.

## Installation

```bash
pnpm add -D svelteup
```

Run the CLI through your package manager:

```bash
pnpm exec svelteup --help
```

## Quick Start

Create a Svelte custom element:

```svelte
<!-- components/counter-app.svelte -->
<svelte:options customElement="counter-app" />

<script>
  let count = $state(0);
</script>

<button onclick={() => count += 1}>count {count}</button>
```

Build it:

```bash
svelteup components -o public/dist
```

Embed it in HTML:

```html
<counter-app></counter-app>
<script type="module" src="./dist/counter-app.js"></script>
```

## Entry Points

Svelteup accepts a JavaScript or TypeScript file, or a directory of first-level Svelte components.

Use a file entry when you want one bundle that imports everything it needs:

```bash
svelteup components/index.js -o public/dist
```

Use a directory entry when you want each first-level `.svelte` file to become its own browser-ready bundle:

```bash
svelteup components -o public/dist
```

## Development

Start the dev server with watch rebuilds and live reload:

```bash
svelteup components -d
```

By default, Svelteup serves `public` at `http://localhost:9527` and writes bundles to `public/dist`.

## CLI

```bash
svelteup [entry] [options]
```

| Option             | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `-o, --outdir`     | Set the output directory. Defaults to `public/dist`.        |
| `-c, --config`     | Set the config file path. Defaults to `svelteup.config.js`. |
| `--format`         | Set the output format: `esm` or `iife`. Defaults to `esm`.  |
| `--global-name`    | Set the IIFE global name. Defaults to `SvelteupBundle`.     |
| `--code-splitting` | Enable ESM code splitting. Defaults to `false`.             |
| `--public-path`    | Set the public URL prefix for emitted assets and snippets.  |
| `--assets-dir`     | Set the asset output directory name. Defaults to `assets`.  |
| `--external`       | Mark dependencies as external with a comma-separated list.  |
| `--globals`        | Set IIFE external globals as a JSON object.                 |
| `--analyze`        | Print a bundle dependency breakdown.                        |
| `--no-report`      | Disable size and embed snippet reporting.                   |
| `-d, --dev`        | Start development mode with a static file server.           |
| `-w, --watch`      | Watch and rebuild without starting the static file server.  |
| `-v, --version`    | Print the installed version.                                |
| `-h, --help`       | Print CLI help.                                             |

## Configuration

Create `svelteup.config.js`, `svelteup.config.mjs`, or `svelteup.config.ts` in your project root. CLI options override config values.

```javascript
import { defineConfig } from 'svelteup';

export default defineConfig({
  entry: 'components/index.js',
  outdir: 'public/dist',
  format: 'esm',
  codeSplitting: false,
  publicPath: './dist/',
  assetsDir: 'assets',
  analyze: false,
  report: true,
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
| `publicPath`      | Public URL prefix used for emitted assets and embed snippets.       |
| `assetsDir`       | Directory name for copied CSS `url(...)` assets.                    |
| `external`        | Dependencies left outside the bundle.                               |
| `globals`         | Global variable names for external dependencies in `iife` output.   |
| `analyze`         | Print the largest rendered modules for each output chunk.           |
| `report`          | Print size reporting and embed snippets after build.                |
| `compilerOptions` | Options passed to the Svelte compiler.                              |
| `preprocess`      | Svelte preprocess configuration.                                    |
| `serveOptions`    | Development server options used in development mode.                |
| `onRebuild`       | Rebuild hook for development workflows.                             |

Svelteup sets `compilerOptions.customElement` to `true` by default. Set it to `false` when you want to use Svelte as a client-rendered app without custom elements.

## Embedding Custom Elements

Svelte custom elements can expose attributes and DOM properties through `<svelte:options customElement={...}>`.

```svelte
<svelte:options
  customElement={{
    tag: 'profile-card',
    props: {
      label: { attribute: 'label', reflect: true, type: 'String' },
    },
  }}
/>
```

Host pages can pass children into slots and listen for custom events with standard DOM APIs:

```html
<profile-card label="Brandon">Profile content</profile-card>

<script type="module" src="./dist/profile-card.js"></script>
<script>
  document.querySelector('profile-card').addEventListener('confirm', (event) => {
    console.log(event.detail);
  });
</script>
```

Use CSS custom properties when a host page needs to theme shadow DOM styles:

```css
button {
  color: var(--profile-card-accent, #111827);
}
```

## Output Formats

Svelteup emits ESM by default:

```javascript
export default defineConfig({
  format: 'esm',
});
```

Use `iife` when the host page needs a classic script:

```javascript
export default defineConfig({
  format: 'iife',
  globalName: 'WidgetBundle',
});
```

## Code Splitting

Svelteup keeps code splitting disabled by default so a custom element can be embedded as one predictable file. Enable it for ESM builds that use dynamic imports or shared chunks:

```javascript
export default defineConfig({
  entry: 'components/index.js',
  format: 'esm',
  codeSplitting: true,
});
```

Code splitting is not available for `iife` output because split chunks load through native ESM imports.

See [examples/code-splitting](./examples/code-splitting) for a dynamic import example.

## Build Reports

Production builds print:

- Raw, gzip, and brotli sizes for emitted JavaScript and CSS files.
- Embed snippets for entry scripts.
- Custom-element tags when Svelteup can infer them from imported `.svelte` files.

Disable this output with `report: false` or `--no-report`.

Use `analyze: true` or `--analyze` to print the largest rendered modules in each output chunk.

## Externals

Use `external` when the host page already provides a dependency. For `iife` output, pair external modules with `globals`:

```javascript
export default defineConfig({
  entry: 'components/index.js',
  format: 'iife',
  globalName: 'WidgetBundle',
  external: ['host-sdk'],
  globals: {
    'host-sdk': 'HostSDK',
  },
});
```

## Assets

Svelteup copies relative CSS `url(...)` assets referenced from Svelte component styles into `assetsDir`, then rewrites the CSS URL with `publicPath`.

```javascript
export default defineConfig({
  outdir: 'public/dist',
  publicPath: '/dist/',
  assetsDir: 'assets',
});
```

Browser target policy: Svelteup emits modern browser JavaScript. It does not transpile syntax for legacy browsers. Use modern ESM-capable browsers for the default `esm` output, and use `iife` when the host page requires a classic script.

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
