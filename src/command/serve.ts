import { Options } from '../interface/CommandOptions';
import { buildBundle, watchBundle } from '../bundler';
import { createDevServer } from '../server/devServer';
import { injectLiveReload } from '../server/liveReload';
import process from 'node:process';

const serveCommand = async (opts: Options) => {
  const { entryPoints, outdir, serveOptions, format, globalName, minify } = opts;

  await buildBundle({
    entryPoints,
    outdir,
    format,
    globalName,
    sourcemap: true,
    minify: false,
    preprocess: opts.preprocess,
    compilerOptions: opts.compilerOptions,
    onRebuild: opts.onRebuild,
  });
  injectLiveReload(entryPoints, outdir);

  let server;
  try {
    server = await createDevServer(serveOptions);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EADDRINUSE') {
      console.error(
        `[Error] Port ${serveOptions.port} is already in use on ${serveOptions.host ?? 'localhost'}`,
      );
      process.exit(1);
    }
    throw error;
  }
  const onRebuild = () => {
    injectLiveReload(entryPoints, outdir);
    opts.onRebuild?.();
    server.reload();
  };

  const watcher = watchBundle({
    entryPoints,
    outdir,
    format,
    globalName,
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
