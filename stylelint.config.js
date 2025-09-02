import stylelintPreset from 'prefer-code-style/stylelint'

export default {
  extends: [stylelintPreset],

  rules: {
    'selector-id-pattern': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'value-keyword-case': null,
  },

  ignoreFiles: [
    'node_modules/**',
    'dist/**',
    'asset/**',
    'extension/css/**',
    '**/*.min.css',
    'build*/**',
  ],
}
