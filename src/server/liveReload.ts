import fs from 'node:fs';
import path from 'node:path';
import { liveReloadScript } from './devServer';

export function injectLiveReload(entryPoints: string[] = [], outdir: string) {
  for (const entryPoint of entryPoints) {
    const outputPath = path.join(
      outdir,
      `${path.basename(entryPoint, path.extname(entryPoint))}.js`,
    );

    if (!fs.existsSync(outputPath)) {
      continue;
    }

    const source = fs.readFileSync(outputPath, 'utf-8');
    if (source.includes(liveReloadScript)) {
      continue;
    }

    fs.writeFileSync(outputPath, source + liveReloadScript);
  }
}
