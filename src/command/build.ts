import esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import fs from 'fs';
import globby from 'globby';

interface Options {
    _: string[],
    outdir: string,
    servedir: string,
}


function runEsbuild(opts: {
    entryPoints: string[],
    outdir: string,
    servedir: string,
}) {
    const {entryPoints, outdir, servedir} = opts;

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
    const { outdir, servedir } = opts;

    const stat = fs.statSync(entry);

    if(stat.isDirectory()) {
        const entryPoints = globby.sync(entry);
        runEsbuild({entryPoints, outdir,  servedir});
    }

    if(stat.isFile()) {
        runEsbuild({entryPoints: [entry], outdir,  servedir})
    }

}