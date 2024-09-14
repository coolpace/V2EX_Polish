import { createPopup } from '../../components/popup'
import { createToast } from '../../components/toast'
import { Links, StorageKey } from '../../constants'
import { getStorageSync } from '../../utils'
import { $infoCard, $replyBox, $replyTextArea, topicId } from '../globals'
import {
  addToReadingList,
  decodeBase64TopicPage,
  focusReplyInput,
  insertTextToReplyInput,
  loadIcons,
} from '../helpers'
import { toggleTopicLayout } from './layout'

/**
 * 右侧用户信息卡片中的工具栏。
 */
export function handleTools() {
  const storage = getStorageSync()
  const options = storage[StorageKey.Options]

  const $tools = $(`
    <div class="cell v2p-tools">
      <span class="v2p-tool v2p-hover-btn v2p-tool-reply">
        <span class="v2p-tool-icon"><i data-lucide="message-square-plus"></i></span>回复主题
      </span>
      <span class="v2p-tool v2p-hover-btn v2p-tool-reading">
        <span class="v2p-tool-icon"><i data-lucide="book-open-check"></i></span>稍后阅读
      </span>
      <span class="v2p-tool v2p-hover-btn v2p-tool-scroll-top">
        <span class="v2p-tool-icon"><i data-lucide="chevrons-up"></i></span>回到顶部
      </span>
      <span class="v2p-tool v2p-hover-btn v2p-tool-more">
        <span class="v2p-tool-icon"><i data-lucide="package-plus"></i></span>更多功能
      </span>
    </div>
  `)

  $tools.find('.v2p-tool-reply').on('click', () => {
    $replyTextArea.trigger('focus')
  })

  $tools.find('.v2p-tool-reading').on('click', () => {
    void addToReadingList({
      url: window.location.href,
      title: document.title.replace(' - V2EX', ''),
      content: String($('head meta[property="og:description"]').prop('content')),
    })
  })

  $tools.find('.v2p-tool-scroll-top').on('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  // 更多功能：
  {
    const $moreTool = $tools.find('.v2p-tool-more')

    const $toolContent = $(`
      <div class="v2p-select-dropdown">
        <div class="v2p-select-item v2p-reply-tool-decode">解析本页 Base64</div>
        <div class="v2p-select-item v2p-reply-tool-encode">文本转 Base64</div>
        <div class="v2p-select-item v2p-reply-tool-share">生成分享图片</div>
      </div>
    `)

    const toolsPopup = createPopup({
      root: $replyBox,
      trigger: $moreTool,
      content: $toolContent,
      offsetOptions: { mainAxis: 5, crossAxis: -5 },
    })

    $toolContent.find('.v2p-reply-tool-decode').on('click', () => {
      decodeBase64TopicPage()
    })

    $toolContent.find('.v2p-reply-tool-encode').on('click', () => {
      focusReplyInput()

      setTimeout(() => {
        // 加入下次事件循环，避免阻塞 Popup 关闭。
        const inputText = window.prompt('输入要加密的字符串，完成后将填写到回复框中：')

        if (inputText) {
          let encodedText: string | undefined

          try {
            encodedText = window.btoa(encodeURIComponent(inputText))
          } catch (err) {
            const errorTip = '该文本无法编码为 Base64'
            console.error(err, `${errorTip}，可能的错误原因：文本包含中文。`)
            createToast({ message: errorTip })
          }

          if (encodedText) {
            insertTextToReplyInput(encodedText)
          }
        }
      })
    })

    $toolContent.find('.v2p-reply-tool-share').on('click', () => {
      if (topicId) {
        window.open(`${Links.Home}/share/${topicId}`, '_blank')
      }
    })

    const canHideRefName =
      options.nestedReply.display === 'indent' && !!options.replyContent.hideRefName

    if (canHideRefName) {
      let isHidden = options.replyContent.hideRefName

      const $toolToggleDisplay = $('<div class="v2p-select-item">显示 @ 用户名</div>')

      $toolToggleDisplay.on('click', () => {
        if (isHidden) {
          isHidden = false
          $toolToggleDisplay.text('隐藏 @ 用户名')
          $('.v2p-member-ref').addClass('v2p-member-ref-show')
        } else {
          isHidden = true
          $toolToggleDisplay.text('显示 @ 用户名')
          $('.v2p-member-ref').removeClass('v2p-member-ref-show')
        }
      })

      $toolContent.prepend($toolToggleDisplay)
    }

    const $toolToggleLayout = $(
      `
      <div class="v2p-select-item v2p-reply-tool-layout">
        ${options.reply.layout === 'horizontal' ? '切换为垂直布局' : '切换为水平布局'}
      </div>
      `
    )

    $toolToggleLayout.on('click', () => {
      toggleTopicLayout()
    })

    $toolContent.prepend($toolToggleLayout)

    $toolContent.find('.v2p-select-item').on('click', () => {
      toolsPopup.close()
    })
  }

  $infoCard.addClass('v2p-tool-box').append($tools)

  loadIcons()
}
