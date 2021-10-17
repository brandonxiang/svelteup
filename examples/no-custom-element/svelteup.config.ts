import sveltePreprocess from 'svelte-preprocess';

export default {
    entry: 'examples/no-custom-element/components/index.js',
    outdir: 'examples/no-custom-element/public/dist',
    servedir: 'examples/no-custom-element/public',
    compileOptions: {
        customElement: false,
    },
    preprocess: sveltePreprocess({
        postcss: {
            plugins: [
                require("autoprefixer"),  
            ],
        }
    }),
}