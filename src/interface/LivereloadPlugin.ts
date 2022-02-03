import { Plugin } from 'esbuild';

export interface LivereloadPlugin {
  (opts: { servedir: string }): Plugin;
}
