import type { CompileOptions } from 'svelte/types/compiler/interfaces';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';

export type OutputFormat = 'esm' | 'iife';
export type ExternalOption = string[] | ((id: string) => boolean);

export interface ServeOptions {
  servedir: string;
  port: number;
  host?: string;
}

export interface Options {
  _?: string[];
  entryPoints?: string[];
  // Command Line Option
  config: string;
  dev: boolean;
  watch: boolean;
  // servedir: string;
  // port: number;
  outdir: string;
  format: OutputFormat;
  globalName?: string;
  codeSplitting: boolean;
  publicPath?: string;
  assetsDir: string;
  external?: ExternalOption;
  globals?: Record<string, string>;
  analyze: boolean;
  report: boolean;
  minify: boolean;
  // Config Option
  entry: string;
  compilerOptions?: CompileOptions;
  preprocess?: PreprocessorGroup | PreprocessorGroup[];
  onRebuild?: () => void;
  serveOptions: ServeOptions;
}

export type SvelteupConfig = Partial<Omit<Options, '_' | 'entryPoints'>>;
