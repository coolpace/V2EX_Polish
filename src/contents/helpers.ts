import {
  ArrowUpRightSquare,
  BookOpenCheck,
  ChevronDown,
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
  emojiLinks,
  MessageFrom,
  type PopularEmoji,
  READING_CONTENT_LIMIT,
  StorageKey,
} from '../constants'
import type {
  Member,
  MemberTag,
  MessageData,
  ReadingItem,
  Tag,
  ThemeType,
  V2EX_RequestErrorResponce,
} from '../types'
import { getRunEnv, getStorage, setStorage, sleep } from '../utils'
import { $body, $wrapper, replyTextArea } from './globals'

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

export async function setMemberTags(params: {
  memberName: Member['username']
  memberAvatar?: Member['avatar']
  tags: Tag[] | undefined
}) {
  const { memberName, memberAvatar, tags } = params

  const storage = await getStorage(false)
  const tagData = storage[StorageKey.MemberTag]

  const runEnv = getRunEnv()

  if (!(runEnv === 'chrome' || runEnv === 'web-ext')) {
    // 非浏览器扩展不能设置用户标签。
    return
  }

  if (tags && tags.length > 0) {
    const newTagData: MemberTag = {
      ...tagData,
      [memberName]: { tags, avatar: memberAvatar || tagData?.[memberName]?.avatar },
    }
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
 * 对字符串进行自定义转义处理。
 *
 * 该函数旨在对字符串中的非ASCII字符进行转义，使其能够安全地在特定环境中使用，比如 URL、HTML 等。
 * 转义规则是将非 ASCII 字符转换为 %xx 的形式，其中xx是字符的 16 进制值。
 */
function customEscape(str: string) {
  return str.replace(
    /[^a-zA-Z0-9_.!~*'()-]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`
  )
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
        const decodedStr = decodeURIComponent(customEscape(window.atob(text)))
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

/**
 * 将页面中带有 data-lucide 属性的元素替换为 lucide SVG 图标。
 *
 * 此方法是为了方便统一设置页面中的所有图标，一般在元素有图标更新需要时，都需要及时调用此方法以及时设置图标。
 */
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
        ChevronDown,
        ArrowUpRightSquare,
      },
    })
  }, 0)
}

/**
 * 将形如 [表情代码] 转换成表情图片的网络链接。
 */
export function transformEmoji(textValue: string) {
  return textValue.replace(/\[[^\]]+\]/g, (x) => {
    const emojiLink = emojiLinks[x as PopularEmoji].ld

    if (typeof emojiLink === 'string') {
      return `${emojiLink} `
    }

    return x
  })
}

/**
 * 将用户标签数据转换为字符串。
 */
export function getTagsText(tags: Tag[]): string {
  return tags.map((it) => it.name).join('，')
}

export function setTheme(type: ThemeType) {
  // 在切换主题时，先删除所有已有的主题类。
  $body.get(0)?.classList.forEach((cls) => {
    if (cls.startsWith('v2p-theme-')) {
      $body.removeClass(cls)
    }
  })

  $body.addClass(`v2p-theme-${type}`)
}

/**
 * 设置主题。
 */
export function initTheme({
  autoSwitch,
  themeType = 'light-default',
}: {
  autoSwitch?: boolean
  themeType?: ThemeType
}) {
  // 优先按照设置执行自动切换主题。
  if (autoSwitch) {
    const perfersDark = window.matchMedia('(prefers-color-scheme: dark)')

    if (perfersDark.matches) {
      setTheme('dark-default')
    } else if (themeType === 'dark-default') {
      setTheme('light-default')
    } else {
      setTheme(themeType)
    }

    perfersDark.addEventListener('change', ({ matches }) => {
      if (matches) {
        setTheme('dark-default')
      } else if (themeType === 'dark-default') {
        setTheme('light-default')
      } else {
        setTheme(themeType)
      }
    })
  } else {
    setTheme(themeType)
  }
}

interface ToggleThemeParams {
  /** V2EX 原生页面中的主题切换按钮。 */
  $toggle: JQuery
  /** 用户是否要切换为暗色主题。 */
  prefersDark: boolean
  /** 自定义的主题类型。 */
  themeType?: ThemeType
}

/**
 * 处理主题类型变更后如何切换主题。
 */
export function toggleTheme({
  $toggle,
  prefersDark,
  themeType = 'light-default',
}: ToggleThemeParams) {
  const isPageDark = $wrapper.hasClass('Night')
  const shouldSync = prefersDark !== isPageDark

  // 如果检测到本地设置与用户偏好设置不一致：
  if (shouldSync) {
    const toggleThemeUrl = $toggle.attr('href') // href='/settings/night/toggle'

    // 调用远程接口修改 cookie，以便下次刷新页面时保持配置一致。
    if (typeof toggleThemeUrl === 'string') {
      fetch(toggleThemeUrl)
    }

    // 同时修改切换按钮。
    if (prefersDark) {
      $toggle.prop('title', '使用浅色主题')
      $toggle.html('<i data-lucide="sun"></i>')
    } else {
      $toggle.prop('title', '使用深色主题')
      $toggle.html('<i data-lucide="moon"></i>')
    }
  }

  if (prefersDark) {
    setTheme('dark-default')
    $wrapper.addClass('Night')
  } else {
    setTheme(themeType)
    $wrapper.removeClass('Night')
  }

  loadIcons()
}
