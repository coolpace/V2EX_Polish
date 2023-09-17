import {
  BookOpenCheck,
  ChevronsUp,
  createIcons,
  EyeOff,
  Heart,
  MessageSquare,
  MessageSquarePlus,
  Moon,
  PackagePlus,
  Smile,
  Star,
  Sun,
  Twitter,
} from 'lucide'

import { createToast } from '../components/toast'
import {
  type BiliEmoji,
  biliEmojiLink,
  MessageFrom,
  READING_CONTENT_LIMIT,
  StorageKey,
} from '../constants'
import type {
  Member,
  MemberTag,
  MessageData,
  ReadingItem,
  Tag,
  V2EX_RequestErrorResponce,
} from '../types'
import { getRunEnv, getStorage, setStorage, sleep } from '../utils'
import { replyTextArea } from './globals'

/**
 * 检查请求的错误是否由 V2EX 发出。
 */
export function isV2EX_RequestError(error: any): error is V2EX_RequestErrorResponce {
  if ('cause' in error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const cause = error['cause']

    if ('success' in cause && 'message' in cause) {
      return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof cause['success'] === 'boolean' &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        !cause['success'] &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof cause['message'] === 'string'
      )
    }
  }

  return false
}

export function focusReplyInput() {
  if (replyTextArea instanceof HTMLTextAreaElement) {
    replyTextArea.focus()
  }
}

/**
 * 插入文本至回复输入框中，聚焦输入框，并更新光标位置。
 */
export function insertTextToReplyInput(text: string) {
  if (replyTextArea instanceof HTMLTextAreaElement) {
    const startPos = replyTextArea.selectionStart
    const endPos = replyTextArea.selectionEnd

    const valueToStart = replyTextArea.value.substring(0, startPos)
    const valueFromEnd = replyTextArea.value.substring(endPos, replyTextArea.value.length)
    replyTextArea.value = `${valueToStart}${text}${valueFromEnd}`

    focusReplyInput()

    replyTextArea.selectionStart = replyTextArea.selectionEnd = startPos + text.length
  }
}

export async function setMemberTags(memberName: Member['username'], tags: Tag[] | undefined) {
  const storage = await getStorage(false)
  const tagData = storage[StorageKey.MemberTag]

  const runEnv = getRunEnv()

  if (!(runEnv === 'chrome' || runEnv === 'web-ext')) {
    return
  }

  if (tags && tags.length > 0) {
    const newTagData: MemberTag = { ...tagData, [memberName]: { tags } }
    await setStorage(StorageKey.MemberTag, newTagData)
  } else {
    if (tagData && Reflect.has(tagData, memberName)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete tagData[memberName]
      await setStorage(StorageKey.MemberTag, tagData)
    }
  }
}

/**
 * 将主题添加到稍后阅读清单。
 */
export async function addToReadingList(params: Pick<ReadingItem, 'url' | 'title' | 'content'>) {
  const { url, title, content } = params

  if (!(typeof url === 'string' || typeof title === 'string' || typeof content === 'string')) {
    const message = '无法识别将该主题的元数据'
    createToast({ message })
    throw new Error(message)
  }

  const storage = await getStorage()

  const currentData = storage[StorageKey.ReadingList]?.data || []
  const exist = currentData.findIndex((it) => it.url === url) !== -1

  if (exist) {
    createToast({ message: '该主题已存在于稍后阅读' })
  } else {
    if (window.__V2P_AddingReading !== true) {
      window.__V2P_AddingReading = true

      try {
        await setStorage(StorageKey.ReadingList, {
          data: [
            {
              url,
              title: title.replace(' - V2EX', ''),
              content:
                content.length > READING_CONTENT_LIMIT
                  ? content.substring(0, READING_CONTENT_LIMIT) + '...'
                  : content,
              addedTime: Date.now(),
            },
            ...currentData,
          ],
        })

        createToast({ message: '✅ 已添加进稍后阅读' })

        // 加入延时等待，防止连续触发添加操作。
        await sleep(500)
      } finally {
        window.__V2P_AddingReading = false
      }
    }
  }
}

/**
 * 解析主题内容页面内所有可能的 Base64 字符串。
 */
export function decodeBase64TopicPage() {
  /**
   * 要检测一段字符是否为base64编码，可以使用以下方法：
   * 1. 检查字符长度是否为4的倍数，如果不是则不是base64编码。
   * 2. 检查字符是否只包含base64字符集中的字符，即A-Z、a-z、0-9、+、/和=（用于填充）。
   * 3. 检查填充字符“=”的位置是否正确。在base64编码中，每个字符都代表6个位，但不足24位的数据需要填充。如果有1个字节的数据，填充字符“=”出现在编码的结尾；如果有2个字节的数据，填充字符“=”出现在编码的结尾；如果有3个字节的数据，没有填充字符。

   * 如果以上三个条件都满足，则可以认为这段字符是base64编码。
   */

  const dataTitle = '点击复制'

  if (window.__V2P_DecodeStatus === 'decodeed') {
    createToast({ message: '已解析完本页所有的 Base64 字符串' })
  } else {
    // 不能从 global.ts 中引入，否则会出现脚本执行错误，此错误发生原因未知。
    const $topicContentBox = $('#Main .box:has(.topic_content)')
    const $commentBox = $('#Main .box:has(.cell[id^="r_"])')
    const $commentCells = $commentBox.find('.cell[id^="r_"]')

    let count = 0

    // 已知以下高频字符串不能作为 base64 字符串识别，排除掉。
    const excludeList = [
      'boss',
      'bilibili',
      'Bilibili',
      'Encrypto',
      'encrypto',
      'Window10',
      'airpords',
      'Windows7',
    ]

    const convertHTMLText = (text: string, excludeTextList?: string[]): string => {
      // 检查长度是否为 4 的倍数，字符长度小的也排除掉。
      if (text.length % 4 !== 0 || text.length <= 8) {
        return text
      }

      // 从排除列表中排除掉非 base64 字符串。
      if (excludeList.includes(text)) {
        return text
      }

      // 检查填充字符 "=" 的位置是否正确。
      if (text.includes('=')) {
        const paddingIndex = text.indexOf('=')
        if (paddingIndex !== text.length - 1 && paddingIndex !== text.length - 2) {
          return text
        }
      }

      // 排除特定标签中的 base64 字符串。
      if (excludeTextList?.some((excludeText) => excludeText.includes(text))) {
        return text
      }

      try {
        const decodedStr = decodeURIComponent(window.atob(text))
        count += 1
        return `${text}<span class="v2p-decode-block">(<ins class="v2p-decode" data-title="${dataTitle}">${decodedStr}</ins>)</span>`
      } catch (err) {
        if (err instanceof Error) {
          console.error(`解析 Base64 出错：${err.message}`)
        }

        return text
      }
    }

    const base64regex = /[A-z0-9+/=]+/g

    const contentHandler = (_: number, content: HTMLElement) => {
      const excludeTextList = [
        ...content.getElementsByTagName('a'),
        ...content.getElementsByTagName('img'),
      ].map((ele) => ele.outerHTML)

      content.innerHTML = content.innerHTML.replace(base64regex, (htmlText) =>
        convertHTMLText(htmlText, excludeTextList)
      )
    }

    $commentCells.find('.reply_content').each(contentHandler)

    $topicContentBox.find('.topic_content').each(contentHandler)

    if (count === 0) {
      createToast({ message: '本页未发现 Base64 字符串' })
    } else {
      window.__V2P_DecodeStatus = 'decodeed'
      createToast({ message: `✅ 已解析本页所有的 Base64 字符串，共 ${count} 条` })
    }

    $('.v2p-decode').on('click', (ev) => {
      const text = ev.target.innerText
      void navigator.clipboard.writeText(text).then(() => {
        ev.target.dataset.title = '✅ 已复制'
        setTimeout(() => {
          ev.target.dataset.title = dataTitle
        }, 1000)
      })
    })
  }
}

/**
 * 发送任务脚本到原 Web 页中执行，并返回执行结果。
 */
export function postTask(expression: string, callback?: (result: unknown) => void) {
  const runEnv = getRunEnv()

  if (!runEnv) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const result = Function(`"use strict"; ${expression}`)()
    callback?.(result)
  } else {
    if (callback) {
      if (window.__V2P_Tasks) {
        window.__V2P_Tasks.set(Date.now(), callback)
      } else {
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

export function loadIcons() {
  setTimeout(() => {
    createIcons({
      attrs: {
        width: '100%',
        height: '100%',
      },
      icons: {
        MessageSquarePlus,
        MessageSquare,
        BookOpenCheck,
        ChevronsUp,
        Heart,
        EyeOff,
        Sun,
        Moon,
        Smile,
        PackagePlus,
        Star,
        Twitter,
      },
    })
  }, 0)
}

export function transformEmoji(textValue: string) {
  return textValue.replace(/\[[^\]]+\]/g, (x) => {
    const emojiLink = biliEmojiLink[x as BiliEmoji]

    if (typeof emojiLink === 'string') {
      return `${emojiLink} `
    }

    return x
  })
}
