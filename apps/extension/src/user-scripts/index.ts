import jQuery from 'jquery'
import { patternToRegex } from 'webext-patterns'

import { V2EX_DOMAINS } from '../constants'
import { markBootState } from '../contents/boot-markers'
import { setRuntime } from '../runtime'
import { userscriptRuntime } from '../runtime/userscript'
import { initializeThemeBoot } from '../theme-state'
import { style } from './style'

Object.assign(globalThis, { $: jQuery, jQuery })
setRuntime(userscriptRuntime)

markBootState()
void initializeThemeBoot()

function runAfterLoaded(fn: () => void): void {
  if (document.readyState !== 'loading') {
    fn()
  }
  else {
    document.addEventListener('DOMContentLoaded', () => {
      fn()
    })
  }
}

if (typeof GM_addStyle === 'function') {
  // 使用「GM_addStyle」配合「@run-at document-start」，可以解决样式切换导致的页面闪烁问题。
  GM_addStyle(style)
}
else {
  runAfterLoaded(() => {
    $(`<style type='text/css'>${style}</style>`).appendTo('head')
  })
}

const allowedHosts = V2EX_DOMAINS.map((domain) => `https://${domain}`)

const commonRegex = patternToRegex(...allowedHosts.map((host) => `${host}/*`))
const topicRegex = patternToRegex(...allowedHosts.map((host) => `${host}/t/*`))
const writeRegex = patternToRegex(...allowedHosts.map((host) => `${host}/write*`))
const memberRegex = patternToRegex(...allowedHosts.map((host) => `${host}/member/*`))
const settingsRegex = patternToRegex(...allowedHosts.map((host) => `${host}/settings*`))
const notificationsRegex = patternToRegex(...allowedHosts.map((host) => `${host}/notifications*`))
const missionRegex = patternToRegex(...allowedHosts.map((host) => `${host}/mission/daily*`))
const goRegex = patternToRegex(...allowedHosts.map((host) => `${host}/go/*`))

interface PageModule {
  name: string
  matches: (url: string) => boolean
  load: () => Promise<unknown>
}

function isHomePage(url: string): boolean {
  const path = new URL(url).pathname

  return !(
    path.startsWith('/t/')
    || path.startsWith('/notes/')
    || path.startsWith('/settings')
    || path.startsWith('/write')
    || path.startsWith('/member/')
    || path.startsWith('/mission/daily')
    || path.startsWith('/notifications')
    || path.startsWith('/go/')
  )
}

const pageModules: readonly PageModule[] = [
  {
    name: 'home',
    matches: (url) => commonRegex.test(url) && isHomePage(url),
    load: () => import('../contents/home/index'),
  },
  {
    name: 'topic',
    matches: (url) => topicRegex.test(url),
    load: () => import('../contents/topic/index'),
  },
  {
    name: 'write',
    matches: (url) => writeRegex.test(url),
    load: () => import('../contents/write/index'),
  },
  {
    name: 'member',
    matches: (url) => memberRegex.test(url),
    load: () => import('../contents/member/index'),
  },
  {
    name: 'settings',
    matches: (url) => settingsRegex.test(url),
    load: () => import('../contents/settings/index'),
  },
  {
    name: 'notifications',
    matches: (url) => notificationsRegex.test(url),
    load: () => import('../contents/notifications/index'),
  },
  {
    name: 'mission',
    matches: (url) => missionRegex.test(url),
    load: () => import('../contents/mission/index'),
  },
  {
    name: 'go',
    matches: (url) => goRegex.test(url),
    load: () => import('../contents/go/index'),
  },
]

async function loadModule(
  name: string,
  loader: () => Promise<unknown>,
): Promise<void> {
  try {
    await loader()
  }
  catch (error) {
    console.error(`[V2EX Polish] 页面模块加载失败：${name}`, error)
  }
}

runAfterLoaded(() => {
  const url = window.location.href

  void (async () => {
    if (commonRegex.test(url)) {
      await loadModule('common', () => import('../contents/common'))
    }

    if (window.top === window) {
      const [
        { initializeUserScriptShell },
        { startUserscriptScheduler },
      ] = await Promise.all([
        import('./shell'),
        import('./scheduler'),
      ])

      initializeUserScriptShell()
      startUserscriptScheduler()
    }

    for (const pageModule of pageModules) {
      if (pageModule.matches(url)) {
        await loadModule(pageModule.name, pageModule.load)
      }
    }
  })()
})
