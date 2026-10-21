import path from 'node:path'
import process from 'node:process'

import { defineConfig, type UserConfig } from 'tsdown'

import {
  extensionSourceRoot,
  getExtensionBuildScriptsRoot,
  resolveExtensionTarget,
} from './scripts/config'
import { extensionEntries } from './shared/features'

const target = resolveExtensionTarget(process.env.EXTENSION_TARGET)

// 每个入口独立构建为自包含 IIFE，避免浏览器脚本依赖 Rolldown 的共享 chunk。
const entries = Object.fromEntries(
  extensionEntries.map(({ name, entry }) => [name, path.join(extensionSourceRoot, entry)]),
)

export default defineConfig(
  Object.entries(entries).map(([name, entry]): UserConfig => ({
    name,
    entry: { [name]: entry },
    tsconfig: './tsconfig.runtime.json',
    outDir: getExtensionBuildScriptsRoot(target),
    minify: process.env.EXTENSION_MINIFY === '1',
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
