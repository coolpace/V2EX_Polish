import { MessageFrom } from './constants'
import type { MessageData } from './types'
import { isBrowserExtension } from './utils'

/**
 * 发送任务脚本到原 Web 页中执行，并返回执行结果。
 *
 * 此函数用于在浏览器扩展的内容脚本中执行需要访问页面原始上下文的代码。
 * - 在非扩展环境中，直接使用 Function 构造函数执行表达式
 * - 在扩展环境中，通过 postMessage 将任务发送到 web_accessible_resources 脚本执行
 *
 * @param expression - 要执行的 JavaScript 表达式字符串
 * @param callback - 可选的回调函数，接收执行结果
 */
export function postTask(expression: string, callback?: (result: unknown) => void) {
  if (!isBrowserExtension()) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    const result = Function(`"use strict"; ${expression}`)()
    callback?.(result)
  }
  else {
    if (callback) {
      if (window.__V2P_Tasks) {
        window.__V2P_Tasks.set(Date.now(), callback)
      }
      else {
        window.__V2P_Tasks = new Map([[Date.now(), callback]])
      }
    }

    const messageData: MessageData = {
      from: MessageFrom.Content,
      payload: { task: { id: Date.now(), expression } },
    }

    window.postMessage(messageData)
  }
}
