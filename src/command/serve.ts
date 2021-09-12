
import { build }  from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { createServer } from 'livereload';
import path from 'path';
import sirv from 'sirv';
import { CommandOptions, PluginFunc } from '../typings';
import http from 'http';
import fs from 'fs';

const liveStr = `(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src =  '//' + (/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/.test(self.location.host) ? self.location.host : 'localhost').split(':')[0] + ':3333/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);`

const livereoloadPlugin: PluginFunc = (opts) => {

  const servePath = path.resolve(process.cwd(), opts.servedir);

  const server = createServer({port: 3333});
  server.watch(servePath)

  return {
      name: 'livereload',
      setup(params) {
        // TODO: only one entry now supported
        //@ts-ignore
        const entry = params.initialOptions.entryPoints && params.initialOptions.entryPoints[0]
        if(entry) {
          const re = new RegExp(entry);
          params.onLoad({filter: re}, async (args) => {
            const source = fs.readFileSync(args.path, 'utf-8')

            return {
              contents: source + liveStr
            }
          })
        }
      }
  }
}


export default (opts: CommandOptions) => {
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
             compileOptions: {
                 customElement: true
             }
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