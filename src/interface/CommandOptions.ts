import { PreprocessorGroup } from 'svelte/compiler';
import { CompileOptions } from 'svelte/types/compiler/interfaces';


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
  compilerOptions?: CompileOptions;
  preprocess?: PreprocessorGroup | PreprocessorGroup[];
  onRebuild?: () => void;
}
