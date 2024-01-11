import {
  computePosition,
  type ComputePositionConfig,
  flip,
  offset,
  type OffsetOptions,
  type Placement,
  shift,
} from '@floating-ui/dom'

import { createToast } from './toast'

export const hoverDelay = 350

interface PopupElements {
  $content: JQuery
}

/** 用户信息弹出框控制。 */
export interface PopupControl extends PopupElements, Pick<CreatePopupProps, 'onClose'> {
  /** 鼠标是否悬浮在弹出框上。 */
  isOver: boolean
  /** 调用此方法在某个元素上打开弹出框。 */
  open: (reference?: JQuery) => void
  /** 调用此方法关闭弹出框。 */
  close: () => void
}

interface CreatePopupProps {
  /** 挂载在哪个节点下面 */
  root: JQuery
  /** 触发 Popup 的元素 */
  trigger?: JQuery
  /** 触发的方式 */
  triggerType?: 'click' | 'hover'
  /** Popup 内部的渲染元素 */
  content?: JQuery
  /** 计算定位方法的配置项 */
  options?: Partial<ComputePositionConfig>
  /** Popup 打开触发的回调 */
  onOpen?: () => void
  /** Popup 关闭时触发的回调 */
  onClose?: () => void

  placement?: Placement
  offsetOptions?: OffsetOptions
}

/**
 * 创建 Popup 框。
 */
export function createPopup(props: CreatePopupProps): PopupControl {
  const {
    root,
    trigger,
    triggerType = 'click',
    content,
    options,
    onOpen,
    onClose,
    placement = 'bottom-start',
    offsetOptions = { mainAxis: 5, crossAxis: 5 },
  } = props

  const $popupContent = $('<div class="v2p-popup-content">')
  const $popup = $('<div class="v2p-popup" tabindex="0">')
    .css('visibility', 'hidden')
    .append($popupContent)

  root.append($popup)

  if (content) {
    $popup.append(content)
  }

  const popup = $popup.get(0)!

  const handleClickOutside = (ev: JQuery.ClickEvent) => {
    if ($(ev.target).closest(popup).length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handlePopupClose()
    }
  }

  const handlePopupClose = () => {
    $popup.css('visibility', 'hidden')
    $(document).off('click', handleClickOutside)
    onClose?.()
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    popupControl.onClose?.()
  }

  const handlePopupOpen = ($reference?: JQuery) => {
    if (!$reference) {
      return
    }

    // 为了避免点击外部区域立即关闭 Popup，需要延迟绑定 document 的 click 事件。
    setTimeout(() => {
      $(document).on('click', handleClickOutside)
    })

    const referenceElement = $reference.get(0)!

    computePosition(referenceElement, popup, {
      placement,
      middleware: [offset(offsetOptions), flip(), shift({ padding: 8 })],
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
        createToast({ message: '❌ Popup 渲染失败' })
      })

    onOpen?.()
  }

  const popupControl: PopupControl = {
    $content: $popupContent,
    isOver: false,
    open: (reference) => {
      handlePopupOpen(reference)
    },
    close: handlePopupClose,
  }

  if (triggerType === 'hover') {
    $popup.on('mouseover', () => {
      if (!popupControl.isOver) {
        popupControl.isOver = true

        $popup.off('mouseleave').on('mouseleave', () => {
          popupControl.isOver = false
          setTimeout(() => {
            if (!popupControl.isOver) {
              popupControl.close()
            }
          }, hoverDelay)
        })
      }
    })
  }

  trigger?.on('click', () => {
    if (popup.style.visibility !== 'hidden') {
      handlePopupClose()
    } else {
      handlePopupOpen(trigger)
    }
  })

  return popupControl
}
