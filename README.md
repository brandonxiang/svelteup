# svelteup

> web component + svelte + esbuild = svelteup

> client rendering + light weight + extremly fast = svelteup

Web component is the future web tech, which is suitable with a client rendering and light weight frontend framework, svelte.

If we want some components in a simple project, please svelteup.

More details on [examples](./examples)

## Startup

The command line is used to bundle svelte components as web component default.

```bash
$ svelteup --help

  Description
    Parameter Entry can be a file or a directory

  Usage
    $ svelteup [entry] [options]

  Options
    -O, --outdir      Set output directory
    -S, --servedir    Set Serve directory in dev mode
    -v, --version     Displays current version
    -h, --help        Displays this message

  Examples
    $ svelteup index.js -S public
    $ svelteup bundle.js
    $ svelteup components -O public/dist
```

## License

[MIT](./LICENSE) @brandonxiang
