import { rolldown, watch as rolldownWatch, RolldownWatcher } from 'rolldown';
import { Options } from '../interface/CommandOptions';
import { sveltePlugin } from './sveltePlugin';

export interface BundleOptions
  extends Pick<
    Options,
    'entryPoints' | 'outdir' | 'minify' | 'preprocess' | 'compilerOptions' | 'onRebuild'
  > {
  sourcemap: boolean;
}

export interface WatchHandle {
  close: () => Promise<void>;
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
    format: 'esm' as const,
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
  const watchers = getInputs(opts.entryPoints).map((entry) => {
    const watcher: RolldownWatcher = rolldownWatch({
      ...getRolldownOptions(opts, entry.input),
      output: getOutputOptions(opts),
    });

    watcher.on('event', (event) => {
      if (event.code === 'BUNDLE_END') {
        event.result.close();
        opts.onRebuild?.();
      } else if (event.code === 'ERROR') {
        console.error(event.error);
      }
    });

    return watcher;
  });

  return {
    close: async () => {
      await Promise.all(watchers.map((watcher) => watcher.close()));
    },
  };
}
