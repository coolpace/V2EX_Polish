import { MessageFrom } from './constants'
import type { MessagePayload } from './types'

declare global {
  interface Window {
    thankReply: () => void
  }
}

window.addEventListener('message', (ev: MessageEvent<MessagePayload>) => {
  if (ev.data.from === MessageFrom.Content) {
    // console.log(111, window, window.thankReply)
  }
})

const payload: MessagePayload = { from: MessageFrom.Web, data: 'loaded' }

window.postMessage(payload)
