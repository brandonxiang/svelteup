# svelteup

[![GitHub license](https://img.shields.io/github/license/brandonxiang/svelteup)](https://github.com/brandonxiang/svelteup/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](https://github.com/brandonxiang/svelteup/compare)
[![npm version](https://badgen.net/npm/v/svelteup)](https://npm.im/svelteup)
[![npm downloads](https://badgen.net/npm/dm/svelteup)](https://npm.im/svelteup)

> web component + svelte + esbuild = svelteup
>
> client rendering + light weight + extremly fast = svelteup

Web component is the future web tech, which is suitable with a client rendering and light weight frontend framework, [svelte](https://svelte.dev/).

If we want some components in a simple project, please svelteup. More details on [examples](./examples)

## Entry

The entry can be a file or a directory. Please reference to [examples](./examples)

### bundle web components seperately

The entry should be a directory, and each svelte file will be a seperate entry.

### bundle web components all in one

The entry should be a file, and all the web components should be bundled together.

## Startup

### 1.Startup as CLI

A command line is used to bundle svelte components as web component default.

```bash
$ ·> svelteup --help

  Description
    Bundle your Svelte Components
    Parameter Entry can be a file
    Default Entry 'components/index.js'

  Usage
    $ svelteup [entry] [options]

  Options
    -o, --outdir      Set output directory (default public/dist)
    -c, --config      Set config path (default svelteup.config.js)
    -d, --dev         [Development] Dev Mode with serving static resources (default false)
    -w, --watch       [Development] Watch Mode without serving static resources (default false)
    -s, --servedir    [Development] Static resources directory
    -p, --port        [Development] Serve port (default 5000)
    -v, --version     Displays current version
    -h, --help        Displays this message

  Examples
    $ svelteup -s public
    $ svelteup bundle.js
    $ svelteup components/index.js -o public/dist
```

### 2.Startup using a Config File

Please put a `svelteup.config.js` or `svelteup.config.ts` in the project root path.

You can use preprocess and compileOptions. Even you can compile svelte with `customElement:false`.

```javascript
import sveltePreprocess from "svelte-preprocess";

export default {
  entry: "examples/no-custom-element/components/index.js",
  outdir: "examples/no-custom-element/public/dist",
  servedir: "examples/no-custom-element/public",
  compileOptions: {
    customElement: false,
  },
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [require("autoprefixer")],
    },
  }),
};
```

#### Parameters of `svelteup.config.js`

| Parameter      | Description                 |
| -------------- | --------------------------- |
| entry          | bundle entry                |
| compileOptions | svelte compiler option      |
| preprocess     | svelte-preprocess option    |
| onRebuild      | rebuild hook in development |

### 3.Startup as JS API

```javascript
import svelteup from "svelteup";

svelteup("componets/index.js", { servedir: "public" });
```

## Demo Template

Please have a try.

- [svelteup-starter](https://github.com/brandonxiang/svelteup-starter)
- [keynote-svelte](https://github.com/WhatisHappyPlanet/keynote-svelte)
- [chrome-extension-svelte](https://github.com/brandonxiang/chrome-extension-svelte)

## License

[MIT](./LICENSE) @brandonxiang
