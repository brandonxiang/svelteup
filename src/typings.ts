import { Plugin } from 'esbuild'

export interface PluginFunc{
  (opts: {servedir: string}): Plugin;
}

interface Options {
  watch: boolean,
  servedir: string,
  port: number,
  outdir: string,
  minify: boolean,
  onRebuild?: () => void 
}

export interface FuncOptions extends Options {
  _: string[],
}

export interface CommandOptions extends Options {
  entryPoints: string[],
}