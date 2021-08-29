import { Plugin } from 'esbuild'

export interface PluginFunc{
  (opts: {servedir: string}): Plugin;
}

export interface Options {
  _: string[],
  watch: boolean,
  outdir: string,
  servedir: string,
  onRebuild?: () => void 
}

export interface CommandOptions {
  entryPoints: string[],
  watch: boolean,
  outdir: string,
  servedir: string,
  onRebuild?: () => void 
}