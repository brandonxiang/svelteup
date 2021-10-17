export const cwd = () => process.cwd();

export const defaultOutputPath = 'svelteup.config.js';

export const defaultEntry = 'components/index.js';

export const defaultCompileOptions = {
    customElement: true
};

export const defaultCommandOptions = {    
    watch: false,
    servedir: '',
    port: 5000,
    outdir: 'public/dist',
    minify: true
}