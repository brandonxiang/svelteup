import { context } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { Options } from '../interface/CommandOptions';
import { defaultCompileOptions } from './const';
import { livereoloadPlugin } from '../plugins/livereloadPlugin';

const serveCommand = async (opts: Options) => {
  const { entryPoints, outdir, servedir, port } = opts;

  let ctx = await context({
    entryPoints,
    outdir,
    format: 'esm',
    minify: false,
    bundle: true,
    splitting: false,
    sourcemap: true,
    plugins: [
      sveltePlugin({
        preprocess: opts.preprocess,
        compilerOptions: {
          ...defaultCompileOptions,
          ...opts.compilerOptions,
        },
      }),
      livereoloadPlugin(),
    ],
  });

  await ctx.watch()

  const {host: resultHost, port: resultPort} = await ctx.serve({servedir, port, host: 'localhost'});

  console.log('[Success] Your application is ready~! 🚀 ');
  console.log('[Success] File Watching~! 🚀 \r\n\r\n');
  console.log(`- Local:      http://${resultHost}:${resultPort}\r\n`);
  console.log('-----------------------------------\r\n');
};

export default serveCommand;