import esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import fs from 'fs';
import globby from 'globby';

interface Options {
    _: string[],
    watch: boolean,
    outdir: string,
    servedir: string,
}


function runEsbuild(opts: {
    entryPoints: string[],
    watch: boolean,
    outdir: string,
    servedir: string,
}) {
    const {entryPoints, watch, outdir, servedir} = opts;

    if(servedir) {
        esbuild.serve({
           servedir,
           port: 5000,
           onRequest: (args) => {
               console.log(`[${args.method}] ${args.status} - ${args.path}`);
           }
        }, {
            entryPoints,
            outdir,
            format: "esm",
            minify: false,
            bundle: true,
            splitting: false,
            plugins: [
                sveltePlugin({
                    compileOptions: {
                        customElement: true
                    }
                })
            ]
        })
        console.log('[Success] Your application is ready~! 🚀 ')
        console.log('- Local:      http://localhost:5000\r\n')
        console.log('-----------------------------------\r\n')

    } else {
        esbuild.build({
            entryPoints,
            outdir,
            format: "esm",
            minify: false,
            bundle: true,
            splitting: false,
            watch: watch? {
                onRebuild(error, result) {
                    if (error) console.error('[Error] Watch build:', error)
                    else console.log('[Success] File Rebuilding...')
                },
            }: false,
            plugins: [
                sveltePlugin({
                    compileOptions: {
                        customElement: true
                    }
                })
            ]
        })
        console.log('[Success] All components are bundled')
    }
}


export default (entry: string, opts: Options) => {
    const { watch, outdir, servedir } = opts;

    const stat = fs.statSync(entry);

    if(stat.isDirectory()) {
        const entryPoints = globby.sync(entry);
        runEsbuild({entryPoints, watch , outdir,  servedir});
    }

    if(stat.isFile()) {
        runEsbuild({entryPoints: [entry], watch,  outdir,  servedir})
    }

}