import { MessageFrom } from './constants'
import type { MessageData } from './types'

declare global {
  interface Window {
    once: string
  }
}

window.addEventListener('message', (ev: MessageEvent<MessageData>) => {
  if (ev.data.from === MessageFrom.Content) {
    const payload = ev.data.payload

    if (payload?.call?.exp) {
      const ret = eval(payload.call.exp)
      window.postMessage({
        from: MessageFrom.Web,

        payload: { call: { id: payload.call.id, ret } },
      })
    }
  }
})
