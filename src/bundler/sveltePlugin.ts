import { compile, preprocess } from 'svelte/compiler';
import type { Plugin } from 'rolldown';
import { defaultCompileOptions } from '../command/const';
import type { Options } from '../interface/CommandOptions';

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

export function sveltePlugin(opts: Pick<Options, 'compilerOptions' | 'preprocess'>): Plugin {
  return {
    name: 'svelteup:svelte',
    async transform(code, id) {
      if (!id.endsWith('.svelte')) {
        return null;
      }

      const processed = opts.preprocess
        ? await preprocess(code, opts.preprocess, { filename: id })
        : { code, map: undefined };

      const compiled = compile(processed.code, {
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
