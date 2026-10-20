import path from 'node:path'
import process from 'node:process'

import { defineConfig } from 'tsup'

import {
  extensionSourceRoot,
  getExtensionBuildScriptsRoot,
  resolveExtensionTarget,
} from './scripts/config'

const target = resolveExtensionTarget(process.env.EXTENSION_TARGET)

export default defineConfig({
  tsconfig: './tsconfig.runtime.json',

  // 定义构建入口点 - 每个入口对应不同的功能模块
  entry: {
    // === 内容脚本 (Content Scripts) ===
    // 注入到 V2EX 页面中的脚本，用于增强页面功能
    'theme-boot': path.join(extensionSourceRoot, 'contents/theme-boot.ts'), // 首屏主题启动
    common: path.join(extensionSourceRoot, 'contents/common.ts'), // 通用功能模块
    'v2ex-home': path.join(extensionSourceRoot, 'contents/home/index.ts'), // 首页增强功能
    'v2ex-topic': path.join(extensionSourceRoot, 'contents/topic/index.ts'), // 话题页面增强
    'v2ex-write': path.join(extensionSourceRoot, 'contents/write/index.ts'), // 写作页面增强
    'v2ex-member': path.join(extensionSourceRoot, 'contents/member/index.ts'), // 用户页面增强
    'v2ex-settings': path.join(extensionSourceRoot, 'contents/settings/index.ts'), // 设置页面增强
    'v2ex-notifications': path.join(extensionSourceRoot, 'contents/notifications/index.ts'), // 通知页面增强
    'v2ex-go': path.join(extensionSourceRoot, 'contents/go/index.ts'), // Go 节点页面增强
    'decode-base64': path.join(extensionSourceRoot, 'contents/decode-base64.ts'), // Base64 解码工具
    'reading-list': path.join(extensionSourceRoot, 'contents/reading-list.ts'), // 阅读列表功能

    // === 扩展页面 (Extension Pages) ===
    // 扩展程序自身的 UI 页面
    popup: path.join(extensionSourceRoot, 'pages/popup.ts'), // 弹出窗口页面
    options: path.join(extensionSourceRoot, 'pages/options.ts'), // 选项设置页面

    // === 后台脚本 (Background Scripts) ===
    // 在扩展后台运行的脚本
    'toggle-icon': path.join(extensionSourceRoot, 'background/toggle-icon.ts'), // 图标状态切换
    background: path.join(extensionSourceRoot, 'background/main.ts'), // 主后台脚本
    web_accessible_resources: path.join(extensionSourceRoot, 'web_accessible_resources.ts'), // 网页可访问资源
  },

  // 自动为所有输出文件添加 .min 后缀
  outExtension() {
    return { js: '.min.js' }
  },

  // 构建输出目录 - 编译后的文件将输出到扩展的 scripts 目录
  outDir: getExtensionBuildScriptsRoot(target),

  // 禁用代码压缩 - 保持代码可读性，便于调试
  minify: false,

  // 保留静态 vendor/runtime 文件，避免覆盖同目录下的 jquery/polyfill。
  clean: false,

  // 不外部化的依赖包 - 这些包将被打包到输出文件中而不是作为外部依赖
  noExternal: ['@floating-ui/dom', 'webext-patterns', 'lucide'],

  // 文件监视时忽略的目录 - 这些目录的变化不会触发重新构建
  ignoreWatch: [
    '**/*-profile/**', // 浏览器开发配置目录
    '**/node_modules/**', // Node.js 依赖包
    '**/dist/**', // 新的构建输出目录
    '**/build-*/**', // 构建相关目录
  ],

  // ESBuild 自定义配置 - 禁用直接写入文件，由 tsup 处理文件输出
  esbuildOptions(options) {
    options.write = false
  },
})
