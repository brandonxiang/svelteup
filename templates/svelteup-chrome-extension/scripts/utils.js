import fse from 'fs-extra';
import { compile } from 'tempura';

const { readFile, mkdir, writeFile, copy, remove } = fse;

export const prepare = async (env) => {
  const outputDir = env === 'prod' ? 'dist' : 'dev';
  const successLine =
    env === 'prod' ? '[Success] dist dir has been converted' : '[Success] dev dir has been convert';

  // step 1 read file

  const params = { env };
  const optionsTemplate = await readFile('chrome/views/options.hbs', 'utf8');
  let optionsRender = compile(optionsTemplate);
  const optionsHtml = optionsRender(params);

  const popupTemplate = await readFile('chrome/views/popup.hbs', 'utf8');
  let popupRender = compile(popupTemplate);
  const popupHtml = popupRender(params);

  // step 2 create dev

  await remove(outputDir);
  await mkdir(outputDir);

  // step 3 write file

  writeFile(outputDir + '/options.html', optionsHtml, { encoding: 'utf8' });
  writeFile(outputDir + '/popup.html', popupHtml, { encoding: 'utf8' });
  copy('chrome/manifest.dev.json', outputDir + '/manifest.json');
  copy('chrome/images', outputDir + '/images');
  copy('chrome/scripts', outputDir + '/scripts');

  console.log(successLine);
};
