import { patternToRegex } from 'webext-patterns'

import { style } from './style'

const commonRegex = patternToRegex('https://v2ex.com/*', 'https://www.v2ex.com/*')
const topicRegex = patternToRegex('https://v2ex.com/t/*', 'https://www.v2ex.com/t/*')

const url = window.location.href

void (async () => {
  if (commonRegex.test(url)) {
    $(`<style type='text/css'>${style}</style>`).appendTo('head')

    import('../contents/common')
    import('../contents/home/index')
  }

  if (topicRegex.test(url)) {
    await import('../contents/topic/index')
  }
})()
