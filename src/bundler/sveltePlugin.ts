import { compile, preprocess } from 'svelte/compiler';
import type { Plugin } from 'rolldown';
import { defaultCompileOptions } from '../command/const';
import type { Options } from '../interface/CommandOptions';
import fs from 'node:fs';
import path from 'node:path';

const customElementDefine = 'customElements.define(';
const guardedCustomElementDefine = '__svelteup_define_custom_element(';
const customElementDefineHelper = `const __svelteup_define_custom_element = (tag, element, options) => {
  if (!customElements.get(tag)) {
    customElements.define(tag, element, options);
  }
};
`;

function guardCustomElementDefinition(code: string) {
  if (!code.includes(customElementDefine)) {
    return code;
  }

  return (
    customElementDefineHelper + code.replaceAll(customElementDefine, guardedCustomElementDefine)
  );
}

function rewriteCssAssetUrls(
  code: string,
  filename: string,
  opts: Pick<Options, 'outdir' | 'publicPath' | 'assetsDir'>,
) {
  return code.replace(/url\((['"]?)([^'")]+)\1\)/g, (match, quote, url) => {
    if (/^(data:|https?:|\/|#)/.test(url)) {
      return match;
    }

    const sourcePath = path.resolve(path.dirname(filename), url);
    if (!fs.existsSync(sourcePath)) {
      return match;
    }

    const assetName = path.basename(sourcePath);
    const assetPath = path.join(opts.outdir, opts.assetsDir, assetName);
    fs.mkdirSync(path.dirname(assetPath), { recursive: true });
    fs.copyFileSync(sourcePath, assetPath);

    const publicPath = opts.publicPath ?? '';
    return `url(${quote}${publicPath}${opts.assetsDir}/${assetName}${quote})`;
  });
}

export function sveltePlugin(
  opts: Pick<Options, 'compilerOptions' | 'preprocess' | 'outdir' | 'publicPath' | 'assetsDir'>,
): Plugin {
  return {
    name: 'svelteup:svelte',
    async transform(code, id) {
      if (!id.endsWith('.svelte')) {
        return null;
      }

      const processed = opts.preprocess
        ? await preprocess(code, opts.preprocess, { filename: id })
        : { code, map: undefined };

      const codeWithAssets = rewriteCssAssetUrls(processed.code, id, opts);
      const compiled = compile(codeWithAssets, {
        css: 'injected',
        ...defaultCompileOptions,
        ...opts.compilerOptions,
        filename: id,
      });

      return {
        code: guardCustomElementDefinition(compiled.js.code),
        map: compiled.js.map,
      };
    },
  };
}
