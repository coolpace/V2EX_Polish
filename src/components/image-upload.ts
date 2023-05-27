import { uploadImage } from '../services'

interface ImageUploadProps {
  $el: JQuery
  insertText: (text: string) => void // 插入文本的实现
  replaceText: (find: string, replace: string) => void // 替换文本的实现，当 replace 为非空字符串时，表示图片上传成功，参数值为图片链接。
}

const uploadTip = '选择、粘贴、拖放上传图片。'

export function bindImageUpload(props: ImageUploadProps) {
  const { $el, insertText, replaceText } = props
  const $uploadBar = $(`<div class="v2p-reply-upload-bar">${uploadTip}</div>`)

  const handleUploadImage = (file: File) => {
    const placeholder = '[上传图片中...]'
    insertText(` ${placeholder} `)
    $uploadBar.addClass('v2p-reply-upload-bar-disabled').text('正在上传图片...')

    uploadImage(file)
      .then((imgLink) => {
        replaceText(placeholder, imgLink)
      })
      .catch(() => {
        replaceText(placeholder, '')

        window.alert('❌ 上传图片失败，请打开控制台查看原因')
      })
      .finally(() => {
        $uploadBar.removeClass('v2p-reply-upload-bar-disabled').text(uploadTip)
      })
  }

  const handleClickUploadImage = () => {
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

  // 粘贴图片并上传的功能。
  document.addEventListener('paste', (ev) => {
    if (!(ev instanceof ClipboardEvent) || !$el.get(0)?.matches(':focus')) {
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

  $el.get(0)?.addEventListener('drop', (ev) => {
    ev.preventDefault()

    if (!(ev instanceof DragEvent)) {
      return
    }

    const file = ev.dataTransfer?.files[0]

    if (file) {
      handleUploadImage(file)
    }
  })

  $('.flex-one-row:last-of-type > .gray').text('')

  $uploadBar.on('click', () => {
    if (!$uploadBar.hasClass('v2p-reply-upload-bar-disabled')) {
      handleClickUploadImage()
    }
  })

  $el.append($uploadBar)
}
