import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { promisify } from 'node:util';
import type { BundleReport } from './bundler';
import type { Options } from './interface/CommandOptions';

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

interface AssetSize {
  fileName: string;
  raw: number;
  gzip: number;
  brotli: number;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(2)} kB`;
}

function getScriptTag(opts: Options, fileName: string) {
  const src = `${opts.publicPath ?? ''}${fileName}`;

  if (opts.format === 'esm') {
    return `<script type="module" src="${src}"></script>`;
  }

  return `<script src="${src}"></script>`;
}

function getCustomElementTag(source: string) {
  const stringOption = source.match(/<svelte:options\s+customElement=["']([^"']+)["']/);
  if (stringOption) {
    return stringOption[1];
  }

  return source.match(/\btag:\s*["']([^"']+)["']/)?.[1];
}

async function getImportedSvelteFiles(entryPoint: string) {
  const source = await fs.readFile(entryPoint, 'utf-8');
  const imports = source.matchAll(/import\s+(?:[^'"]+\s+from\s+)?["']([^"']+\.svelte)["']/g);

  return Array.from(imports).map((importMatch) => {
    return path.resolve(path.dirname(entryPoint), importMatch[1]);
  });
}

async function getCustomElementTags(entryPoints: string[] = []) {
  const files = new Set<string>();

  for (const entryPoint of entryPoints) {
    if (entryPoint.endsWith('.svelte')) {
      files.add(entryPoint);
    } else if (/\.[cm]?[jt]s$/.test(entryPoint)) {
      for (const file of await getImportedSvelteFiles(entryPoint)) {
        files.add(file);
      }
    }
  }

  const tags = await Promise.all(
    Array.from(files).map(async (file) => {
      const source = await fs.readFile(file, 'utf-8');
      return getCustomElementTag(source);
    }),
  );

  return tags.filter((tag): tag is string => Boolean(tag));
}

async function getOutputFiles(outdir: string) {
  const entries = await fs.readdir(outdir, { recursive: true, withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter((filePath) => /\.(css|js|mjs)$/.test(filePath));
}

async function getAssetSizes(outdir: string): Promise<AssetSize[]> {
  const files = await getOutputFiles(outdir);

  return await Promise.all(
    files.map(async (filePath) => {
      const source = await fs.readFile(filePath);

      return {
        fileName: path.relative(outdir, filePath),
        raw: source.byteLength,
        gzip: (await gzip(source)).byteLength,
        brotli: (await brotliCompress(source)).byteLength,
      };
    }),
  );
}

function getEntryFiles(opts: Options, sizes: AssetSize[]) {
  const entryNames = new Set(
    (opts.entryPoints ?? []).map(
      (entryPoint) => `${path.basename(entryPoint, path.extname(entryPoint))}.js`,
    ),
  );

  return sizes.filter((size) => entryNames.has(size.fileName));
}

function printSizeReport(sizes: AssetSize[]) {
  if (sizes.length === 0) {
    return;
  }

  console.log('[Size]');
  for (const size of sizes) {
    console.log(
      `${size.fileName}  raw ${formatBytes(size.raw)}  gzip ${formatBytes(size.gzip)}  brotli ${formatBytes(size.brotli)}`,
    );
  }
}

async function printEmbedSnippets(opts: Options, sizes: AssetSize[]) {
  const entryFiles = getEntryFiles(opts, sizes);
  if (entryFiles.length === 0) {
    return;
  }

  const tags = await getCustomElementTags(opts.entryPoints);

  console.log('[Embed]');
  for (const entryFile of entryFiles) {
    console.log(getScriptTag(opts, entryFile.fileName));
  }
  for (const tag of tags) {
    console.log(`<${tag}></${tag}>`);
  }
}

function printAnalyzeReport(reports: BundleReport[]) {
  if (reports.length === 0) {
    return;
  }

  console.log('[Analyze]');
  for (const report of reports) {
    for (const chunk of report.chunks) {
      const modules = chunk.modules
        .filter((moduleInfo) => moduleInfo.renderedLength > 0)
        .sort((a, b) => b.renderedLength - a.renderedLength)
        .slice(0, 10);

      console.log(`${chunk.fileName}`);
      for (const moduleInfo of modules) {
        console.log(`  ${formatBytes(moduleInfo.renderedLength)}  ${moduleInfo.id}`);
      }
    }
  }
}

export function createBuildReporter(opts: Options) {
  const bundleReports: BundleReport[] = [];

  return {
    addBundleReport: (report: BundleReport) => {
      bundleReports.push(report);
    },
    print: async () => {
      if (!opts.report) {
        return;
      }

      const sizes = await getAssetSizes(opts.outdir);
      printSizeReport(sizes);
      await printEmbedSnippets(opts, sizes);

      if (opts.analyze) {
        printAnalyzeReport(bundleReports);
      }
    },
  };
}
