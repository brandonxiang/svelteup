#!/usr/bin/env node

import sade from 'sade';
import action from './command/index';
const pkg = require('../package.json');

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
  .option('-w, --watch', 'Set Watch Mode, Default false')
  .option('-o, --outdir', 'Set output directory, Default public/dist')
  .option('-s, --servedir', 'Set Serve directory in dev')
  .action(action)
  .parse(process.argv, {
    default: {
      watch: false,
      servedir: '',
      outdir: 'public/dist'
    }
  });



