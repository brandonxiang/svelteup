import esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';

interface Options {
    _: string[],
    watch: boolean,
    output: string
}


export default (entry: string, opts: Options) => {
    const { _ : otherEntries, watch, output } = opts;
    esbuild.build({
        entryPoints: [entry, ...otherEntries],
        outdir: output,
        format: "esm",
        minify: !watch,
        bundle: true,
        splitting: true,
        plugins: [
            sveltePlugin({
                compileOptions: {
                    customElement: true
                }
            })
        ]
    })
}