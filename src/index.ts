import fs from 'fs';
import { FuncOptions, CommandOptions } from './typings';
import serve from './command/serve';
import build from './command/build';

function runEsbuild(opts: CommandOptions) {
  const {servedir} = opts;

  if(servedir) {
    serve(opts);
  } else {
    build(opts);
  }
}


function svelteup (entry: string, opts: FuncOptions) {
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

