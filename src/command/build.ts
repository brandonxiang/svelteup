import { Options } from '../interface/CommandOptions';
import { buildBundle } from '../bundler';
import { createBuildReporter } from '../reporter';

const buildCommand = async (opts: Options) => {
  const reporter = createBuildReporter(opts);
  const {
    entryPoints,
    outdir,
    watch,
    format,
    globalName,
    codeSplitting,
    publicPath,
    assetsDir,
    external,
    globals,
    analyze,
    minify,
  } = opts;

  await buildBundle({
    entryPoints,
    outdir,
    format,
    globalName,
    codeSplitting,
    publicPath,
    assetsDir,
    external,
    globals,
    analyze,
    sourcemap: watch,
    minify,
    preprocess: opts.preprocess,
    compilerOptions: opts.compilerOptions,
    onRebuild: opts.onRebuild,
    onBundleReport: reporter.addBundleReport,
  });
  await reporter.print();
  console.log('[Success] All components are bundled');
};

export default buildCommand;
