/**
 * 扩展功能清单一览表。
 *
 * tsdown 入口、manifest 的 content_scripts 与 background 的动态注入脚本
 * 都从这里派生，避免新增功能时需要同步修改多个手写列表。
 */

/** 内容脚本注入的页面范围。 */
export type ContentScriptTarget
  = | 'all'
    | 'topic'
    | 'write'
    | 'member'
    | 'settings'
    | 'notifications'
    | 'go'

export type ManifestRunAt = 'document_start' | 'document_end' | 'document_idle'

export interface ContentScriptGroup {
  /** 构建入口名，同时决定 manifest 中 scripts/<name>.min.js 的文件名。 */
  name?: string
  /** 相对 src 的入口文件，参与 tsdown 构建。 */
  entry?: string
  /** 直接来自 public 的静态脚本（不参与构建），值为 manifest 中的路径。 */
  staticScript?: string
  /** 注入的页面范围。 */
  matches: ContentScriptTarget
  /** 需要排在业务脚本之前的 vendor 脚本（manifest 路径）。 */
  vendor?: string[]
  /** 需要注入的样式（manifest 路径）。 */
  css?: string[]
  runAt?: ManifestRunAt
  /** 是否注入所有 frame，默认 true。 */
  allFrames?: boolean
  /** 排除的页面。 */
  excludeMatches?: string[]
}

export interface ExtensionBuildEntry {
  name: string
  entry: string
}

const THEME_CSS = [
  'css/v2ex-theme-var.css',
  'css/v2ex-theme-default.css',
  'css/v2ex-theme-dark.css',
  'css/v2ex-theme-compact.css',
  'css/v2ex-theme-dawn.css',
  'css/v2ex-theme-minimalist.css',
  'css/v2ex-theme-mobile.css',
]

/**
 * content_scripts 数组的顺序即 manifest 中的注入顺序，调整时需同步校验快照。
 */
export const contentScriptGroups: readonly ContentScriptGroup[] = [
  // 1. 首屏主题启动（document_start，先于功能脚本）
  {
    name: 'theme-boot',
    entry: 'contents/theme-boot.ts',
    matches: 'all',
    runAt: 'document_start',
  },

  // 2. 主题样式注入（最高优先级，document_start 执行）
  {
    matches: 'all',
    runAt: 'document_start',
    css: THEME_CSS,
  },

  // 3. Polyfill 脚本注入（兼容性处理）
  {
    name: 'polyfill',
    staticScript: 'scripts/polyfill.js',
    matches: 'all',
    runAt: 'document_end',
  },

  // 4. 通用功能脚本（所有页面）
  {
    name: 'common',
    entry: 'contents/common.ts',
    matches: 'all',
    vendor: ['scripts/jquery.min.js'],
    css: ['css/v2ex-effect.css'],
  },

  // 5. 首页专用功能（排除特定页面）
  {
    name: 'v2ex-home',
    entry: 'contents/home/index.ts',
    matches: 'all',
    vendor: ['scripts/jquery.min.js'],
    excludeMatches: [
      '*://*/t/*', // 排除主题页
      '*://*/notes/*', // 排除笔记页
      '*://*/settings', // 排除设置页
      '*://*/write', // 排除发帖页
      '*://*/member/*', // 排除用户页
    ],
  },

  // 6-11. 各页面类型的专用功能脚本
  {
    name: 'v2ex-topic',
    entry: 'contents/topic/index.ts',
    matches: 'topic',
    vendor: ['scripts/jquery.min.js'],
  },
  {
    name: 'v2ex-write',
    entry: 'contents/write/index.ts',
    matches: 'write',
    vendor: ['scripts/jquery.min.js'],
  },
  {
    name: 'v2ex-member',
    entry: 'contents/member/index.ts',
    matches: 'member',
    vendor: ['scripts/jquery.min.js'],
  },
  {
    name: 'v2ex-settings',
    entry: 'contents/settings/index.ts',
    matches: 'settings',
    vendor: ['scripts/jquery.min.js'],
  },
  {
    name: 'v2ex-notifications',
    entry: 'contents/notifications/index.ts',
    matches: 'notifications',
    vendor: ['scripts/jquery.min.js'],
  },
  {
    name: 'v2ex-go',
    entry: 'contents/go/index.ts',
    matches: 'go',
    vendor: ['scripts/jquery.min.js'],
  },

  // 12. 图标切换功能（全局）
  {
    name: 'toggle-icon',
    entry: 'background/toggle-icon.ts',
    matches: 'all',
  },
]

/** 不作为内容脚本注入、但需要单独构建的入口。 */
export const standaloneEntries: readonly ExtensionBuildEntry[] = [
  { name: 'decode-base64', entry: 'contents/decode-base64.ts' },
  { name: 'reading-list', entry: 'contents/reading-list.ts' },
  { name: 'popup', entry: 'pages/popup.ts' },
  { name: 'options', entry: 'pages/options.ts' },
  { name: 'background', entry: 'background/main.ts' },
  { name: 'web_accessible_resources', entry: 'web_accessible_resources.ts' },
]

/** tsdown 需要构建的全部入口。 */
export const extensionEntries: readonly ExtensionBuildEntry[] = [
  ...contentScriptGroups.flatMap((group) =>
    group.name && group.entry ? [{ name: group.name, entry: group.entry }] : [],
  ),
  ...standaloneEntries,
]

/** background 通过 chrome.scripting.executeScript 动态注入的脚本。 */
export const injectedScripts = {
  decodeBase64: 'scripts/decode-base64.min.js',
  readingList: 'scripts/reading-list.min.js',
} as const
