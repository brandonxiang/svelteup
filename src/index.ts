import fs from "fs";
import { FuncOptions, CommandOptions } from "./typings";
import serve from "./command/serve";
import build from "./command/build";
import { bundleRequire } from "bundle-require";
import {
  cwd,
  defaultCommandOptions,
  defaultEntry,
  defaultOutputPath,
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

  const mod = (await bundleRequire({
    filepath: path.resolve(cwd(), opts.config || defaultOutputPath),
  })) as { default: FuncOptions };

  const esbuildOptions = { ...defaultCommandOptions, ...mod.default, ...rest };

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
