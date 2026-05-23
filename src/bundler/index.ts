import { rolldown, watch as rolldownWatch, RolldownWatcher } from 'rolldown';
import { Options } from '../interface/CommandOptions';
import { sveltePlugin } from './sveltePlugin';

export interface BundleOptions extends Pick<
  Options,
  | 'entryPoints'
  | 'outdir'
  | 'format'
  | 'globalName'
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

function getInputs(entryPoints: string[] = []) {
  return entryPoints.map((entryPoint) => {
    return {
      input: entryPoint,
    };
  });
}

function getRolldownOptions(opts: BundleOptions, input: string) {
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
    codeSplitting: false,
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
  };
}

export async function buildBundle(opts: BundleOptions) {
  for (const entry of getInputs(opts.entryPoints)) {
    const bundle = await rolldown(getRolldownOptions(opts, entry.input));

    try {
      await bundle.write(getOutputOptions(opts));
    } finally {
      await bundle.close();
    }
  }
}

export function watchBundle(opts: BundleOptions): WatchHandle {
  const inputs = getInputs(opts.entryPoints);
  let initialBuildsRemaining = inputs.length;
  let resolveReady: () => void;
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  if (initialBuildsRemaining === 0) {
    resolveReady!();
  }

  const watchers = inputs.map((entry) => {
    const watcher: RolldownWatcher = rolldownWatch({
      ...getRolldownOptions(opts, entry.input),
      output: getOutputOptions(opts),
    });

    watcher.on('event', (event) => {
      if (event.code === 'BUNDLE_END') {
        event.result.close();
        opts.onRebuild?.();
        if (initialBuildsRemaining > 0) {
          initialBuildsRemaining -= 1;
          if (initialBuildsRemaining === 0) {
            resolveReady!();
          }
        }
      } else if (event.code === 'ERROR') {
        console.error(event.error);
        if (initialBuildsRemaining > 0) {
          initialBuildsRemaining -= 1;
          if (initialBuildsRemaining === 0) {
            resolveReady!();
          }
        }
      }
    });

    return watcher;
  });

  return {
    ready,
    close: async () => {
      await Promise.all(watchers.map((watcher) => watcher.close()));
    },
  };
}
