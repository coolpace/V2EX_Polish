import { getRunEnv, injectScript } from '../../utils'
import { handlerWrite } from './write'

void (async () => {
  const runEnv = getRunEnv()

  if (runEnv === 'chrome' || runEnv === 'web-ext') {
    await injectScript(chrome.runtime.getURL('scripts/web_accessible_resources.min.js'))
  }

  handlerWrite()
})()
