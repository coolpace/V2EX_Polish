const { resolve } = require('path');

const { TYPESCRIPT_FILES } = require('prefer-code-style/constants');

module.exports = {
  root: true,
  globals: { $: true },
  extends: [
    require.resolve('prefer-code-style/eslint/browser'),
    require.resolve('prefer-code-style/eslint/node'),
    require.resolve('prefer-code-style/eslint/typescript'),
  ],
  ignorePatterns: ['dist/**/*'],
  overrides: [
    {
      files: TYPESCRIPT_FILES,
      parserOptions: {
        project: resolve(__dirname, 'tsconfig.json'),
      },
    },
  ],
};
