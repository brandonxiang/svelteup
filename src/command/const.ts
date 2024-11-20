import { Options } from "../interface/CommandOptions";
import process from "node:process";

export const cwd = () => process.cwd();

export const defaultConfigPath = './svelteup.config';

export const defaultCompileOptions = {
  customElement: true,
};

export const defaultCommandOptions: Options = {
  entry: 'components',
  outdir: 'public/dist',
  config: './svelteup.config.js',
  dev: false,
  watch: false,
  minify: true,
  serveOptions: {
    servedir: 'public',
    port: 9527,
    host: 'localhost',
    // fallback: 'public/index.html',
  }
};
