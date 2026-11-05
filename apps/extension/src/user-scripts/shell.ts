import { StorageKey } from '../constants'
import { addToReadingList, decodeBase64TopicPage } from '../contents/helpers'
import { getRuntime } from '../runtime'
import type { ReadingItem } from '../types'
import { getStorage } from '../utils'
import { mountControlCenter } from './control-center'
import { mountOptionsPanel } from './options-panel'
import { userscriptUiStyles } from './ui-styles'

interface OpenOptionsDetail {
  section?: string
}

interface OpenControlCenterDetail {
  tab?: string
}

type OverlayKind = 'settings' | 'control'

const HOST_ID = 'v2p-userscript-host'

let shadowRoot: ShadowRoot | undefined
let launcher: HTMLButtonElement | undefined
let overlay: HTMLElement | undefined
let disposeActivePanel: (() => void) | undefined
let toastTimer: ReturnType<typeof setTimeout> | undefined
let initialized = false
let previousFocus: HTMLElement | null = null

function closeActivePanel(): void {
  disposeActivePanel?.()
  disposeActivePanel = undefined
  overlay?.remove()
  overlay = undefined

  if (launcher) {
    launcher.hidden = false
  }

  previousFocus?.focus()
  previousFocus = null
}

function getThemeClass(): string {
  const isDark = document.body.classList.contains('Night')
    || document.documentElement.classList.contains('Night')
    || document.body.classList.contains('v2p-theme-dark-default')

  return isDark ? 'v2p-dark' : ''
}

function ensureShell(): { shadow: ShadowRoot, launcher: HTMLButtonElement } | undefined {
  if (shadowRoot && launcher) {
    return { shadow: shadowRoot, launcher }
  }

  if (window.top !== window || !document.documentElement) {
    return undefined
  }

  const host = document.createElement('div')
  host.id = HOST_ID
  host.className = getThemeClass()
  document.documentElement.append(host)

  new MutationObserver(() => {
    host.className = getThemeClass()
  }).observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
  })

  shadowRoot = host.attachShadow({ mode: 'open' })
  const style = document.createElement('style')
  style.textContent = userscriptUiStyles
  shadowRoot.append(style)

  launcher = document.createElement('button')
  launcher.type = 'button'
  launcher.className = 'v2p-launcher'
  launcher.title = '打开 V2EX Polish'
  launcher.setAttribute('aria-label', '打开 V2EX Polish')
  launcher.textContent = 'V2P'
  launcher.addEventListener('click', () => {
    openControlCenter()
  })
  shadowRoot.append(launcher)

  return { shadow: shadowRoot, launcher }
}

function createOverlay(kind: OverlayKind): HTMLElement | undefined {
  const shell = ensureShell()

  if (!shell) {
    return undefined
  }

  closeActivePanel()
  previousFocus = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null
  shell.launcher.hidden = true
  shell.shadow.host.className = getThemeClass()

  const isSettings = kind === 'settings'
  const nextOverlay = document.createElement('div')
  nextOverlay.className = isSettings
    ? 'v2p-overlay v2p-settings-overlay'
    : 'v2p-overlay v2p-control-center-overlay'
  nextOverlay.setAttribute('role', 'dialog')
  nextOverlay.setAttribute('aria-modal', 'true')
  nextOverlay.setAttribute(
    'aria-label',
    isSettings ? 'V2EX Polish 设置' : 'V2EX Polish 用户面板',
  )

  const panel = document.createElement('div')
  panel.className = isSettings ? 'v2p-settings-panel' : ''
  nextOverlay.append(panel)

  nextOverlay.addEventListener('click', (event) => {
    if (event.target === nextOverlay) {
      closeActivePanel()
    }
  })

  shell.shadow.append(nextOverlay)
  overlay = nextOverlay

  return panel
}

export function openOptions(section?: string): void {
  const panel = createOverlay('settings')

  if (!panel) {
    return
  }

  panel.innerHTML = '<div class="v2p-loading">正在加载设置...</div>'

  void mountOptionsPanel({
    container: panel,
    initialSection: section,
    close: closeActivePanel,
  }).catch((error: unknown) => {
    panel.innerHTML = `
      <div class="v2p-settings-section">
        <div class="v2p-error">${error instanceof Error ? error.message : '设置加载失败'}</div>
      </div>
    `
  }).finally(() => {
    panel.querySelector<HTMLElement>('button')?.focus()
  })
}

export function openControlCenter(tab?: string): void {
  const panel = createOverlay('control')

  if (!panel) {
    return
  }

  disposeActivePanel = mountControlCenter({
    container: panel,
    initialTab: tab,
    close: closeActivePanel,
    openSettings: (section) => {
      openOptions(section)
    },
  })

  queueMicrotask(() => {
    panel.querySelector<HTMLElement>('button')?.focus()
  })
}

export function showUserScriptToast(message: string): void {
  const shell = ensureShell()

  if (!shell) {
    return
  }

  shell.shadow.querySelector('.v2p-toast')?.remove()

  const toast = document.createElement('div')
  toast.className = 'v2p-toast'
  toast.textContent = message
  shell.shadow.append(toast)

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    toast.remove()
    toastTimer = undefined
  }, 4000)
}

function getCurrentTopicReadingItem(): Pick<
  ReadingItem,
  'url' | 'title' | 'content'
> | undefined {
  const topicId = window.location.pathname.match(/\/t\/(\d+)/)?.[1]

  if (!topicId) {
    return undefined
  }

  return {
    url: `${window.location.origin}/t/${topicId}`,
    title: document.title.replace(' - V2EX', ''),
    content: document.querySelector<HTMLMetaElement>(
      'head meta[property="og:description"]',
    )?.content ?? '',
  }
}

function registerMenuCommands(): void {
  const runtime = getRuntime()

  void getStorage(false).then((storage) => {
    if (storage[StorageKey.Options].contextMenu?.enabled === false) {
      return
    }

    runtime.registerMenuCommand('V2EX Polish 用户面板', () => openControlCenter())
    runtime.registerMenuCommand('V2EX Polish 设置', () => openOptions())

    const topic = getCurrentTopicReadingItem()

    if (topic) {
      runtime.registerMenuCommand('添加当前主题到稍后阅读', () => {
        void addToReadingList(topic)
      })
      runtime.registerMenuCommand('解析当前主题中的 Base64', () => {
        decodeBase64TopicPage()
        showUserScriptToast('已执行 Base64 解析')
      })
    }
  })
}

export function initializeUserScriptShell(): void {
  if (initialized || window.top !== window) {
    return
  }

  initialized = true
  ensureShell()

  window.addEventListener('v2p:open-options', (event) => {
    const detail = (event as CustomEvent<OpenOptionsDetail>).detail
    openOptions(detail?.section)
  })
  window.addEventListener('v2p:open-control-center', (event) => {
    const detail = (event as CustomEvent<OpenControlCenterDetail>).detail
    openControlCenter(detail?.tab)
  })
  window.addEventListener('v2p:toast', (event) => {
    const detail = (event as CustomEvent<{ message?: string }>).detail

    if (detail?.message) {
      showUserScriptToast(detail.message)
    }
  })
  window.addEventListener('keydown', (event) => {
    if (!overlay) {
      return
    }

    if (event.key === 'Escape') {
      closeActivePanel()

      return
    }

    if (event.key !== 'Tab' || !shadowRoot) {
      return
    }

    const focusable = Array.from(
      overlay.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hidden)

    if (focusable.length === 0) {
      return
    }

    const first = focusable[0]
    const last = focusable.at(-1)
    const active = shadowRoot.activeElement

    if (!first || !last) {
      return
    }

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    }
    else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  })

  registerMenuCommands()
}
