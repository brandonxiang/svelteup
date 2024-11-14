import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";


export default tseslint.config(
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...sveltePlugin.configs["flat/recommended"],
  {
    ignores: [
      'dist', '.svelteup'
    ],
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  {
    files: ["**/*.svelte", "*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: {
          ts: "@typescript-eslint/parser",
        },
        extraFileExtensions: [".svelte"],
      },
    }
  },
  {
    files: ["**/*.svelte.ts", "*.svelte.ts"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    }
  },
  {
    files: ["**/*.svelte.js", "*.svelte.js"],
    languageOptions: {
      parser: svelteParser,
    }
  },
);