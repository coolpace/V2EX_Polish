import browser from 'prefer-code-style/eslint/browser'
import node from 'prefer-code-style/eslint/node'
import typescript from 'prefer-code-style/eslint/typescript'

export default [
  ...node,
  ...browser,
  ...typescript,

  {
    languageOptions: {
      parserOptions: {
        allowDefaultProject: true,
      },
    },
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
    },
  },

  {
    ignores: [
      'dist/**/*',
      'build*/**/*',
      'extension/scripts/**/*.min.js',
      'src/user-scripts/style.ts',
      'website/**/*',
      'chrome-profile/**/*',
      'firefox-dev-profile/**/*',
    ],
  },
]
