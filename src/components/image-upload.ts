import { uploadImage } from '../services'

interface ImageUploadProps {
  $wrapper: JQuery
  $input?: JQuery
  /** 向文本输入框中插入占位文本。 */
  insertText: (text: string) => void
  /** 替换占位文本，当 replace 为非空字符串时，表示图片上传成功，参数值为图片链接。 */
  replaceText: (find: string, replace: string) => void
}

const uploadTip = '选择、粘贴、拖放上传图片。'

interface ImageUploadControl {
  uploadBar: JQuery
}

export function bindImageUpload(props: ImageUploadProps): ImageUploadControl {
  const { $wrapper, $input, insertText, replaceText } = props

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
    if (!(ev instanceof ClipboardEvent)) {
      return
    }

    if ($input && !$input.get(0)?.matches(':focus')) {
      return
    }

    const items = ev.clipboardData?.items

    if (!items) {
      return
    }

    // 查找属于图像类型的数据项。
    const imageItem = Array.from(items).find((item) => item.type.includes('image'))

    if (imageItem) {
      const file = imageItem.getAsFile()

      if (file) {
        handleUploadImage(file)
      }
    }
  })

  $wrapper.get(0)?.addEventListener('drop', (ev) => {
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

  $wrapper.append($uploadBar)

  return {
    uploadBar: $uploadBar,
  }
}
