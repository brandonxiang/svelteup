#!/usr/bin/env node

import sade from 'sade';
import action from './command/index';
const pkg = require('../package.json');

sade('svelteup [entry]', true)
  .version(pkg.version)
  .describe('Bundle your Svelte Components')
  .describe('Parameter Entry can be a file')
  .describe('Default Entry \'components/index.js\'')
  .example('index.js -s public')
  .example('bundle.js')
  .example('components/index.js -o public/dist')
  .option('-w, --watch', 'Set Watch Mode, Default false')
  .option('-o, --outdir', 'Set output directory, Default public/dist')
  .option('-s, --servedir', 'Set Serve directory in dev, Default public')
  .action(action)
  .parse(process.argv, {
    default: {
      watch: false,
      servedir: '',
      outdir: 'public/dist'
    }
  });



