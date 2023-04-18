import { style } from './style'

$(`<style type='text/css'>${style}</style>`).appendTo('head')

void (async () => {
  await import('../contents/common')
  await import('../contents/home/index')
  await import('../contents/topic/index')
})()
