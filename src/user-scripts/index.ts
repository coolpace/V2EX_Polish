// 如果要在 GreaseMonkey 中运行本地文件，需设置「@require file:///[file path]」。

import { patternToRegex } from 'webext-patterns'

import { style } from './style'

function runAfterLoaded(fn: () => void): void {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      fn()
    })
  }
}

if (typeof window.GM_addStyle !== 'undefined') {
  // 使用「GM_addStyle」配合「@run-at document-start」，可以解决样式切换导致的页面闪烁问题。
  window.GM_addStyle(style)
} else {
  runAfterLoaded(() => {
    $(`<style type='text/css'>${style}</style>`).appendTo('head')
  })
}

const allowedHosts = [
  'https://v2ex.com',
  'https://www.v2ex.com',
  'https://cn.v2ex.com',
  'https://jp.v2ex.com',
  'https://de.v2ex.com',
  'https://us.v2ex.com',
  'https://hk.v2ex.com',
  'https://global.v2ex.com',
  'https://fast.v2ex.com',
  'https://s.v2ex.com',
  'https://origin.v2ex.com',
  'https://staging.v2ex.com',
]

const commonRegex = patternToRegex(...allowedHosts.map((host) => `${host}/*`))
const topicRegex = patternToRegex(...allowedHosts.map((host) => `${host}/t/*`))
const writeRegex = patternToRegex(...allowedHosts.map((host) => `${host}/write/*`))

runAfterLoaded(() => {
  const url = window.location.href

  void (async () => {
    if (commonRegex.test(url)) {
      await import('../contents/common')
      await import('../contents/home/index')
    }

    if (topicRegex.test(url)) {
      await import('../contents/topic/index')
    }

    if (writeRegex.test(url)) {
      await import('../contents/write/index')
    }
  })()
})
