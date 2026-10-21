import path from 'node:path'

import { defineConfig } from 'tsdown'

import { extensionSourceRoot, extensionUserscriptDistRoot } from './scripts/config'

export default defineConfig({
  tsconfig: './tsconfig.runtime.json',

  entry: {
    index: path.join(extensionSourceRoot, 'user-scripts/index.ts'),
  },

  outExtensions() {
    return { js: '.min.js' }
  },

  outDir: extensionUserscriptDistRoot,

  minify: false,

  clean: false,

  ignoreWatch: ['**/dist/**', '**/node_modules/**'],

  format: 'iife',
  platform: 'browser',
  dts: false,
  target: false,
  outputOptions: {
    codeSplitting: false,
    entryFileNames: '[name].min.js',
  },

  deps: {
    alwaysBundle: ['@floating-ui/dom', 'webext-patterns', 'lucide'],
    onlyBundle: false,
  },
})
