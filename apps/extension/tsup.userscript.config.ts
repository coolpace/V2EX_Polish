import path from 'node:path'

import { defineConfig } from 'tsup'

import {
  extensionSourceRoot,
  extensionUserscriptDistRoot,
} from './scripts/config'

export default defineConfig({
  tsconfig: './tsconfig.runtime.json',

  entry: {
    index: path.join(extensionSourceRoot, 'user-scripts/index.ts'),
  },

  outExtension() {
    return { js: '.min.js' }
  },

  outDir: extensionUserscriptDistRoot,

  minify: false,

  ignoreWatch: [
    '**/dist/**',
    '**/node_modules/**',
  ],

  esbuildOptions(options) {
    options.write = false
  },
})
