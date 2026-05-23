import { Options } from '../interface/CommandOptions';
import { buildBundle, watchBundle } from '../bundler';
import { createDevServer } from '../server/devServer';
import { injectLiveReload } from '../server/liveReload';

const serveCommand = async (opts: Options) => {
  const { entryPoints, outdir, serveOptions, minify } = opts;

  await buildBundle({
    entryPoints,
    outdir,
    sourcemap: true,
    minify: false,
    preprocess: opts.preprocess,
    compilerOptions: opts.compilerOptions,
    onRebuild: opts.onRebuild,
  });
  injectLiveReload(entryPoints, outdir);

  const server = await createDevServer(serveOptions);
  const onRebuild = () => {
    injectLiveReload(entryPoints, outdir);
    opts.onRebuild?.();
    server.reload();
  };

  const watcher = watchBundle({
    entryPoints,
    outdir,
    sourcemap: true,
    minify,
    preprocess: opts.preprocess,
    compilerOptions: opts.compilerOptions,
    onRebuild,
  });
  await watcher.ready;

  console.log('[Success] Your application is ready~! 🚀 ');
  console.log('[Success] File Watching~! 🚀 \r\n\r\n');
  console.log(`- Local:      http://${server.host}:${server.port}\r\n`);
  console.log('-----------------------------------\r\n');

  return {
    host: server.host,
    port: server.port,
    close: async () => {
      await watcher.close();
      await server.close();
    },
  };
};

export default serveCommand;
