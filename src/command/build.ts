import { build, context } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { Options } from '../interface/CommandOptions';
import { defaultCompileOptions } from './const';

const buildCommand = (opts: Options) => {
  const { entryPoints, outdir, watch, minify } = opts;

  build({
    entryPoints,
    outdir,
    format: 'esm',
    minify,
    bundle: true,
    splitting: false,
    sourcemap: watch,
    plugins: [
      sveltePlugin({
        preprocess: opts.preprocess,
        compilerOptions: {
          ...defaultCompileOptions,
          ...opts.compilerOptions,
        },
      }),
    ],
  });
  console.log('[Success] All components are bundled');
};

export default buildCommand;