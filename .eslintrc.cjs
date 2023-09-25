module.exports = {
  extends: ['plugin:svelte/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    extraFileExtensions: ['.svelte']
  },
  env: {
    es6: true,
    browser: true,
  },
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: {
          // Specify a parser for each lang.
          ts: '@typescript-eslint/parser',
          js: 'espree',
          typescript: '@typescript-eslint/parser'
        }
      }
    }
  ],
  settings: {
    'svelte3/compiler-options': {
      customElement: true,
    },
  },
};
