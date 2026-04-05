import stylelintPreset from 'prefer-code-style/stylelint'

export default {
  extends: [stylelintPreset],
  ignoreFiles: [
    'node_modules/**',
    '**/*.min.css',
  ],
}
