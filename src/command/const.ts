import process from "node:process";

export const cwd = () => process.cwd();

export const defaultConfigPath = './svelteup.config';

export const defaultCompileOptions = {
  customElement: true,
};

export const defaultCommandOptions = {
  entry: 'components',
  outdir: 'public/dist',
  servedir: 'public',
  dev: false,
  watch: false,
  port: 5000,
  minify: true,
};
