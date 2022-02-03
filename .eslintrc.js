module.exports = {
    extends: ['plugin:prettier/recommended'],
    parser: '@typescript-eslint/parser',
    env: {
      es6: true,
      browser: true
    },
    plugins: [
      'svelte3',
      '@typescript-eslint',
      'prettier'
    ],
    overrides: [
      {
        files: ['*.svelte'],
        processor: 'svelte3/svelte3'
      }
    ],
    settings: {
      'svelte3/typescript': true
    }
  };