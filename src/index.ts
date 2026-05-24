import fs from 'fs';
import { Options, SvelteupConfig } from './interface/CommandOptions';
import serveCommand from './command/serve';
import buildCommand from './command/build';
import { createJiti } from 'jiti';
import { cwd, defaultCommandOptions, defaultConfigPath } from './command/const';
import path from 'path';
import fg from 'fast-glob';
import { beforeMultiEntries } from './utils/codegenerator';
import watchCommand from './command/watch';
import merge from 'lodash.merge';

const jiti = createJiti(import.meta.url);
const outputFormats = new Set(['esm', 'iife']);

function defineConfig(config: SvelteupConfig) {
  return config;
}

function normalizeListOption(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeJsonOption(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  return JSON.parse(value);
}

function runBundler(opts: Options) {
  const { dev, watch } = opts;

  if (dev) {
    return serveCommand(opts);
  } else if (watch) {
    return watchCommand(opts);
  } else {
    return buildCommand(opts);
  }
}

function getEntry(entry: string, opts: Options) {
  if (entry) {
    return entry;
  }
  if (opts.entry) {
    return opts.entry;
  }
  return defaultCommandOptions.entry;
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
    return await jiti.import(configPath, { default: true });
  }

  return {};
}

async function svelteup(entry: string, opts: Options) {
  const { _, ...rest } = opts;
  void _;

  const configOptions = await readConfig(opts.config);
  const bundlerOptions = merge({}, defaultCommandOptions, configOptions, rest) as Options;
  bundlerOptions.external = normalizeListOption(bundlerOptions.external) as Options['external'];
  bundlerOptions.globals = normalizeJsonOption(bundlerOptions.globals) as Options['globals'];

  if (!outputFormats.has(bundlerOptions.format)) {
    console.error('[Error] Output format must be "esm" or "iife"');
    process.exit(1);
  }

  if (bundlerOptions.codeSplitting && bundlerOptions.format !== 'esm') {
    console.error('[Error] Code splitting requires "esm" output format');
    process.exit(1);
  }

  const bundleEntry = getEntry(entry, bundlerOptions);
  const outdir = path.resolve(cwd(), bundlerOptions.outdir);
  const publicPath = bundlerOptions.publicPath ?? `./${path.basename(outdir)}/`;

  if (!fs.existsSync(bundleEntry)) {
    console.error('[Error] Entry does not existed');
    process.exit(1);
  }

  const stat = fs.statSync(bundleEntry);
  if (stat.isFile() && ['.js', '.ts'].includes(path.extname(bundleEntry))) {
    const entryPoint = path.resolve(cwd(), bundleEntry);
    return await runBundler({ ...bundlerOptions, outdir, publicPath, entryPoints: [entryPoint] });
  } else if (stat.isDirectory()) {
    // only 1 deep layer is supported now
    const entries = await fg([`${bundleEntry}/*.svelte`], { deep: 1 });

    if (entries.length === 0) {
      console.error('[Error] No svelte file has been found.');
      process.exit(1);
    }

    const entryPoints = beforeMultiEntries(entries);
    return await runBundler({ ...bundlerOptions, outdir, publicPath, entryPoints });
  } else {
    console.error('[Error] Entry has not been supported yet');
    process.exit(1);
  }
}

export default svelteup;
export { defineConfig, svelteup };
export type { SvelteupConfig };
