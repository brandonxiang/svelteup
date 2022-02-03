export const cwd = () => process.cwd();

export const defaultConfigPath = './svelteup.config';

export const defaultEntry = 'components/index.js';

export const defaultCompileOptions = {
  customElement: true,
};

export const defaultCommandOptions = {
  watch: false,
  servedir: '',
  port: 5000,
  outdir: 'public/dist',
  minify: true,
};
