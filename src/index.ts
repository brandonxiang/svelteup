import fs from 'fs';
import { Options, CommandOptions } from './typings';
import serve from './command/serve';
import build from './command/build';

function runEsbuild(opts: CommandOptions) {
  const {entryPoints, watch, outdir, servedir} = opts;

  if(servedir) {
    serve({entryPoints, watch, outdir, servedir});
  } else {
    build({entryPoints, watch, outdir, servedir});
  }
}


function svelteup (entry: string, opts: Options) {
  const { _, ...rest } = opts;

  entry = entry || 'components/index.js'

  const stat = fs.statSync(entry);

  if(stat.isFile()) {
    runEsbuild({ entryPoints: [entry], ...rest })
  } else {
     console.error('[Error] Entry Type is not supported yet')
     process.exit(1);
  }
}

export default svelteup;
export { svelteup };

