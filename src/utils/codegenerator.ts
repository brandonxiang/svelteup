import fs from 'node:fs';
import path from 'path';

export const beforeMultiEntries = (entries: string[]) => {
  const dir = '.svelteup/entry';

  fs.mkdirSync(dir, {recursive: true});

  return entries.map((entry) => {
    const basename = path.basename(entry, '.svelte');
    const fakepath = path.resolve(dir, basename + '.js');
    fs.writeFileSync(fakepath, `import \'../../${entry}\';`, {
      encoding: 'utf-8',
    });

    return fakepath;
  });
};
