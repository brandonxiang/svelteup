const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'lib/index.js',
    plugins: [nodeExternalsPlugin()],
  });
  