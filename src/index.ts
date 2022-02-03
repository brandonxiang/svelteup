import fs from 'fs';
import { Options } from './interface/CommandOptions';
import serve from './command/serve';
import build from './command/build';
import { bundleRequire } from 'bundle-require';
import {
  cwd,
  defaultCommandOptions,
  defaultEntry,
  defaultConfigPath,
} from './command/const';
import path from 'path';
import fg from 'fast-glob';
import { beforeMultiEntries } from './utils/codegenerator';

function runEsbuild(opts: Options) {
  const { dev } = opts;

  if (dev) {
    serve(opts);
  } else {
    build(opts);
  }
}

function getEntry(entry: string, opts: Options) {
  if (entry) {
    return entry;
  }
  if (opts.entry) {
    return opts.entry;
  }
  return defaultEntry;
}

async function readConfig(commandConfig: string) {
  let configPath = '';
  if (commandConfig) {
    const commandConfigPath = path.resolve(cwd(), commandConfig);
    if (fs.existsSync(commandConfigPath)) {
      configPath = commandConfigPath;
    }
  }

  if (configPath === '') {
    const configPathMjs = path.resolve(cwd(), defaultConfigPath + '.mjs');
    const configPathTs = path.resolve(cwd(), defaultConfigPath + '.ts');
    const configPathJs = path.resolve(cwd(), defaultConfigPath + '.js');

    if (fs.existsSync(configPathMjs)) {
      configPath = configPathMjs;
    } else if (fs.existsSync(configPathTs)) {
      configPath = configPathTs;
    } else if (fs.existsSync(configPathJs)) {
      configPath = configPathJs;
    }
  }

  if (configPath !== '') {
    const { mod } = await bundleRequire({
      filepath: configPath,
    });
    return mod.default;
  }

  return {};
}

async function svelteup(entry: string, opts: Options) {
  const { _, ...rest } = opts;

  const configOptions = await readConfig(opts.config);
  const esbuildOptions = {
    ...defaultCommandOptions,
    ...configOptions,
    ...rest,
  } as Options;
  const bundleEntry = getEntry(entry, esbuildOptions);

  if (!fs.existsSync(bundleEntry)) {
    console.error('[Error] Entry does not existed');
    process.exit(1);
  }

  const stat = fs.statSync(bundleEntry);

  if (stat.isFile() && ['.js', '.ts'].includes(path.extname(bundleEntry))) {
    runEsbuild({ ...esbuildOptions, entryPoints: [bundleEntry] });
  } else if (stat.isDirectory()) {
    // only 1 deep layer is supported now
    const entries = await fg([`${bundleEntry}/*.svelte`], { deep: 1 });

    if (entries.length === 0) {
      console.error('[Error] No svelte file has been found.');
      process.exit(1);
    }

    const entryPoints = beforeMultiEntries(entries);
    runEsbuild({ ...esbuildOptions, entryPoints });
  } else {
    console.error('[Error] Entry has not been supported yet');
    process.exit(1);
  }
}

export default svelteup;
export { svelteup };
