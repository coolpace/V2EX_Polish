import { $body } from '../contents/globals'
import { createButton } from './button'
import { createModal } from './modal'

/** 图片变换状态 */
interface TransformState {
  scale: number
  translateX: number
  translateY: number
}

/** 拖拽状态 */
interface DragState {
  isDragging: boolean
  startX: number
  startY: number
  startTranslateX: number
  startTranslateY: number
}

/** 缩放配置 */
interface ZoomConfig {
  step: number
  min: number
  max: number
}

const DEFAULT_ZOOM_CONFIG: ZoomConfig = {
  step: 0.5,
  min: 0.5,
  max: 3,
}

/**
 * 图片变换控制器
 * 负责管理图片的缩放和拖拽状态
 */
class ImageTransformController {
  private $img: JQuery
  private transform: TransformState
  private drag: DragState
  private config: ZoomConfig

  constructor($img: JQuery, config: ZoomConfig = DEFAULT_ZOOM_CONFIG) {
    this.$img = $img
    this.config = config
    this.transform = { scale: 1, translateX: 0, translateY: 0 }
    this.drag = {
      isDragging: false,
      startX: 0,
      startY: 0,
      startTranslateX: 0,
      startTranslateY: 0,
    }
  }

  /** 应用变换到图片 */
  applyTransform(smooth = true): void {
    const { scale, translateX, translateY } = this.transform

    this.$img.css({
      transition: smooth ? 'transform 0.2s ease' : 'none',
      transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
    })
  }

  /** 重置变换状态 */
  reset(): void {
    this.transform = { scale: 1, translateX: 0, translateY: 0 }
    this.applyTransform()
  }

  /** 放大 */
  zoomIn(): void {
    if (this.transform.scale < this.config.max) {
      this.transform.scale += this.config.step
      this.applyTransform()
    }
  }

  /** 缩小 */
  zoomOut(): void {
    if (this.transform.scale > this.config.min) {
      this.transform.scale -= this.config.step
      this.resetTranslateIfNeeded()
      this.applyTransform()
    }
  }

  /** 通过滚轮缩放 */
  zoomByWheel(deltaY: number): void {
    const direction = deltaY > 0 ? -1 : 1
    const nextScale = this.transform.scale + direction * this.config.step

    this.transform.scale = Math.max(this.config.min, Math.min(this.config.max, nextScale))
    this.resetTranslateIfNeeded()
    this.applyTransform()
  }

  /** 开始拖拽 */
  startDrag(clientX: number, clientY: number): boolean {
    if (this.transform.scale <= 1) {
      return false
    }

    this.drag = {
      isDragging: true,
      startX: clientX,
      startY: clientY,
      startTranslateX: this.transform.translateX,
      startTranslateY: this.transform.translateY,
    }

    this.$img.css({ cursor: 'grabbing' })

    return true
  }

  /** 更新拖拽位置 */
  updateDrag(clientX: number, clientY: number): void {
    if (!this.drag.isDragging) {
      return
    }

    const deltaX = clientX - this.drag.startX
    const deltaY = clientY - this.drag.startY

    // 除以 scale 使拖拽距离与视觉效果一致
    this.transform.translateX = this.drag.startTranslateX + deltaX / this.transform.scale
    this.transform.translateY = this.drag.startTranslateY + deltaY / this.transform.scale

    this.applyTransform(false)
  }

  /** 结束拖拽 */
  endDrag(): void {
    if (this.drag.isDragging) {
      this.drag.isDragging = false
      this.$img.css({ cursor: 'grab' })
    }
  }

  /** 是否正在拖拽 */
  isDragging(): boolean {
    return this.drag.isDragging
  }

  /** 缩小到原始尺寸时重置位移 */
  private resetTranslateIfNeeded(): void {
    if (this.transform.scale <= 1) {
      this.transform.translateX = 0
      this.transform.translateY = 0
    }
  }
}

/** 创建控制栏 */
function createControlBar(controller: ImageTransformController): JQuery {
  const $controls = $('<div class="v2p-img-preview-controls">').css({
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    zIndex: 1001,
    pointerEvents: 'auto',
    padding: '6px 10px',
    background: 'var(--v2p-color-bg-widget)',
    border: '1px solid var(--v2p-color-border)',
    borderRadius: '8px',
    boxShadow: 'var(--v2p-widget-shadow)',
    backdropFilter: 'blur(12px)',
  })

  const $zoomInBtn = createButton({ children: '放大', size: 'small', variant: 'special' })
  const $zoomOutBtn = createButton({ children: '缩小', size: 'small', variant: 'special' })
  const $resetBtn = createButton({ children: '复位', size: 'small' })

  $zoomInBtn.on('click', (e) => {
    e.stopPropagation()
    controller.zoomIn()
  })

  $zoomOutBtn.on('click', (e) => {
    e.stopPropagation()
    controller.zoomOut()
  })

  $resetBtn.on('click', (e) => {
    e.stopPropagation()
    controller.reset()
  })

  $controls.append($zoomInBtn, $zoomOutBtn, $resetBtn)

  return $controls
}

/** 为预览图片绑定事件 */
function bindPreviewEvents(
  $img: JQuery,
  controller: ImageTransformController,
): () => void {
  // 鼠标按下开始拖拽
  $img.on('mousedown', (e) => {
    if (controller.startDrag(e.clientX, e.clientY)) {
      e.preventDefault()
      e.stopPropagation()
    }
  })

  // 鼠标移动更新位移
  $(document).on('mousemove.imgPreview', (e) => {
    if (controller.isDragging()) {
      e.preventDefault()
      controller.updateDrag(e.clientX, e.clientY)
    }
  })

  // 鼠标松开结束拖拽
  $(document).on('mouseup.imgPreview', () => {
    controller.endDrag()
  })

  // 双击复位
  $img.on('dblclick', (e) => {
    e.stopPropagation()
    controller.reset()
  })

  // 滚轮缩放
  $img.on('wheel', (e) => {
    e.preventDefault()
    e.stopPropagation()

    const deltaY = e.originalEvent instanceof WheelEvent ? e.originalEvent.deltaY : 0
    controller.zoomByWheel(deltaY)
  })

  return () => {
    $(document).off('mousemove.imgPreview')
    $(document).off('mouseup.imgPreview')
  }
}

/** 创建预览图片元素 */
function createPreviewImage($sourceImg: JQuery): JQuery {
  return $sourceImg.clone().css({
    cursor: 'grab',
    pointerEvents: 'auto',
    transition: 'transform 0.2s ease',
    display: 'block',
    margin: '0 auto',
    transform: 'scale(1) translate(0px, 0px)',
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain',
    userSelect: 'none',
    boxShadow: 'var(--v2p-widget-shadow)',
  }).attr('draggable', 'false')
}

interface ImagePreviewControl {
  /** 打开图片预览 */
  open: ($img: JQuery) => void
  /** 关闭图片预览 */
  close: () => void
}

/**
 * 创建图片预览组件
 */
export function createImagePreview(): ImagePreviewControl {
  let cleanupFn: (() => void) | null = null
  let modal: ReturnType<typeof createModal> | null = null

  const getModal = () => {
    if (!modal) {
      modal = createModal({
        root: $body,
        onMount: ({ $main, $header, $content }) => {
          $main.css({
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            pointerEvents: 'none',
            border: 'none',
          })
          $header.remove()
          $content.css({
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'auto',
          })
        },
        onOpen: ({ $content }) => {
          $content.empty()
        },
        onClose: ({ $content }) => {
          $content.empty()
          cleanupFn?.()
          cleanupFn = null
        },
      })

      // 点击背景关闭预览
      modal.$content.on('click', (ev) => {
        if (ev.target === modal!.$content.get(0)) {
          modal!.close()
        }
      })
    }

    return modal
  }

  const open = ($sourceImg: JQuery): void => {
    const m = getModal()
    const $previewImg = createPreviewImage($sourceImg)
    const controller = new ImageTransformController($previewImg)
    const $controls = createControlBar(controller)

    cleanupFn = bindPreviewEvents($previewImg, controller)

    m.open()
    m.$content.append($previewImg, $controls)
  }

  const close = (): void => {
    modal?.close()
  }

  return {
    open,
    close,
  }
}
