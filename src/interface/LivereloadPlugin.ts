import { Plugin } from 'esbuild';

export interface LivereloadPlugin {
  (): Plugin;
}
