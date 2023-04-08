import { computePosition, flip, offset, shift } from '@floating-ui/dom'

interface PopupHandler {
  $trigger: JQuery
  close: () => void
}

interface CreatePopupProps {
  root: JQuery
  children: JQuery
  content?: JQuery
}

/**
 * 创建 Popup 框。
 */
export function createPopup(props: CreatePopupProps): PopupHandler {
  const { root, children, content } = props

  const $popup = $('<div class="v2p-popup">').css('visibility', 'hidden')

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
  }

  const popupHandler: PopupHandler = {
    $trigger: children,
    close: handlePopupClose,
  }

  popupHandler.$trigger.on('click', (ev) => {
    if (popup.style.visibility !== 'hidden') {
      handlePopupClose()
    } else {
      ev.stopPropagation()

      $(document).on('click', docClickHandler)

      computePosition(popupHandler.$trigger.get(0)!, popup, {
        placement: 'bottom-start',
        middleware: [offset({ mainAxis: 10, crossAxis: -4 }), flip(), shift({ padding: 8 })],
      })
        .then(({ x, y }) => {
          Object.assign(popup.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
          $popup.css('visibility', 'visible')
        })
        .catch((err) => {
          console.error('计算位置失败', err)
          handlePopupClose()
        })
    }
  })

  return popupHandler
}
