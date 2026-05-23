import { Options } from '../interface/CommandOptions';
import { watchBundle } from '../bundler';

const watchCommand = async (opts: Options) => {
  const {
    entryPoints,
    outdir,
    watch,
    format,
    globalName,
    codeSplitting,
    publicPath,
    assetsDir,
    external,
    globals,
    analyze,
    minify,
  } = opts;

  watchBundle({
    entryPoints,
    outdir,
    format,
    globalName,
    codeSplitting,
    publicPath,
    assetsDir,
    external,
    globals,
    analyze,
    sourcemap: watch,
    minify,
    preprocess: opts.preprocess,
    compilerOptions: opts.compilerOptions,
    onRebuild: opts.onRebuild,
  });

  console.log('[Success] File Watching~! 🚀');
};

export default watchCommand;
