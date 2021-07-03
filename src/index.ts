#!/usr/bin/env node

import sade from 'sade';
import build from './command/build';
const pkg = require('../package.json');

sade('svelteup [entry]', true)
  .version(pkg.version)
  .describe('Bundle your Svelte Components')
  .describe('Parameter Entry can be a file or a directory')
  .example('index.js -S public')
  .example('bundle.js')
  .example('components -O public/dist')
  .option('-w, --watch', 'Set Watch Mode')
  .option('-o, --outdir', 'Set output directory')
  .option('-s, --servedir', 'Set Serve directory in dev mode')
  .action(build)
  .parse(process.argv, {
    default: {
      watch: false,
      servedir: '',
      outdir: 'dist'
    }
  });



