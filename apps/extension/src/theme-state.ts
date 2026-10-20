import { StorageKey } from './constants'
import type { FontType, Options, StorageItems, ThemeType } from './types'

/** 首屏主题缓存键。缓存只保存界面偏好，不保存用户内容。 */
const THEME_BOOT_STORAGE_KEY = 'v2p:boot:v1'

const THEME_ATTRIBUTE = 'v2pTheme'
const MODE_ATTRIBUTE = 'v2pMode'
const FONT_ATTRIBUTE = 'v2pFont'
const MOBILE_ATTRIBUTE = 'v2pMobile'
const THEME_CLASS_PREFIX = 'v2p-theme-'
const COMPACT_CLASS = 'v2p-mode-compact'
const MOBILE_CLASS = 'v2p-mobile'

const THEME_TYPES = ['light-default', 'dark-default', 'dawn', 'minimalist'] as const
const FONT_TYPES = ['system', 'vivoSans', 'notoSans', 'lxgwWenKai'] as const

const FONT_STYLESHEETS: Partial<Record<FontType, { id: string, href: string }>> = {
  notoSans: {
    id: 'v2p-font-noto-sans',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400..900&display=swap',
  },
  lxgwWenKai: {
    id: 'v2p-font-lxgw-wenkai',
    href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.1.0/style.css',
  },
}

const pendingFontStylesheets = new Set<string>()

type ThemeMode = 'default' | 'compact'

interface ThemeBootSnapshot {
  themeType: ThemeType
  autoSwitch: boolean
  mode: ThemeMode
  fontType: FontType
}

const DEFAULT_THEME_BOOT_SNAPSHOT: ThemeBootSnapshot = {
  themeType: 'light-default',
  autoSwitch: false,
  mode: 'default',
  fontType: 'system',
}

let currentSnapshot: ThemeBootSnapshot | null = null
let documentObserver: MutationObserver | null = null
let bodyStateApplied = false
let colorMediaListening = false

function isThemeType(value: unknown): value is ThemeType {
  return typeof value === 'string' && THEME_TYPES.includes(value as ThemeType)
}

function isFontType(value: unknown): value is FontType {
  return typeof value === 'string' && FONT_TYPES.includes(value as FontType)
}

function normalizeSnapshot(value: unknown): ThemeBootSnapshot | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const record = value as Record<string, unknown>

  if (!isThemeType(record.themeType) || !isFontType(record.fontType)) {
    return null
  }

  return {
    themeType: record.themeType,
    autoSwitch: record.autoSwitch === true,
    mode: record.mode === 'compact' ? 'compact' : 'default',
    fontType: record.fontType,
  }
}

/**
 * 从用户配置中提取首屏需要的最小快照。
 */
function getThemeBootSnapshot(options: Options | undefined): ThemeBootSnapshot {
  const theme = options?.theme

  return {
    themeType: isThemeType(theme?.type) ? theme.type : 'light-default',
    autoSwitch: theme?.autoSwitch === true,
    mode: theme?.mode === 'compact' ? 'compact' : 'default',
    fontType: isFontType(options?.font?.type) ? options.font.type : 'system',
  }
}

/**
 * 读取首屏主题缓存。缓存不可用时返回 null，由 storage 或默认值兜底。
 */
function readThemeBootSnapshot(): ThemeBootSnapshot | null {
  try {
    const value = window.localStorage.getItem(THEME_BOOT_STORAGE_KEY)

    return value ? normalizeSnapshot(JSON.parse(value)) : null
  }
  catch {
    return null
  }
}

/**
 * 写入首屏主题缓存。
 *
 * 注意：options 页面运行在 `chrome-extension://` origin，不能直接写 V2EX
 * 页面的 localStorage。该函数只应在 V2EX 页面的 content script 中调用。
 */
function writeThemeBootSnapshot(snapshot: ThemeBootSnapshot): void {
  try {
    const value = JSON.stringify(snapshot)

    if (window.localStorage.getItem(THEME_BOOT_STORAGE_KEY) === value) {
      return
    }

    window.localStorage.setItem(THEME_BOOT_STORAGE_KEY, value)
  }
  catch {
    // localStorage 被禁用时继续使用 chrome.storage 和默认值。
  }
}

export function writeThemeBootSnapshotFromOptions(options: Options | undefined): void {
  writeThemeBootSnapshot(getThemeBootSnapshot(options))
}

/**
 * 从 chrome.storage 读取一次首屏配置，并限制等待时间。
 *
 * 正常情况下缓存会命中；这里用于首次安装、缓存缺失或缓存过期的校准。
 */
async function readThemeBootOptions(timeoutMs = 120): Promise<ThemeBootSnapshot | null> {
  if (typeof chrome === 'undefined' || !chrome.storage?.sync) {
    return null
  }

  let timer: ReturnType<typeof setTimeout> | undefined

  try {
    const options = await Promise.race([
      chrome.storage.sync.get(StorageKey.Options).then((items) => {
        return (items as StorageItems)[StorageKey.Options]
      }),
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), timeoutMs)
      }),
    ])

    return options ? getThemeBootSnapshot(options) : null
  }
  catch {
    return null
  }
  finally {
    if (timer) {
      clearTimeout(timer)
    }
  }
}

/**
 * 将主题应用到 html 和 body。
 *
 * html 上的属性负责首帧颜色和背景，body 类保留给现有的布局规则。
 */
export function setThemeType(type: ThemeType): void {
  const root = document.documentElement

  root.dataset[THEME_ATTRIBUTE] = type
  root.style.colorScheme = type === 'dark-default' ? 'dark' : 'light'

  if (!document.body) {
    return
  }

  for (const className of [...document.body.classList]) {
    if (className.startsWith(THEME_CLASS_PREFIX)) {
      document.body.classList.remove(className)
    }
  }

  document.body.classList.add(`${THEME_CLASS_PREFIX}${type}`)
}

export function setMode(mode: ThemeMode): void {
  document.documentElement.dataset[MODE_ATTRIBUTE] = mode
  document.body?.classList.toggle(COMPACT_CLASS, mode === 'compact')
}

function ensureFontStylesheet(id: string, href: string): void {
  if (document.getElementById(id) || pendingFontStylesheets.has(id)) {
    return
  }

  pendingFontStylesheets.add(id)

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  /** 先以 print 媒体加载，避免自定义字体样式表阻塞首屏渲染。 */
  link.media = 'print'
  link.href = href
  link.addEventListener(
    'load',
    () => {
      link.media = 'all'
    },
    { once: true },
  )

  const append = () => {
    document.head?.appendChild(link)
  }

  if (document.head) {
    append()

    return
  }

  const observer = new MutationObserver(() => {
    if (document.head) {
      observer.disconnect()
      append()
    }
  })

  observer.observe(document.documentElement, { childList: true, subtree: true })
}

export function setFontType(type: FontType): void {
  document.documentElement.dataset[FONT_ATTRIBUTE] = type

  document.body?.style.removeProperty('font-family')

  const stylesheet = FONT_STYLESHEETS[type]

  if (stylesheet) {
    ensureFontStylesheet(stylesheet.id, stylesheet.href)
  }
}

function getEffectiveThemeType(snapshot: ThemeBootSnapshot): ThemeType {
  if (snapshot.autoSwitch && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark-default'
  }

  return snapshot.themeType
}

function applyBodyState(): void {
  if (!currentSnapshot || !document.body) {
    return
  }

  setThemeType(getEffectiveThemeType(currentSnapshot))
  setMode(currentSnapshot.mode)
  syncViewportMode()
}

export function syncViewportMode(): void {
  const isMobile = Boolean(document.getElementById('site-header'))

  document.body?.classList.toggle(MOBILE_CLASS, isMobile)

  if (isMobile) {
    document.documentElement.dataset[MOBILE_ATTRIBUTE] = 'true'
  }
  else {
    delete document.documentElement.dataset[MOBILE_ATTRIBUTE]
  }
}

/**
 * 应用一份主题快照。设置 html 属性后，页面即可按正确主题显示。
 */
function applyThemeSnapshot(snapshot: ThemeBootSnapshot): void {
  currentSnapshot = snapshot

  setFontType(snapshot.fontType)
  setThemeType(getEffectiveThemeType(snapshot))
  setMode(snapshot.mode)

  try {
    performance.mark('v2p-theme-ready')
  }
  catch {
    // 部分用户脚本环境可能不支持 Performance API。
  }

  if (document.body) {
    syncViewportMode()
  }
}

function watchDocumentState(): void {
  if (document.readyState !== 'loading') {
    applyBodyState()
    syncViewportMode()

    return
  }

  const applyPendingState = () => {
    if (!bodyStateApplied && document.body) {
      applyBodyState()
      bodyStateApplied = true
    }

    const hasMobileHeader = Boolean(document.getElementById('site-header'))

    if (!document.documentElement.dataset[MOBILE_ATTRIBUTE] && hasMobileHeader) {
      syncViewportMode()
    }

    if (bodyStateApplied && hasMobileHeader) {
      documentObserver?.disconnect()
      documentObserver = null
    }
  }

  documentObserver?.disconnect()
  documentObserver = new MutationObserver(applyPendingState)
  documentObserver.observe(document.documentElement, { childList: true, subtree: true })

  document.addEventListener(
    'DOMContentLoaded',
    () => {
      applyBodyState()
      syncViewportMode()
      documentObserver?.disconnect()
      documentObserver = null
    },
    { once: true },
  )
}

function listenForColorSchemeChanges(): void {
  if (colorMediaListening) {
    return
  }

  const media = window.matchMedia('(prefers-color-scheme: dark)')

  media.addEventListener('change', () => {
    if (currentSnapshot?.autoSwitch) {
      applyThemeSnapshot(currentSnapshot)
    }
  })
  colorMediaListening = true
}

/**
 * 首屏主题启动流程。
 *
 * 先用 localStorage 缓存立即上色；随后用短时间 storage 读取校准。
 * 缓存和 storage 都不可用时使用默认亮色主题，避免页面永久隐藏。
 */
export async function initializeThemeBoot(): Promise<void> {
  watchDocumentState()

  const cachedSnapshot = readThemeBootSnapshot()

  if (cachedSnapshot) {
    applyThemeSnapshot(cachedSnapshot)
  }

  const storedSnapshot = await readThemeBootOptions(cachedSnapshot ? 50 : 120)

  if (storedSnapshot) {
    applyThemeSnapshot(storedSnapshot)
    writeThemeBootSnapshot(storedSnapshot)
  }
  else if (!cachedSnapshot) {
    applyThemeSnapshot(DEFAULT_THEME_BOOT_SNAPSHOT)
  }

  listenForColorSchemeChanges()
}
