import { createButton } from './button'

interface ModelElements {
  $mask: JQuery
  $main: JQuery
  $container: JQuery
  $title: JQuery
  $actions: JQuery
  $content: JQuery
}

interface ModelHandler extends ModelElements {
  open: () => void
  close: () => void
}

interface CreateModelProps {
  root?: JQuery
  title?: string
  onMount?: (elements: ModelElements) => void
  onOpen?: (elements: ModelElements) => void
  onClose?: (elements: ModelElements) => void
}

/**
 * 创建 model 框。
 */
export function createModel(props: CreateModelProps): ModelHandler {
  const { root, title, onOpen, onClose, onMount } = props

  const $mask = $('<div class="v2p-model-mask">')

  const $content = $('<div class="v2p-model-content">')

  const $closeBtn = createButton({
    children: '关闭<kbd>Esc</kbd>',
    className: 'v2p-model-close-btn',
  })

  const $title = $(`<div class="v2p-model-title">${title ?? ''}</div>`)

  const $actions = $('<div class="v2p-model-actions">').append($closeBtn)

  const $header = $('<div class="v2p-model-header">').append($title, $actions)

  const $main = $('<div class="v2p-model-main">').append($header, $content)

  const $container = $mask.append($main).hide()

  const modelElements = {
    $mask,
    $main,
    $container,
    $title,
    $actions,
    $content,
  }

  // 用于判定是否已经绑定了事件, 避免重复绑定。
  let boundEvent = false

  const docClickHandler = (ev: JQuery.ClickEvent) => {
    // 通过判定点击的元素是否在评论框内来判断是否关闭评论框。
    if ($(ev.target).closest($main).length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleModalClose()
    }
  }

  const keyupHandler = (ev: JQuery.KeyDownEvent) => {
    if (ev.key === 'Escape') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleModalClose()
    }
  }

  const handleModalClose = () => {
    $(document).off('click', docClickHandler)
    $(document).off('keydown', keyupHandler)
    boundEvent = false

    $container.fadeOut('fast')
    document.body.classList.remove('v2p-modal-open')

    onClose?.(modelElements)
  }

  const handleModalOpen = () => {
    setTimeout(() => {
      // Hack: 为了防止 open 点击事件提前冒泡到 document 上，需要延迟绑定事件。
      if (!boundEvent) {
        $(document).on('click', docClickHandler)
        $(document).on('keydown', keyupHandler)
        boundEvent = true
      }
    })

    $container.fadeIn('fast')
    document.body.classList.add('v2p-modal-open')

    onOpen?.(modelElements)
  }

  $closeBtn.on('click', handleModalClose)

  onMount?.(modelElements)

  if (root) {
    root.append($container)
  }

  return { ...modelElements, open: handleModalOpen, close: handleModalClose }
}
