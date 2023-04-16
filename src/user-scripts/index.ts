import { injectGlobalStyle } from './style'

injectGlobalStyle()

void (async () => {
  await import('../contents/common')
  await import('../contents/home/index')
  await import('../contents/topic/index')
})()
