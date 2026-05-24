import { rolldown, watch as rolldownWatch, RolldownWatcher } from 'rolldown';
import { Options } from '../interface/CommandOptions';
import { sveltePlugin } from './sveltePlugin';

export interface BundleOptions extends Pick<
  Options,
  | 'entryPoints'
  | 'outdir'
  | 'format'
  | 'globalName'
  | 'codeSplitting'
  | 'publicPath'
  | 'assetsDir'
  | 'external'
  | 'globals'
  | 'analyze'
  | 'minify'
  | 'preprocess'
  | 'compilerOptions'
  | 'onRebuild'
> {
  sourcemap: boolean;
  onBundleReport?: (report: BundleReport) => void;
}

export interface WatchHandle {
  close: () => Promise<void>;
  ready: Promise<void>;
}

type BundleInput = string | string[];

export interface BundleReportModule {
  id: string;
  renderedLength: number;
}

export interface BundleReportChunk {
  fileName: string;
  modules: BundleReportModule[];
}

export interface BundleReport {
  chunks: BundleReportChunk[];
}

function getBundleInputs(opts: BundleOptions): BundleInput[] {
  const entryPoints = opts.entryPoints ?? [];

  return opts.codeSplitting ? [entryPoints] : entryPoints;
}

function getRolldownOptions(opts: BundleOptions, input: BundleInput) {
  return {
    input,
    external: opts.external,
    plugins: [
      sveltePlugin({
        compilerOptions: opts.compilerOptions,
        preprocess: opts.preprocess,
        outdir: opts.outdir,
        publicPath: opts.publicPath,
        assetsDir: opts.assetsDir,
      }),
      bundleReportPlugin(opts),
    ],
  };
}

function getOutputOptions(opts: BundleOptions) {
  return {
    dir: opts.outdir,
    format: opts.format,
    name: opts.globalName,
    globals: opts.globals,
    sourcemap: opts.sourcemap,
    minify: opts.minify,
    codeSplitting: opts.codeSplitting,
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
  };
}

function bundleReportPlugin(opts: BundleOptions) {
  return {
    name: 'svelteup:bundle-report',
    generateBundle(_outputOptions: unknown, bundle: Record<string, unknown>) {
      if (!opts.analyze) {
        return;
      }

      opts.onBundleReport?.({
        chunks: Object.values(bundle)
          .filter(
            (
              output,
            ): output is {
              type: 'chunk';
              fileName: string;
              modules: Record<string, { renderedLength?: number }>;
            } => {
              return (
                typeof output === 'object' &&
                output !== null &&
                'type' in output &&
                output.type === 'chunk'
              );
            },
          )
          .map((chunk) => ({
            fileName: chunk.fileName,
            modules: Object.entries(chunk.modules).map(([id, moduleInfo]) => ({
              id,
              renderedLength: moduleInfo.renderedLength ?? 0,
            })),
          })),
      });
    },
  };
}

async function writeBundle(opts: BundleOptions, input: BundleInput) {
  const bundle = await rolldown(getRolldownOptions(opts, input));

  try {
    await bundle.write(getOutputOptions(opts));
  } finally {
    await bundle.close();
  }
}

function createReadyTracker(total: number) {
  let remaining = total;
  let resolveReady = () => {};
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  if (remaining === 0) {
    resolveReady();
  }

  return {
    ready,
    completeInitialBuild: () => {
      if (remaining <= 0) {
        return;
      }

      remaining -= 1;
      if (remaining === 0) {
        resolveReady();
      }
    },
  };
}

function createWatcher(opts: BundleOptions, input: BundleInput, completeInitialBuild: () => void) {
  const watcher: RolldownWatcher = rolldownWatch({
    ...getRolldownOptions(opts, input),
    output: getOutputOptions(opts),
  });

  watcher.on('event', (event) => {
    if (event.code === 'BUNDLE_END') {
      event.result.close();
      opts.onRebuild?.();
      completeInitialBuild();
    } else if (event.code === 'ERROR') {
      console.error(event.error);
      completeInitialBuild();
    }
  });

  return watcher;
}

export async function buildBundle(opts: BundleOptions) {
  for (const input of getBundleInputs(opts)) {
    await writeBundle(opts, input);
  }
}

export function watchBundle(opts: BundleOptions): WatchHandle {
  const inputs = getBundleInputs(opts);
  const { ready, completeInitialBuild } = createReadyTracker(inputs.length);
  const watchers = inputs.map((input) => createWatcher(opts, input, completeInitialBuild));

  return {
    ready,
    close: async () => {
      await Promise.all(watchers.map((watcher) => watcher.close()));
    },
  };
}
