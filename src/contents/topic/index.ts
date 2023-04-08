import { iconReply, iconScrollTop, iconTool } from '../../icons'
import { uploadReplyImg } from '../../services'
import { createPopup } from '../components/popup'
import { $commentTableRows, $replyBox, replyTextArea } from '../globals'
import { handlingComments, insertTextToReplyInput } from './comment'
import { handlingContent } from './content'
import { handlingPaging } from './paging'

{
  $commentTableRows
    .find('> td:nth-child(3) > strong > a')
    .prop('target', '_blank')
    .prop('rel', 'noopener noreferrer')
}

{
  const $tools = $(`
    <div class="cell v2p-tools">
      <span class="v2p-tool v2p-hover-btn v2p-tool-reply">
        <span class="v2p-tool-icon">${iconReply}</span>回复主题
      </span>
      <span class="v2p-tool v2p-hover-btn v2p-tool-scroll-top">
        <span class="v2p-tool-icon">${iconScrollTop}</span>回到顶部
      </span>
    </div>
  `)

  $tools.find('.v2p-tool-reply').on('click', () => {
    $replyBox.find('#reply_content').trigger('focus')
  })

  $tools.find('.v2p-tool-scroll-top').on('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  $('#Rightbar > .box:has("#member-activity")').addClass('v2p-tool-box').append($tools)
}

{
  // 按 Esc 隐藏回复框。
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

{
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
}

handlingComments()
handlingPaging()

{
  const $more = $(`
  <div class="v2p-reply-tools-box v2p-hover-btn">
    <span class="v2p-reply-tools-icon">${iconTool}</span>
    工具箱
  </div>
  `)

  const $toolContent = $(`
  <div class="v2p-reply-tool-content">
    <div class="v2p-reply-tool v2p-reply-tool-encode">文字转 Base64</div>
    <div class="v2p-reply-tool v2p-reply-tool-img">上传图片</div>
  </div>
  `)

  const handler = createPopup({
    root: $replyBox,
    children: $more,
    content: $toolContent,
  })

  const focusReplyInput = () => {
    if (replyTextArea instanceof HTMLTextAreaElement) {
      replyTextArea.focus()
    }
  }

  $toolContent.find('.v2p-reply-tool-encode').on('click', () => {
    focusReplyInput()
    handler.close()

    setTimeout(() => {
      // 加入下次事件循环，避免阻塞 Popup 关闭。
      const inputText = window.prompt('输入要加密的字符串，完成后将填写到回复框中：')

      if (inputText) {
        const encodedText = window.btoa(inputText)
        insertTextToReplyInput(encodedText)
      }
    })
  })

  $toolContent.find('.v2p-reply-tool-img').on('click', () => {
    focusReplyInput()
    handler.close()

    const imgInput = document.createElement('input')

    imgInput.style.display = 'none'
    imgInput.type = 'file'
    imgInput.accept = 'image/*'

    imgInput.addEventListener('change', () => {
      const selectedFile = imgInput.files?.[0]

      if (selectedFile) {
        document.body.style.cursor = 'wait'

        uploadReplyImg(selectedFile)
          .then((imgLink) => {
            insertTextToReplyInput(imgLink)
          })
          .catch(() => {
            window.alert('上传图片失败')
          })
          .finally(() => {
            document.body.style.cursor = ''
          })
      }
    })

    imgInput.click()
  })

  $replyBox.find('> .flex-row-end').prepend($more)
}
