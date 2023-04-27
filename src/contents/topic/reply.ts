import { createPopup } from '../../components/popup'
import { iconTool } from '../../icons'
import { uploadImage } from '../../services'
import { $replyBox, replyTextArea } from '../globals'
import { focusReplyInput, insertTextToReplyInput } from '../helpers'

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

  {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault()
        console.log(123)
        $('#reply-box form[action^="/t"]').trigger('submit')
      }
    })
  }
}
