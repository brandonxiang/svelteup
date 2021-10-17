# svelteup

[![CodeFactor](https://www.codefactor.io/repository/github/brandonxiang/svelteup/badge)](https://www.codefactor.io/repository/github/brandonxiang/svelteup)
[![GitHub license](https://img.shields.io/github/license/brandonxiang/svelteup)](https://github.com/brandonxiang/svelteup/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](https://github.com/brandonxiang/svelteup/compare)

> web component + svelte + esbuild = svelteup
>
> client rendering + light weight + extremly fast = svelteup

Web component is the future web tech, which is suitable with a client rendering and light weight frontend framework, [svelte](https://svelte.dev/).

If we want some components in a simple project, please svelteup. More details on [examples](./examples)

## Startup as CLI

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
    -c, --config      Set config path, Default svelteup.config.js
    -o, --outdir      Set output directory, Default public/dist
    -w, --watch       [Development] Watch Mode, Default false
    -s, --servedir    [Development] Serve directory
    -p, --port        [Development] Serve port, Default 5000
    -m, --minify      [Production] Minify output, Default true
    -v, --version     Displays current version
    -h, --help        Displays this message

  Examples
    $ svelteup -s public
    $ svelteup bundle.js
    $ svelteup components/index.js -o public/dist
```

## Startup using a Config File

Please put a `svelteup.config.js` or `svelteup.config.ts` in the project root path.

You can use preprocess and compileOptions. Even you can compile svelte with `customElement:false`.

```javascript
import sveltePreprocess from 'svelte-preprocess';

export default {
    entry: 'examples/no-custom-element/components/index.js',
    outdir: 'examples/no-custom-element/public/dist',
    servedir: 'examples/no-custom-element/public',
    compileOptions: {
        customElement: false,
    },
    preprocess: sveltePreprocess({
        postcss: {
            plugins: [
                require("autoprefixer"),  
            ],
        }
    }),
}
```

### Parameters of `svelteup.config.js`

Parameter  | Description
------------- | -------------
entry  | bundle entry
compileOptions  | svelte compiler option
preprocess | svelte-preprocess option
onRebuild | rebuild hook in development

## Startup as JS API

```javascript
import svelteup from 'svelteup';

svelteup('componets/index.js', { servedir: 'public' });
```

## Demo Template

Please have a try.

- [svelteup-starter](https://github.com/brandonxiang/svelteup-starter)
- [keynote-svelte](https://github.com/WhatisHappyPlanet/keynote-svelte)
- [chrome-extension-svelte](https://github.com/brandonxiang/chrome-extension-svelte)

## License

[MIT](./LICENSE) @brandonxiang
