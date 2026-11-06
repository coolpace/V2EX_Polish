import path from 'node:path'

import { defineConfig } from 'tsdown'

import {
  extensionSourceRoot,
  extensionUserscriptDistRoot,
  readExtensionPackageJson,
} from './scripts/config'
import { V2EX_DOMAINS } from './shared/v2ex-domains'

const packageInfo = readExtensionPackageJson()
const matches = V2EX_DOMAINS.map((domain) => `// @match        https://${domain}/*`).join('\n')
const metadata = `// ==UserScript==
// @name         V2EX Polish - 体验更现代化的 V2EX
// @namespace    https://v2p.leoku.dev
// @version      ${packageInfo.version}
// @description  为 V2EX 带来现代化界面、楼中楼回复、主题预览、用户标签与每日签到，让浏览更清爽、交流更高效。
// @author       LeoKu
// @license      MIT
${matches}
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// ==/UserScript==
`

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

  banner: metadata,

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
    alwaysBundle: ['@floating-ui/dom', 'jquery', 'webext-patterns', 'lucide'],
    onlyBundle: false,
  },
})
