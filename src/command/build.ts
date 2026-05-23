import { Options } from '../interface/CommandOptions';
import { buildBundle } from '../bundler';

const buildCommand = async (opts: Options) => {
  const { entryPoints, outdir, watch, format, globalName, minify } = opts;

  await buildBundle({
    entryPoints,
    outdir,
    format,
    globalName,
    sourcemap: watch,
    minify,
    preprocess: opts.preprocess,
    compilerOptions: opts.compilerOptions,
    onRebuild: opts.onRebuild,
  });
  console.log('[Success] All components are bundled');
};

export default buildCommand;
