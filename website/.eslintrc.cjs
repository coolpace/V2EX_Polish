const { TYPESCRIPT_FILES } = require('prefer-code-style/constants')

module.exports = {
  root: true,

  extends: [require.resolve('prefer-code-style/eslint/preset/next'), 'plugin:jsx-a11y/recommended'],

  rules: {
    'import/no-unresolved': [
      2,
      {
        ignore: ['^\\~/', '^(contentlayer|next-contentlayer)'],
      },
    ],
  },

  overrides: [
    {
      files: TYPESCRIPT_FILES,
      rules: {
        '@typescript-eslint/no-unsafe-enum-comparison': 0,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
  ],
}
