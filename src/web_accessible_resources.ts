import { MessageFrom } from './constants'
import type { MessageData } from './types'

declare global {
  interface Window {
    thankReply: () => void
    once: string
  }
}

window.addEventListener('message', (ev: MessageEvent<MessageData>) => {
  if (ev.data.from === MessageFrom.Content) {
    const payload = ev.data.payload

    if (payload?.once) {
      window.once = payload.once // 从 Content 页获取到 once 后更新回 Web 页的 once。
    }
  }
})

const messageData: MessageData = { from: MessageFrom.Web, payload: { once: window.once } }

window.postMessage(messageData)
