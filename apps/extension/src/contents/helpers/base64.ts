import { createToast } from '../../components/toast'
import { findBase64Candidates } from '../base64'

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
 * 解析主题内容页面内所有可能的 Base64 字符串。
 */
export function decodeBase64TopicPage() {
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
        // 跳过链接、图片以及已经解析过的内容，避免重复处理。
        if (textNode.parentElement?.closest('a, img, .v2p-decode-block')) {
          continue
        }

        const text = textNode.textContent ?? ''
        const candidates = findBase64Candidates(text)

        if (candidates.length === 0) {
          continue
        }

        const parts: (string | { original: string, decoded: string })[] = []
        let lastIndex = 0

        for (const candidate of candidates) {
          if (candidate.index < lastIndex) {
            continue
          }

          // 保留候选前的普通文本。
          if (candidate.index > lastIndex) {
            parts.push(text.slice(lastIndex, candidate.index))
          }

          parts.push({
            original: candidate.original,
            decoded: candidate.decoded,
          })

          lastIndex = candidate.index + candidate.original.length
          count += 1
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
