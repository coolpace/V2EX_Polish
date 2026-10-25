import baseConfig from '../../stylelint.base.js'

const ignoreFiles = baseConfig.ignoreFiles ?? []

export default {
  ...baseConfig,
  ignoreFiles: [
    ...ignoreFiles,
    '.next/**',
    '.velite/**',
  ],
}
