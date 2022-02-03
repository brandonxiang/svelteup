import type { CompileOptions } from 'svelte/types/compiler/interfaces';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess/types';

export interface Options {
  _: string[];
  entryPoints: string[];
  // Command Line Option
  config: string;
  dev: boolean;
  watch: boolean;
  servedir: string;
  port: number;
  outdir: string;
  minify: boolean;
  // Config Option
  entry?: string;
  compileOptions?: CompileOptions;
  preprocess?: PreprocessorGroup | PreprocessorGroup[];
  onRebuild?: () => void;
}
