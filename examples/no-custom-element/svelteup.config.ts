import sveltePreprocess from 'svelte-preprocess';

export default {
  entry: 'components/index.js',
  outdir: 'public/dist',
  servedir: 'public',
  compilerOptions: {
    customElement: false,
  },
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [require('autoprefixer')],
    },
  }),
};
