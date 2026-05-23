import { Options } from '../interface/CommandOptions';
import { buildBundle } from '../bundler';

const buildCommand = async (opts: Options) => {
  const { entryPoints, outdir, watch, minify } = opts;

  await buildBundle({
    entryPoints,
    outdir,
    sourcemap: watch,
    minify,
    preprocess: opts.preprocess,
    compilerOptions: opts.compilerOptions,
    onRebuild: opts.onRebuild,
  });
  console.log('[Success] All components are bundled');
};

export default buildCommand;
