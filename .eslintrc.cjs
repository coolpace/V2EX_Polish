const { TYPESCRIPT_FILES } = require('prefer-code-style/constants')

module.exports = {
  root: true,

  env: {
    browser: true,
    webextensions: true,
    jquery: true,
  },

  extends: [
    require.resolve('prefer-code-style/eslint/browser'),
    require.resolve('prefer-code-style/eslint/node'),
    require.resolve('prefer-code-style/eslint/typescript'),
  ],

  ignorePatterns: [
    'dist/**/*',
    'build*/**/*',
    'extension/scripts/**/*.min.js',
    'src/user-scripts/style.ts',
    'website/**/*',
    'chrome-profile/**/*',
  ],

  overrides: [
    {
      files: TYPESCRIPT_FILES,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      extends: [require.resolve('prefer-code-style/eslint/rules/typescript-prefer-strict')],
      rules: {
        '@typescript-eslint/prefer-readonly-parameter-types': 0,
      },
    },
  ],
}
