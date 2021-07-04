import fs from 'fs';
import { Options, CommandOptions } from '../typings';
import serve from './serve';
import build from './build';

function runEsbuild(opts: CommandOptions) {
  const {entryPoints, watch, outdir, servedir} = opts;

  if(servedir) {
    serve({entryPoints, watch, outdir, servedir});
  } else {
    build({entryPoints, watch, outdir, servedir});
  }
}


export default (entry: string, opts: Options) => {
  const { watch, outdir, servedir } = opts;

  entry = entry || 'components/index.js'

  const stat = fs.statSync(entry);

  if(stat.isFile()) {
    runEsbuild({entryPoints: [entry], watch,  outdir,  servedir})
  } else {
     console.error('[Error] Entry Type is not supported yet')
     process.exit(1);
  }
}
