import { createButton } from './button'

interface ModalElements {
  $mask: JQuery
  $main: JQuery
  $header: JQuery
  $container: JQuery
  $title: JQuery
  $actions: JQuery
  $content: JQuery
}

interface ModalControl extends ModalElements {
  open: () => void
  close: () => void
}

interface CreateModalProps {
  root?: JQuery
  title?: string
  onMount?: (elements: ModalElements) => void
  onOpen?: (elements: ModalElements) => void
  onClose?: (elements: ModalElements) => void
}

/**
 * 创建 modal 框。
 */
export function createModal(props: CreateModalProps): ModalControl {
  const { root, title, onMount, onOpen, onClose } = props

  const $mask = $('<div class="v2p-modal-mask">')

  const $content = $('<div class="v2p-modal-content">')

  const $closeBtn = createButton({
    children: '关闭<kbd>Esc</kbd>',
    className: 'v2p-modal-close-btn',
  })

  const $title = $(`<div class="v2p-modal-title">${title ?? ''}</div>`)

  const $actions = $('<div class="v2p-modal-actions">').append($closeBtn)

  const $header = $('<div class="v2p-modal-header">').append($title, $actions)

  const $main = $('<div class="v2p-modal-main">')
    .append($header, $content)
    .on('click', (ev) => {
      ev.stopPropagation()
    })

  const $container = $mask.append($main).hide()

  const modalElements = {
    $mask,
    $main,
    $header,
    $container,
    $title,
    $actions,
    $content,
  }

  // 用于判定是否已经绑定了事件, 避免重复绑定。
  let boundEvent = false

  let mouseDownTarget: HTMLElement

  const mouseDownHandler = (ev: JQuery.MouseDownEvent) => {
    mouseDownTarget = ev.target
  }

  const mouseUpHandler = (ev: JQuery.MouseUpEvent) => {
    if (
      mouseDownTarget === $mask.get(0) &&
      ev.target === $mask.get(0) &&
      ev.currentTarget === ev.target
    ) {
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
    $mask.off('mousedown', mouseDownHandler)
    $mask.off('mouseup', mouseUpHandler)
    $(document).off('keydown', keyupHandler)
    boundEvent = false

    $container.fadeOut('fast')
    document.body.classList.remove('v2p-modal-open')

    onClose?.(modalElements)
  }

  const handleModalOpen = () => {
    // Hack: 为了防止 open 点击事件提前冒泡到 document 上，需要延迟绑定事件。
    setTimeout(() => {
      if (!boundEvent) {
        $mask.on('mousedown', mouseDownHandler)
        $mask.on('mouseup', mouseUpHandler)
        $(document).on('keydown', keyupHandler)
        boundEvent = true
      }
    })

    $container.fadeIn('fast')
    document.body.classList.add('v2p-modal-open')

    onOpen?.(modalElements)
  }

  $closeBtn.on('click', handleModalClose)

  onMount?.(modalElements)

  if (root) {
    root.append($container)
  }

  return { ...modalElements, open: handleModalOpen, close: handleModalClose }
}
