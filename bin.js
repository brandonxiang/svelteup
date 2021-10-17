#!/usr/bin/env node

const sade = require('sade');
const { svelteup } = require('./dist/index.js') ;
const pkg = require('./package.json');

sade('svelteup [entry]', true)
  .version(pkg.version)
  .describe(
    'Bundle your Svelte Components \r\n    ' + 
    'Parameter Entry can be a file \r\n    ' +
    'Default Entry \'components/index.js\''
  )
  .example('-s public')
  .example('bundle.js')
  .example('components/index.js -o public/dist')
  .option('-c, --config', 'Set config path, Default svelteup.config.js')
  .option('-o, --outdir', 'Set output directory, Default public/dist')
  .option('-w, --watch', '[Development] Watch Mode, Default false')
  .option('-s, --servedir', '[Development] Serve directory')
  .option('-p, --port', '[Development] Serve port, Default 5000')
  .option('-m, --minify', '[Production] Minify output, Default true')
  .action(svelteup)
  .parse(process.argv, {});



