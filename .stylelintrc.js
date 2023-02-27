module.exports = {
  customSyntax: 'postcss-scss',
  extends: [require.resolve('prefer-code-style/stylelint')],
  rules: {
    'selector-id-pattern': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': [true, { ignoreAtRules: ['support'] }],
  },
  ignoreFiles: ['node_modules/**', 'dist/**', 'asset/**', '**/*.min.css'],
}
