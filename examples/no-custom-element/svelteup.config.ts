import { sveltePreprocess } from 'svelte-preprocess'
import autoprefixer from 'autoprefixer';

export default {
  entry: 'components/index.js',
  outdir: 'public/dist',
  compilerOptions: {
    customElement: false,
  },
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [autoprefixer],
    },
  }),
};
