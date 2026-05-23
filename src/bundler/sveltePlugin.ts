import { compile, preprocess } from 'svelte/compiler';
import { Plugin } from 'rolldown';
import { defaultCompileOptions } from '../command/const';
import { Options } from '../interface/CommandOptions';

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
        code: compiled.js.code,
        map: compiled.js.map,
      };
    },
  };
}
