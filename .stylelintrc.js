module.exports = {
  customSyntax: 'postcss-scss',
  extends: [require.resolve('prefer-code-style/stylelint')],
  rules: {
    'selector-id-pattern': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
  },
  ignoreFiles: ['node_modules/**/*', '**/*.min.css', 'dist/**/*', 'asset/**/*'],
}
