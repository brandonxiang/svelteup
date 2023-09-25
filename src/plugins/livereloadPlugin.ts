import path from 'path';
import { LivereloadPlugin } from '../interface/LivereloadPlugin';
import fs from 'node:fs';

const liveStr = `;new EventSource('/esbuild').addEventListener('change', () => location.reload());`;

export const livereoloadPlugin: LivereloadPlugin = () => {

  return {
    name: 'livereload',
    setup(build) {
      const { entryPoints } = build.initialOptions;
      if (entryPoints) {
        if (Array.isArray(entryPoints)) {
          const entries = entryPoints.map((entry) => {
            if(typeof entry === 'string') {
              return path.basename(entry);
            };
            return path.basename(entry.in);
          });
          const re = new RegExp(entries.join('|'));

          build.onLoad({ filter: re }, async (args) => {
            const source = fs.readFileSync(args.path, 'utf-8');

            return {
              contents: source + liveStr,
            };
          });
        }
      }
    },
  };
};
