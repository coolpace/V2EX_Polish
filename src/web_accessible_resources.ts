import { MessageFrom } from './constants'
import type { MessageData } from './types'

declare global {
  interface Window {
    thankReply: () => void
    once: string
  }
}

const messageData: MessageData = { from: MessageFrom.Web, payload: { once: window.once } }

window.postMessage(messageData)
