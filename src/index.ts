#!/usr/bin/env node

import sade from 'sade';
import build from './command/build';

sade('svelteup [entry]', true)
  .version('1.0.0')
  .describe('Bundle your Svelte Components')
  .example('index.js --watch')
  .example('bundle.js')
  .option('-W, --watch', 'Watch file change（dev mode）')
  .option('-O, --output', 'Set Output Javascript')
  .action(build)
  .parse(process.argv);



