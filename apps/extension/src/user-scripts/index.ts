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

    if (commonRegex.test(url) && isHomePage(url)) {
      await loadModule('home', () => import('../contents/home/index'))
    }

    if (topicRegex.test(url)) {
      await loadModule('topic', () => import('../contents/topic/index'))
    }

    if (writeRegex.test(url)) {
      await loadModule('write', () => import('../contents/write/index'))
    }

    if (memberRegex.test(url)) {
      await loadModule('member', () => import('../contents/member/index'))
    }

    if (settingsRegex.test(url)) {
      await loadModule('settings', () => import('../contents/settings/index'))
    }

    if (notificationsRegex.test(url)) {
      await loadModule('notifications', () => import('../contents/notifications/index'))
    }

    if (missionRegex.test(url)) {
      await loadModule('mission', () => import('../contents/mission/index'))
    }

    if (goRegex.test(url)) {
      await loadModule('go', () => import('../contents/go/index'))
    }
  })()
})
