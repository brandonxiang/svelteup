import { Plugin } from 'esbuild'
import type { CompileOptions } from "svelte/types/compiler/interfaces";
import type { PreprocessorGroup } from "svelte/types/compiler/preprocess/types";

export interface PluginFunc{
  (opts: {servedir: string}): Plugin;
}

interface Options {
  // Command Line Option
  config: string,
  watch: boolean,
  servedir: string,
  port: number,
  outdir: string,
  minify: boolean,
  // Config Option
  entry?: string,
  compileOptions?: CompileOptions;
  preprocess?: PreprocessorGroup | PreprocessorGroup[];
  onRebuild?: () => void 
}

export interface FuncOptions extends Options {
  _: string[],
}

export interface CommandOptions extends Options {
  entryPoints: string[],
}