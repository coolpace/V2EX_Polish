import { MessageFrom } from './constants'
import type { MessageData, Once } from './types'

declare global {
  interface Window {
    once: Once
  }
}

window.addEventListener('message', (ev: MessageEvent<MessageData>) => {
  if (ev.data.from === MessageFrom.Content) {
    const task = ev.data.payload?.task

    if (task) {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const result = Function(`"use strict"; ${task.expression}`)()
      const messageData: MessageData = {
        from: MessageFrom.Web,
        payload: { task: { id: task.id, result } },
      }
      window.postMessage(messageData)
    }
  }
})

const messageData: MessageData = {
  from: MessageFrom.Web,
  payload: { status: 'ready' },
}

window.postMessage(messageData)
