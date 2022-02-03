import fse from 'fs-extra';
import path from 'path';

export const beforeMultiEntries = (entries: string[]) => {
  const dir = '.svelteup/entry';

  fse.mkdirpSync(dir);

  return entries.map((entry) => {
    const basename = path.basename(entry, '.svelte');
    const fakepath = path.resolve(dir, basename + '.js');
    fse.writeFileSync(fakepath, `import \'../../${entry}\';`, {encoding: 'utf-8'});

    return fakepath;
  });
}