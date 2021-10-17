import fs from "fs";
import { FuncOptions, CommandOptions } from "./typings";
import serve from "./command/serve";
import build from "./command/build";
import { bundleRequire } from "bundle-require";
import {
  cwd,
  defaultCommandOptions,
  defaultEntry,
  defaultConfigPath,
} from "./command/helper";
import path from "path";

function runEsbuild(opts: CommandOptions) {
  const { servedir } = opts;

  if (servedir) {
    serve(opts);
  } else {
    build(opts);
  }
}

function getEntry(entry: string, opts: FuncOptions) {
  if (entry) {
    return entry;
  }
  if (opts.entry) {
    return opts.entry;
  }
  return defaultEntry;
}

async function svelteup(entry: string, opts: FuncOptions) {
  const { _, ...rest } = opts;

  let configOptions = {};
  const configPath = path.resolve(cwd(), opts.config || defaultConfigPath);

  if(fs.existsSync(configPath)) {
    const mod = (await bundleRequire({
      filepath: configPath,
    }));
    configOptions = mod.default;
  }

  const esbuildOptions = { ...defaultCommandOptions, ...configOptions, ...rest }  as FuncOptions;

  const bundleEntry = getEntry(entry, esbuildOptions);

  const stat = fs.statSync(bundleEntry);

  if (stat.isFile()) {
    runEsbuild({ ...esbuildOptions, entryPoints: [bundleEntry] });
  } else {
    console.error("[Error] Entry Type is not supported yet");
    process.exit(1);
  }
}

export default svelteup;
export { svelteup };
