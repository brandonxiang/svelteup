import { build, context } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { Options } from '../interface/CommandOptions';
import { defaultCompileOptions } from './const';

const watchCommand = async (opts: Options) => {
  const { entryPoints, outdir, watch, minify } = opts;

  let ctx = await context({
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

  await ctx.watch();
  console.log('[Success] File Watching~! 🚀');
};

export default watchCommand;