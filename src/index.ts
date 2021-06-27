#!/usr/bin/env node

import sade from 'sade';
import build from './command/build';

sade('svelteup [entry]', true)
  .version('1.0.0')
  .describe('Bundle your Svelte Components')
  .describe('Parameter Entry can be a file or a directory')
  .example('index.js -S public')
  .example('bundle.js')
  .example('components -O public/dist')
  .option('-O, --outdir', 'Set output directory')
  .option('-S, --servedir', 'Set Serve directory in dev mode')
  .action(build)
  .parse(process.argv, {
    default: {
      servedir: '',
      outdir: 'dist'
    }
  });



