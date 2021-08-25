# svelteup


[![CodeFactor](https://www.codefactor.io/repository/github/brandonxiang/svelteup/badge)](https://www.codefactor.io/repository/github/brandonxiang/svelteup)
[![GitHub license](https://img.shields.io/github/license/brandonxiang/svelteup)](https://github.com/brandonxiang/svelteup/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](https://github.com/brandonxiang/svelteup/compare)


> web component + svelte + esbuild = svelteup

> client rendering + light weight + extremly fast = svelteup

Web component is the future web tech, which is suitable with a client rendering and light weight frontend framework, [svelte](https://svelte.dev/).

If we want some components in a simple project, please svelteup. More details on [examples](./examples)

## Startup

A command line is used to bundle svelte components as web component default.

```bash
$ svelteup --help

  Description
    Bundle your Svelte Components 
    Parameter Entry can be a file 
    Default Entry 'components/index.js'

  Usage
    $ svelteup [entry] [options]

  Options
    -w, --watch       Set Watch Mode, Default false
    -o, --outdir      Set output directory, Default public/dist
    -s, --servedir    Set Serve directory in dev
    -v, --version     Displays current version
    -h, --help        Displays this message

  Examples
    $ svelteup -s public
    $ svelteup bundle.js
    $ svelteup components/index.js -o public/dist
```

## Demo Template

Please have a try.

- [svelteup-starter](https://github.com/brandonxiang/svelteup-starter)
- [keynote-svelte](https://github.com/WhatisHappyPlanet/keynote-svelte)
- [chrome-extension-svelte](https://github.com/brandonxiang/chrome-extension-svelte)

## License

[MIT](./LICENSE) @brandonxiang
