import { build } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { CommandOptions } from '../typings';

export default (opts: CommandOptions) =>{
    const {entryPoints, outdir, watch, minify} = opts;

    build({
        entryPoints,
        outdir,
        format: "esm",
        minify,
        bundle: true,
        splitting: false,
        sourcemap: watch,
        
        watch: watch? {
            onRebuild(error, result) {
                if (error) console.error('[Error] Watch build:', error)
                else {
                    console.log('[Success] File Rebuilding...')
                    opts.onRebuild && opts.onRebuild();
                }
            },
        }: false,
        plugins: [
            sveltePlugin({
                compileOptions: {
                    customElement: true
                }
            }),
        ]
    })
    console.log('[Success] All components are bundled')
}