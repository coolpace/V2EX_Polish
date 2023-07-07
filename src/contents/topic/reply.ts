import { createButton } from '../../components/button'
import { bindImageUpload } from '../../components/image-upload'
import { createPopup } from '../../components/popup'
import { createToast } from '../../components/toast'
import { emoticons } from '../../constants'
import { getOS } from '../../utils'
import { $replyBox, $replyForm, $replyTextArea } from '../globals'
import { focusReplyInput, insertTextToReplyInput } from '../helpers'

function handlingReplyActions() {
  const os = getOS()

  const replyBtnText = `回复<kbd>${os === 'macos' ? 'Cmd' : 'Ctrl'}+Enter</kbd>`

  const $replyBtn = createButton({
    children: replyBtnText,
    type: 'submit',
  }).replaceAll($replyBox.find('input[type="submit"]'))

  $replyForm.on('submit', () => {
    $replyBtn.text('提交回复中...').prop('disabled', true)

    setTimeout(() => {
      $replyBtn.html(replyBtnText).prop('disabled', false)
    }, 5000)
  })

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
      ev.preventDefault()
      $replyForm.trigger('submit')
    }
  })

  {
    // 添加表情插入功能。
    const emoticonGroup = $('<div class="v2p-emoji-group">')
    const emoticonList = $('<div class="v2p-emoji-list">')
    const emoticonSpan = $('<span class="v2p-emoji">')

    const groups = emoticons.map((emojiGroup) => {
      const group = emoticonGroup.clone()

      group.append(`<div class="v2p-emoji-title">${emojiGroup.title}</div>`)

      const list = emoticonList.clone().append(
        emojiGroup.list.map((emoji) => {
          const emoticon = emoticonSpan
            .clone()
            .text(emoji)
            .on('click', () => {
              insertTextToReplyInput(emoji)
            })
          return emoticon
        })
      )

      group.append(list)

      return group
    })

    const emoticonsBox = $('<div class="v2p-emoticons-box">').append(groups)

    const $emojiBtn = createButton({
      children: '<span style="width:18px; height:18px;"><i data-lucide="smile"></i></span>',
    }).insertAfter($replyBtn)

    const $emojiContent = $('<div class="v2p-emoji-container">')
      .append(emoticonsBox)
      .appendTo($replyBox)
      .on('click', () => {
        focusReplyInput()
      })

    const keyupHandler = (ev: JQuery.KeyDownEvent) => {
      if (ev.key === 'Escape') {
        ev.preventDefault()
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        emojiPopup.close()
      }
    }

    $emojiBtn.on('click', () => {
      focusReplyInput()
    })

    const emojiPopup = createPopup({
      root: $replyBox,
      trigger: $emojiBtn,
      content: $emojiContent,
      options: { placement: 'right-end' },
      onOpen: () => {
        $(document.body).on('keydown', keyupHandler) // 在 body 上监听，因为需要比关闭评论框的快捷键(Esc)先执行，否则会先关闭评论框。
      },
      onClose: () => {
        $(document.body).off('keydown', keyupHandler)
      },
    })
  }

  {
    // 给「取消回复框停靠」、「回到顶部」按钮添加样式。
    $replyBox
      .find('#undock-button, #undock-button + a')
      .addClass('v2p-hover-btn')
      .css('padding', '5px 4px')
  }
}

export function handleReply() {
  $replyTextArea.attr('placeholder', '留下对他人有帮助的回复').wrap('<div class="v2p-reply-wrap">')

  const { uploadBar } = bindImageUpload({
    $wrapper: $('.v2p-reply-wrap'),
    $input: $replyTextArea,
    insertText: (text: string) => {
      insertTextToReplyInput(text)
    },
    replaceText: (find: string, replace: string) => {
      const val = $replyTextArea.val()

      if (typeof val === 'string') {
        const newVal = val.replace(find, replace)
        $replyTextArea.val(newVal).trigger('focus')
      }
    },
  })

  const $tools = $(`
  <div class="v2p-reply-tools-box v2p-hover-btn">
    <span class="v2p-reply-tools-icon"><i data-lucide="package-plus"></i></span>
    工具箱
  </div>
  `)

  const $toolContent = $(`
  <div class="v2p-reply-tool-content">
    <div class="v2p-reply-tool v2p-reply-tool-encode">文字转 Base64</div>
    <div class="v2p-reply-tool v2p-reply-tool-img">上传图片</div>
  </div>
  `)

  const toolsPopup = createPopup({
    root: $replyBox,
    trigger: $tools,
    content: $toolContent,
    offsetOptions: { mainAxis: 5, crossAxis: -5 },
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
          if (typeof window.encodeURIComponent === 'undefined') {
            // 在 Firefox 扩展中找不到 window.encodeURIComponent，原因未知。
            encodedText = window.atob(inputText)
          } else {
            encodedText = window.btoa(window.encodeURIComponent(inputText))
          }
        } catch (err) {
          console.error(err, '可能的错误原因：文本包含中文。')
          createToast({ message: '该文本无法编码为 Base64' })
        }

        if (encodedText) {
          insertTextToReplyInput(encodedText)
        }
      }
    })
  })

  $toolContent.find('.v2p-reply-tool-img').on('click', () => {
    uploadBar.trigger('click')
  })

  $replyBox.find('> .flex-row-end').prepend($tools)

  // 移除原站的“请尽量让自己的回复能够对别人有帮助”。
  $('.flex-one-row:last-of-type > .gray').text('')

  handlingReplyActions()
}
