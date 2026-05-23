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
  | 'minify'
  | 'preprocess'
  | 'compilerOptions'
  | 'onRebuild'
> {
  sourcemap: boolean;
}

export interface WatchHandle {
  close: () => Promise<void>;
  ready: Promise<void>;
}

type BundleInput = string | string[];

function getBundleInputs(opts: BundleOptions): BundleInput[] {
  const entryPoints = opts.entryPoints ?? [];

  return opts.codeSplitting ? [entryPoints] : entryPoints;
}

function getRolldownOptions(opts: BundleOptions, input: BundleInput) {
  return {
    input,
    plugins: [
      sveltePlugin({
        compilerOptions: opts.compilerOptions,
        preprocess: opts.preprocess,
      }),
    ],
  };
}

function getOutputOptions(opts: BundleOptions) {
  return {
    dir: opts.outdir,
    format: opts.format,
    name: opts.globalName,
    sourcemap: opts.sourcemap,
    minify: opts.minify,
    codeSplitting: opts.codeSplitting,
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
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
