
import { build }  from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import sirv from 'sirv';
import { Options } from '../interface/CommandOptions';
import http from 'http';
import { defaultCompileOptions } from './const';
import { livereoloadPlugin } from '../plugins/livereloadPlugin';

export default (opts: Options) => {
  const {entryPoints, outdir, servedir, port} = opts;

  build({
     entryPoints,
     outdir,
     format: "esm",
     minify: false,
     bundle: true,
     splitting: false,
     sourcemap: true,
     watch: {
      onRebuild(error) {
        if (error) console.error('[Error] Watch build:', error)
        else {
          console.log('[Success] File Rebuilding...');
          opts.onRebuild && opts.onRebuild();
        }
      },
     },
     plugins: [
         sveltePlugin({
            preprocess: opts.preprocess,
            compileOptions: {
                ...defaultCompileOptions, 
                ...opts.compileOptions
            },
         }),
         livereoloadPlugin(
           {
            servedir
           }
         )
     ]
 })


 const server = http.createServer(sirv(servedir, {dev:true}));
  server.listen(+port, '0.0.0.0', () => {
    console.log('[Success] Your application is ready~! 🚀 \r\n\r\n')
    console.log(`- Local:      http://localhost:${port}\r\n`)
    console.log('-----------------------------------\r\n')
 });

}