import { computePosition, type ComputePositionConfig, flip, offset, shift } from '@floating-ui/dom'

import { createToast } from './toast'

interface PopupHandler {
  $trigger: JQuery
  close: () => void
}

interface CreatePopupProps {
  root: JQuery
  children: JQuery
  content?: JQuery
  options?: Partial<ComputePositionConfig>
  onOpen?: () => void
  onClose?: () => void
}

/**
 * 创建 Popup 框。
 */
export function createPopup(props: CreatePopupProps): PopupHandler {
  const { root, children, content, options, onOpen, onClose } = props

  const $popup = $('<div class="v2p-popup" tabindex="0">').css('visibility', 'hidden')

  root.append($popup)

  if (content) {
    $popup.append(content)
  }

  const popup = $popup.get(0)!

  const docClickHandler = (ev: JQuery.ClickEvent) => {
    if ($(ev.target).closest(popup).length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handlePopupClose()
    }
  }

  const handlePopupClose = () => {
    $popup.css('visibility', 'hidden')
    $(document).off('click', docClickHandler)
    onClose?.()
  }

  const popupHandler: PopupHandler = {
    $trigger: children,
    close: handlePopupClose,
  }

  popupHandler.$trigger.on('click', () => {
    if (popup.style.visibility !== 'hidden') {
      handlePopupClose()
    } else {
      // 为了避免点击外部区域立即关闭 Popup，需要延迟绑定 document 的 click 事件。
      setTimeout(() => {
        $(document).on('click', docClickHandler)
      })

      computePosition(popupHandler.$trigger.get(0)!, popup, {
        placement: 'bottom-start',
        middleware: [offset({ mainAxis: 10, crossAxis: -4 }), flip(), shift({ padding: 8 })],
        ...options,
      })
        .then(({ x, y }) => {
          Object.assign(popup.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
          $popup.css('visibility', 'visible')
        })
        .catch(() => {
          handlePopupClose()
          createToast({ message: 'Popup 渲染失败' })
        })

      onOpen?.()
    }
  })

  return popupHandler
}
