module.exports = {
  extends: [require.resolve('prefer-code-style/stylelint')],

  rules: {
    'color-function-notation': 'modern',
    'selector-id-pattern': null,
  },

  ignoreFiles: ['public'],
}
