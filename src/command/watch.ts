import { Options } from '../interface/CommandOptions';
import { watchBundle } from '../bundler';

const watchCommand = async (opts: Options) => {
  const { entryPoints, outdir, watch, minify } = opts;

  watchBundle({
    entryPoints,
    outdir,
    sourcemap: watch,
    minify,
    preprocess: opts.preprocess,
    compilerOptions: opts.compilerOptions,
    onRebuild: opts.onRebuild,
  });

  console.log('[Success] File Watching~! 🚀');
};

export default watchCommand;
