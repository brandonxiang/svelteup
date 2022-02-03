import { createServer } from 'livereload';
import path from 'path';
import { cwd } from '../command/const';
import { LivereloadPlugin } from '../interface/LivereloadPlugin';
import fse from 'fs-extra';

const liveStr = `;(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src =  '//' + (/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/.test(self.location.host) ? self.location.host : 'localhost').split(':')[0] + ':3333/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);`;

export const livereoloadPlugin: LivereloadPlugin = (opts) => {
  const servePath = path.resolve(cwd(), opts.servedir);

  //TODO: dynamic port
  const server = createServer({ port: 3333 });
  server.watch(servePath);

  return {
    name: 'livereload',
    setup(build) {
      const { entryPoints } = build.initialOptions;
      if (entryPoints) {
        if (Array.isArray(entryPoints)) {
          const entries = entryPoints.map((entry) => {
            return path.basename(entry);
          });
          const re = new RegExp(entries.join('|'));

          build.onLoad({ filter: re }, async (args) => {
            const source = fse.readFileSync(args.path, 'utf-8');

            return {
              contents: source + liveStr,
            };
          });
        }
      }
    },
  };
};
