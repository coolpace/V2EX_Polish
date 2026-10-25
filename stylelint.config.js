import baseConfig from './stylelint.base.js'

const ignoreFiles = baseConfig.ignoreFiles ?? []

export default {
  ...baseConfig,

  rules: {
    'selector-id-pattern': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'at-rule-prelude-no-invalid': null,
    'value-keyword-case': null,
    'nesting-selector-no-missing-scoping-root': [
      true,
      {
        ignoreAtRules: ['mixin'],
      },
    ],
  },

  ignoreFiles: [
    ...ignoreFiles,
    'apps/extension/dist/**',
    'apps/website/.next/**',
    'apps/website/.velite/**',
    'assets/**',
  ],
}
