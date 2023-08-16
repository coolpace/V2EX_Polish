const { resolve } = require('path')
const { TYPESCRIPT_FILES } = require('prefer-code-style/constants')

module.exports = {
  root: true,

  extends: [require.resolve('prefer-code-style/eslint/preset/next'), 'plugin:jsx-a11y/recommended'],

  rules: {
    'import/no-unresolved': [
      2,
      { ignore: ['^\\~/', '^(contentlayer|next-contentlayer)', '@vercel/analytics/react'] },
    ],
  },

  overrides: [
    {
      files: TYPESCRIPT_FILES,
      rules: {
        '@typescript-eslint/no-unsafe-enum-comparison': 0,
      },
      parserOptions: {
        project: resolve(__dirname, 'tsconfig.json'),
      },
    },
    {
      files: ['src/app/api/**/route.tsx'],
      rules: {
        'react/no-unknown-property': [2, { ignore: ['tw'] }],
      },
      parserOptions: {
        project: resolve(__dirname, 'tsconfig.json'),
      },
    },
  ],
}
