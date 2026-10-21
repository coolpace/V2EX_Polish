import path from 'node:path'
import process from 'node:process'

import { defineConfig, type UserConfig } from 'tsdown'

import {
  extensionSourceRoot,
  getExtensionBuildScriptsRoot,
  resolveExtensionTarget,
} from './scripts/config'

const target = resolveExtensionTarget(process.env.EXTENSION_TARGET)

// 每个入口独立构建为自包含 IIFE，避免浏览器脚本依赖 Rolldown 的共享 chunk。
const entries = {
  // === 内容脚本 (Content Scripts) ===
  'theme-boot': path.join(extensionSourceRoot, 'contents/theme-boot.ts'),
  common: path.join(extensionSourceRoot, 'contents/common.ts'),
  'v2ex-home': path.join(extensionSourceRoot, 'contents/home/index.ts'),
  'v2ex-topic': path.join(extensionSourceRoot, 'contents/topic/index.ts'),
  'v2ex-write': path.join(extensionSourceRoot, 'contents/write/index.ts'),
  'v2ex-member': path.join(extensionSourceRoot, 'contents/member/index.ts'),
  'v2ex-settings': path.join(extensionSourceRoot, 'contents/settings/index.ts'),
  'v2ex-notifications': path.join(extensionSourceRoot, 'contents/notifications/index.ts'),
  'v2ex-go': path.join(extensionSourceRoot, 'contents/go/index.ts'),
  'decode-base64': path.join(extensionSourceRoot, 'contents/decode-base64.ts'),
  'reading-list': path.join(extensionSourceRoot, 'contents/reading-list.ts'),

  // === 扩展页面 (Extension Pages) ===
  popup: path.join(extensionSourceRoot, 'pages/popup.ts'),
  options: path.join(extensionSourceRoot, 'pages/options.ts'),

  // === 后台脚本 (Background Scripts) ===
  'toggle-icon': path.join(extensionSourceRoot, 'background/toggle-icon.ts'),
  background: path.join(extensionSourceRoot, 'background/main.ts'),
  web_accessible_resources: path.join(extensionSourceRoot, 'web_accessible_resources.ts'),
} as const

export default defineConfig(
  Object.entries(entries).map(([name, entry]): UserConfig => ({
    name,
    entry: { [name]: entry },
    tsconfig: './tsconfig.runtime.json',
    outDir: getExtensionBuildScriptsRoot(target),
    minify: false,
    // 保留静态 vendor/runtime 文件，避免覆盖同目录下的 jquery/polyfill。
    clean: false,
    ignoreWatch: ['**/*-profile/**', '**/node_modules/**', '**/dist/**', '**/build-*/**'],
    deps: {
      alwaysBundle: ['@floating-ui/dom', 'webext-patterns', 'lucide'],
      onlyBundle: false,
    },
    format: 'iife',
    platform: 'browser',
    dts: false,
    target: false,
    outputOptions: {
      codeSplitting: false,
      entryFileNames: '[name].min.js',
    },
  })),
)
