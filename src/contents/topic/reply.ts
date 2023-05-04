import { createButton } from '../../components/button'
import { createPopup } from '../../components/popup'
import { emoticons } from '../../constants'
import { iconEmoji, iconTool } from '../../icons'
import { uploadImage } from '../../services'
import { getOS } from '../../utils'
import { $replyBox, $replyForm, replyTextArea } from '../globals'
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

    const $emojiBtn = createButton({ children: iconEmoji }).insertAfter($replyBtn)

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
  const $tools = $(`
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
        const encodedText = window.btoa(inputText)
        insertTextToReplyInput(encodedText)
      }
    })
  })

  const uploadTip = '选择、粘贴、拖放上传图片。'

  const $uploadBar = $(`<div class="v2p-reply-upload-bar">${uploadTip}</div>`)

  const handleUploadImage = (file: File) => {
    $uploadBar.addClass('v2p-reply-upload-bar-disabled').text('正在上传图片...')

    uploadImage(file)
      .then((imgLink) => {
        insertTextToReplyInput(imgLink)
      })
      .catch(() => {
        window.alert('上传图片失败')
      })
      .finally(() => {
        $uploadBar.removeClass('v2p-reply-upload-bar-disabled').text(uploadTip)
      })
  }

  const handleClickUploadImage = () => {
    focusReplyInput()
    toolsPopup.close()

    const imgInput = document.createElement('input')

    imgInput.style.display = 'none'
    imgInput.type = 'file'
    imgInput.accept = 'image/*'

    imgInput.addEventListener('change', () => {
      const selectedFile = imgInput.files?.[0]

      if (selectedFile) {
        handleUploadImage(selectedFile)
      }
    })

    imgInput.click()
  }

  $toolContent.find('.v2p-reply-tool-img').on('click', () => {
    handleClickUploadImage()
  })

  $replyBox.find('> .flex-row-end').prepend($tools)

  // 粘贴图片并上传的功能。
  document.addEventListener('paste', (ev) => {
    if (!(ev instanceof ClipboardEvent) || !replyTextArea?.matches(':focus')) {
      return
    }

    const items = ev.clipboardData?.items

    if (!items) {
      return
    }

    // 查找图像类型的数据项
    const imageItem = Array.from(items).find((item) => item.type.includes('image'))

    if (imageItem) {
      const file = imageItem.getAsFile()

      if (file) {
        handleUploadImage(file)
      }
    }
  })

  replyTextArea?.addEventListener('drop', (ev) => {
    ev.preventDefault()

    if (!(ev instanceof DragEvent)) {
      return
    }

    const file = ev.dataTransfer?.files[0]

    if (file) {
      handleUploadImage(file)
    }
  })

  $('#reply_content')
    .wrap('<div class="v2p-reply-wrap">')
    .attr('placeholder', '留下对他人有帮助的回复')

  $('.flex-one-row:last-of-type > .gray').text('')

  $uploadBar.on('click', () => {
    if (!$uploadBar.hasClass('v2p-reply-upload-bar-disabled')) {
      handleClickUploadImage()
    }
  })

  $('.v2p-reply-wrap').append($uploadBar)

  handlingReplyActions()
}
