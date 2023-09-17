import { createPopup } from '../../components/popup'
import { createToast } from '../../components/toast'
import { StorageKey } from '../../constants'
import { getStorage } from '../../utils'
import { $commentTableRows, $replyBox, $replyTextArea } from '../globals'
import {
  addToReadingList,
  decodeBase64TopicPage,
  focusReplyInput,
  insertTextToReplyInput,
  loadIcons,
} from '../helpers'
import { handlingComments } from './comment'
import { handlingContent } from './content'
import { handlingPaging } from './paging'
import { handleReply } from './reply'

void (async () => {
  const storage = await getStorage()
  const options = storage[StorageKey.Options]

  if (options.openInNewTab) {
    $commentTableRows.find('> td:nth-child(3) > strong > a').prop('target', '_blank')
  }

  {
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

    {
      // 更多功能：

      const $moreTool = $tools.find('.v2p-tool-more')

      $moreTool

      const $toolContent = $(`
        <div class="v2p-reply-tool-content">
          <div class="v2p-reply-tool v2p-reply-tool-decode">解析本页 Base64</div>
          <div class="v2p-reply-tool v2p-reply-tool-encode">文本转 Base64</div>
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
        toolsPopup.close()

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

      const canHideRefName =
        options.nestedReply.display === 'indent' && !!options.replyContent.hideRefName

      if (canHideRefName) {
        let isHidden = options.replyContent.hideRefName

        const $toolToggleDisplay = $(
          '<div class="v2p-reply-tool v2p-reply-tool-decode">显示 @ 用户名</div>'
        )
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
    }

    $('#Rightbar > .box:has("#member-activity")').addClass('v2p-tool-box').append($tools)
    loadIcons()
  }

  // 按 Esc 隐藏回复框。
  {
    $(document).on('keydown', (ev) => {
      if (!ev.isDefaultPrevented()) {
        if (ev.key === 'Escape') {
          const $replyContent = $('#reply_content')

          if ($replyBox.hasClass('reply-box-sticky')) {
            $replyBox.removeClass('reply-box-sticky')
            $('#undock-button').css('display', 'none')
          }

          $replyContent.trigger('blur')
        }
      }
    })
  }

  handlingContent()

  // 如果是从相同的主题跳转过来的，且含有分页参数，则被认为是执行翻页操作，跳过正文内容直接滚动到评论区。
  if (document.referrer !== '') {
    if (document.referrer.includes(document.location.pathname)) {
      const url = new URL(document.location.href)
      const page = url.searchParams.get('p')
      if (page && page !== '1') {
        document.querySelector('.topic_buttons')?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  handlingPaging()
  await handlingComments()
  handleReply()

  loadIcons()
})()
