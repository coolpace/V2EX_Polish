import {
  ArrowUpRightSquare,
  BookOpenCheck,
  ChevronDown,
  ChevronsUp,
  createIcons,
  EyeOff,
  Heart,
  House,
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
  MessageKey,
  type PopularEmoji,
  READING_CONTENT_LIMIT,
  StorageKey,
} from '../constants'
import type {
  FontType,
  Member,
  MemberTag,
  ReadingItem,
  Tag,
  ThemeType,
  V2EX_RequestErrorResponce,
} from '../types'
import { getStorage, isBrowserExtension, setStorage, sleep } from '../utils'
import { $body, $commentCells, $wrapper, replyTextArea } from './globals'

/** 表情图片低清→高清的 URL 映射（模块级常量，避免每次调用重复创建）。 */
const emojiSrcMap = new Map<string, string>(
  Object.values(emojiLinks).map(({ ld, hd }) => [ld, hd]),
)

/**
 * 检查请求的错误是否由 V2EX 发出。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isV2EX_RequestError(error: any): error is V2EX_RequestErrorResponce {
  if ('cause' in error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const cause = error['cause']

    if ('success' in cause && 'message' in cause) {
      return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof cause['success'] === 'boolean'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        && !cause['success']
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        && typeof cause['message'] === 'string'
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

  if (!isBrowserExtension()) {
    // 非浏览器扩展不能设置用户标签。
    return
  }

  if (tags && tags.length > 0) {
    const newTagData: MemberTag = {
      ...tagData,
      [memberName]: { tags, avatar: memberAvatar || tagData?.[memberName]?.avatar },
    }
    await setStorage(StorageKey.MemberTag, newTagData)
  }
  else {
    if (tagData && Reflect.has(tagData, memberName)) {
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
  }
  else {
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
      }
      finally {
        window.__V2P_AddingReading = false
      }
    }
  }
}

/**
 * 将 `atob` 得到的 binary string（每个字符对应一个字节）按 UTF-8 解码为字符串。
 *
 * 相比早期 `decodeURIComponent(escape(atob(...)))` 的 hack 写法，使用 TextDecoder 可以：
 * - 正确处理 UTF-8 多字节序列（如中文）；
 * - 不会误伤原始 payload 中已存在的 `%` 字符；
 * - 通过 `fatal: true` 直接拒绝非法 UTF-8 字节，便于识别非文本的误匹配。
 */
function decodeBinaryAsUtf8(binary: string): string {
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

/**
 * 将 UTF-8 文本编码为 Base64。
 */
export function encodeUtf8AsBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''

  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }

  return window.btoa(binary)
}

/**
 * 旧版“文本转 Base64”会先执行 `encodeURIComponent`（或 `escape`）再 `btoa`，
 * 因此从 Base64 还原出的文本里，无论是 ASCII 段（如 `%40` → `@`）还是 UTF-8
 * 多字节段（如 `%E4%BD%A0` → `你`），都属于需要再做一次 URL 解码的历史数据。
 *
 * 对于确实包含字面量 `%` 但不构成合法编码的字符串，`decodeURIComponent` 会抛错，
 * 此时回退为原文，保证健壮性。
 */
function decodeLegacyPercentEncodedText(text: string): string {
  if (!/%[0-9A-Fa-f]{2}/.test(text)) {
    return text
  }

  try {
    return decodeURIComponent(text)
  }
  catch {
    return text
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
  }
  else {
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

    /**
     * 尝试将文本解码为 Base64。
     * 返回解码后的字符串，如果不是有效的 Base64 则返回 null。
     */
    const tryDecodeBase64 = (text: string): string | null => {
      // 检查长度是否为 4 的倍数，字符长度小的也排除掉。
      if (text.length % 4 !== 0 || text.length <= 8) {
        return null
      }

      // 从排除列表中排除掉非 base64 字符串。
      if (excludeList.includes(text)) {
        return null
      }

      // 检查填充字符 "=" 的位置是否正确。
      if (text.includes('=')) {
        const paddingIndex = text.indexOf('=')

        if (paddingIndex !== text.length - 1 && paddingIndex !== text.length - 2) {
          return null
        }
      }

      try {
        // 1) 先按 UTF-8 还原出原始文本（正确处理中文等多字节字符）。
        const decoded = decodeBinaryAsUtf8(window.atob(text))

        // 2) 兼容旧版先 URL 编码、再 Base64 的历史数据。
        return decodeLegacyPercentEncodedText(decoded)
      }
      catch (err) {
        if (err instanceof Error) {
          console.error(`解析 Base64 出错：${err.message}`)
        }

        return null
      }
    }

    // 修复正则：原 A-z 范围包含了 [\]^_ 等非 Base64 字符，改为 A-Za-z。
    const base64regex = /[A-Za-z0-9+/=]+/g

    /**
     * 使用 TreeWalker 遍历文本节点进行 Base64 解码，
     * 避免 innerHTML 替换导致的 DOM 结构重建和事件监听器丢失。
     */
    const contentHandler = (_: number, content: HTMLElement) => {
      const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT)
      const textNodes: Text[] = []

      // 先收集所有文本节点，避免在遍历过程中修改 DOM 导致 walker 失效。
      let node = walker.nextNode()

      while (node) {
        textNodes.push(node as Text)
        node = walker.nextNode()
      }

      for (const textNode of textNodes) {
        // 跳过 <a> 和 <img> 标签内的文本节点。
        if (textNode.parentElement?.closest('a, img')) {
          continue
        }

        const text = textNode.textContent ?? ''
        const parts: (string | { original: string, decoded: string })[] = []
        let lastIndex = 0
        let match: RegExpExecArray | null

        base64regex.lastIndex = 0
        match = base64regex.exec(text)

        while (match !== null) {
          const matched = match[0]
          const decoded = tryDecodeBase64(matched)

          if (decoded !== null) {
            // 保留匹配前的普通文本。
            if (match.index > lastIndex) {
              parts.push(text.slice(lastIndex, match.index))
            }

            parts.push({ original: matched, decoded })
            lastIndex = match.index + matched.length
            count += 1
          }

          match = base64regex.exec(text)
        }

        // 如果没有任何匹配，跳过此节点。
        if (parts.length === 0) {
          continue
        }

        // 保留末尾的普通文本。
        if (lastIndex < text.length) {
          parts.push(text.slice(lastIndex))
        }

        // 构建 DocumentFragment 替换原文本节点。
        const fragment = document.createDocumentFragment()

        for (const part of parts) {
          if (typeof part === 'string') {
            fragment.append(document.createTextNode(part))
          }
          else {
            fragment.append(document.createTextNode(part.original))

            const span = document.createElement('span')
            span.className = 'v2p-decode-block'

            const ins = document.createElement('ins')
            ins.className = 'v2p-decode'
            ins.dataset.title = dataTitle
            ins.textContent = part.decoded

            span.append('(', ins, ')')
            fragment.append(span)
          }
        }

        textNode.parentNode?.replaceChild(fragment, textNode)
      }
    }

    $commentCells.find('.reply_content').each(contentHandler)

    $topicContentBox.find('.topic_content').each(contentHandler)

    if (count === 0) {
      createToast({ message: '本页未发现 Base64 字符串' })
    }
    else {
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
        House,
      },
    })
  }, 0)
}

/**
 * 将形如 [表情代码] 转换成表情图片的网络链接。
 */
export function transformEmoji(textValue: string) {
  return textValue.replace(/\[[^\]]+\]/g, (x) => {
    if (Object.hasOwn(emojiLinks, x)) {
      const emojiLink = emojiLinks[x as PopularEmoji].ld

      if (typeof emojiLink === 'string') {
        return `${emojiLink} `
      }
    }

    return x
  })
}

/**
 * 将用户标签数据转换为字符串。
 */
export function getTagsText(tags: Tag[]): string {
  return tags.join('，')
}

/**
 * 向页面 head 注入字体 CSS 链接（幂等，重复调用安全）。
 * 用于绕过 Chrome 扩展 content script CSS 中 @import 规则被静默忽略的限制。
 */
function ensureFontStylesheet(id: string, href: string) {
  if (!document.getElementById(id)) {
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
}

export function setFont(type: FontType) {
  if (type === 'system') {
    document.body.style.removeProperty('font-family')
  }
  else if (type === 'vivoSans') {
    document.body.style.setProperty('font-family', 'vivoSans, system-ui, sans-serif')
  }
  else if (type === 'notoSans') {
    ensureFontStylesheet(
      'v2p-font-noto-sans',
      'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400..900&display=swap',
    )
    document.body.style.setProperty('font-family', '\'Noto Sans SC\', system-ui, sans-serif')
  }
  else if (type === 'lxgwWenKai') {
    ensureFontStylesheet(
      'v2p-font-lxgw-wenkai',
      'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.1.0/style.css',
    )
    document.body.style.setProperty('font-family', '\'LXGW WenKai\', system-ui, sans-serif')
  }
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
 * 设置 options、popup 主题。
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
    const colorMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const perfersDark = colorMedia.matches

    if (perfersDark) {
      setTheme('dark-default')
    }
    else if (themeType === 'dark-default') {
      setTheme('light-default')
    }
    else {
      setTheme(themeType)
    }

    colorMedia.addEventListener('change', ({ matches }) => {
      if (matches) {
        setTheme('dark-default')
      }
      else if (themeType === 'dark-default') {
        setTheme('light-default')
      }
      else {
        setTheme(themeType)
      }
    })
  }
  else {
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
      void fetch(toggleThemeUrl)
    }

    // 同时修改切换按钮。
    if (prefersDark) {
      $toggle.prop('title', '使用浅色主题')
      $toggle.html('<i data-lucide="sun"></i>')
    }
    else {
      $toggle.prop('title', '使用深色主题')
      $toggle.html('<i data-lucide="moon"></i>')
    }
  }

  if (prefersDark) {
    setTheme('dark-default')
    $wrapper.addClass('Night')
  }
  else {
    setTheme(themeType)
    $wrapper.removeClass('Night')
  }

  loadIcons()
}

/**
 * 将低清表情图片转换成高清表情图片。
 */
export function replaceEmojiWithHD($emojiImgs: JQuery) {
  if ($emojiImgs.length > 0) {
    $emojiImgs.each((_, img) => {
      const $img = $(img)

      const src = $img.attr('src')

      if (typeof src === 'string') {
        const hd = emojiSrcMap.get(src)

        if (typeof hd === 'string') {
          $img.attr('src', hd)
          $img.css({
            width: 'var(--v2p-emoji-size)',
            height: 'var(--v2p-emoji-size)',
          })
        }
      }
    })
  }
}

/**
 * 处理评论中的表情图片，将其转换为高清表情图片。
 */
export function replaceCommentEmojiWithHD($cells: JQuery = $commentCells) {
  const $embedImages = $cells.find('.reply_content .embedded_image, .payload .embedded_image')

  if ($embedImages.length > 0) {
    replaceEmojiWithHD($embedImages)
  }
}

/**
 * 打开 V2EX Polish 的设置页面。
 *
 * 通过消息通道委托 background 打开，避免在 content script 里直接 `window.open`
 * 一个 `chrome-extension://` URL 被 Chrome 当作不可信导航屏蔽。
 */
export function openV2PSettings() {
  void chrome.runtime.sendMessage({ [MessageKey.showOptions]: true })
}

/**
 * 计算用户注册时间。
 *
 * @param created - 用户注册时间, 单位为秒。
 */
export function getRegisterDays(created: number): number {
  const registerDays = Math.ceil((Date.now() / 1000 - created) / (60 * 60 * 24))

  return registerDays
}

/**
 * 将 YYYY-MM-DD 格式的日期转换为时间戳, 单位为秒。
 */
export function getTimestampFromDateString(dateString: string): number {
  return Math.floor(Date.parse(dateString) / 1000)
}

/**
 * 从用户页面 HTML 中提取 Block 按钮的 URL。
 *
 * @param htmlText - 用户页面的 HTML 文本
 * @returns Block URL，格式如 "/block/622504?once=96942"；如果未找到则返回 null
 */

export function extractBlockUrl(htmlText: string): string | null {
  try {
    // 方法1: 使用 jQuery 解析 DOM（最稳定）
    const $page = $(htmlText)
    const $blockBtn = $page.find('input[type="button"][value="Block"]')

    if ($blockBtn.length > 0) {
      const onclick = $blockBtn.attr('onclick')

      if (onclick) {
        // 从 onclick 属性中提取 URL
        // 格式: location.href = '/block/622504?once=96942'
        const match = onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/)

        if (match && match[1]) {
          return match[1]
        }
      }
    }

    // 方法2: 使用正则表达式作为备用方案（处理 DOM 解析失败的情况）
    const regexPattern = /<input[^>]*type="button"[^>]*value="Block"[^>]*onclick="[^"]*location\.href\s*=\s*'([^']+)'[^"]*"/
    const regexMatch = htmlText.match(regexPattern)

    if (regexMatch && regexMatch[1]) {
      return regexMatch[1]
    }

    return null
  }
  catch (error) {
    console.error('提取 Block URL 失败:', error)

    return null
  }
}
