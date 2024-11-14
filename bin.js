#!/usr/bin/env node

const sade = require('sade');
const { svelteup } = require('./dist/index.js');
const pkg = require('./package.json');

sade('svelteup [entry]', true)
  .version(pkg.version)
  .describe(
    'Bundle your Svelte Components \r\n    ' +
      'Parameter Entry can be a file \r\n    ' +
      "Default Entry 'components'",
  )
  .example('-s public')
  .example('bundle.js')
  .example('components -o public/dist')
  .option('-o, --outdir', 'Set output directory (default public/dist)')
  .option('-c, --config', 'Set config path (default svelteup.config.js)')
  .option(
    '-d, --dev',
    '[Development] Dev Mode with serving static resources (default false)',
  )
  .option(
    '-w, --watch',
    '[Development] Watch Mode without serving static resources (default false)',
  )
  .option('-s, --servedir', '[Development] Static resources directory')
  .option('-p, --port', '[Development] Serve port (default 9527)')
  .action(svelteup)
  .parse(process.argv, {});
