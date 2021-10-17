module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
      es6: true,
      browser: true
    },
    plugins: [
      'svelte3',
      '@typescript-eslint'
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