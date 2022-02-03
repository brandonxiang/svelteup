import { build } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { Options } from '../interface/CommandOptions';
import { defaultCompileOptions } from './const';

export default (opts: Options) => {
  const { entryPoints, outdir, watch, minify } = opts;

  build({
    entryPoints,
    outdir,
    format: 'esm',
    minify,
    bundle: true,
    splitting: false,
    sourcemap: watch,

    watch: watch
      ? {
          onRebuild(error, result) {
            if (error) console.error('[Error] Watch build:', error);
            else {
              console.log('[Success] File Rebuilding...');
              opts.onRebuild && opts.onRebuild();
            }
          },
        }
      : false,
    plugins: [
      sveltePlugin({
        preprocess: opts.preprocess,
        compileOptions: {
          ...defaultCompileOptions,
          ...opts.compileOptions,
        },
      }),
    ],
  });
  console.log('[Success] All components are bundled');
};
