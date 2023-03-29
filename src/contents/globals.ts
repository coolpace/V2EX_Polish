import type { CommentData } from '../types'

/** 登录人的昵称 */
export const loginName = $('#Top .tools > a[href^="/member"]').text()

/** 发帖人的昵称 */
export const topicOwnerName = $('#Main > .box > .header > small > a[href^="/member"]').text()

export const $topicList = $('#Main #Tabs ~ .cell.item')

/** 主题内容区 */
export const $topicContentBox = $('#Main .box:has(.topic_content)')

/** 主题下的评论区 */
export const $commentBox = $('#Main .box:has(.cell[id^="r_"])')

/** 评论区的回复 */
export const $commentCells = $commentBox.find('.cell[id^="r_"]')

export const $commentTableRows = $commentCells.find('> table > tbody > tr')

/** 每一页的回复列表数据 */
export const commentDataList: CommentData[] = $commentTableRows
  .map((idx, tr) => {
    const id = $commentCells[idx].id
    const td = $(tr).find('> td:nth-child(3)')
    const member = td.find('> strong > a')
    const memberName = member.text()
    const memberLink = member.prop('href')
    const content = td.find('> .reply_content').text()
    const likes = Number(td.find('span.small').text())
    const floor = td.find('span.no').text()

    const memberNameMatches = Array.from(content.matchAll(/@([a-zA-Z0-9]+)/g))
    const refMemberNames =
      memberNameMatches.length > 0
        ? memberNameMatches.map(([, name]) => {
            return name
          })
        : undefined

    const floorNumberMatches = Array.from(content.matchAll(/#(\d+)/g))
    const refFloors =
      floorNumberMatches.length > 0
        ? floorNumberMatches.map(([, floor]) => {
            return floor
          })
        : undefined

    return {
      /** HTML 元素上的 id */
      id,
      /** 回复者昵称 */
      memberName,
      /** 回复者主页链接 */
      memberLink,
      /** 回复内容 */
      content,
      /** 该回复被感谢的次数 */
      likes,
      /** 楼层数 */
      floor,
      /** 遍历索引值 */
      index: idx,
      /** 回复中 @ 别人 */
      refMemberNames,
      /** 回复中 # 楼层 */
      refFloors,
    }
  })
  .get()

export function createButton(props: {
  children: string
  className?: string
  type?: 'button' | 'submit'
  tag?: 'button' | 'a'
}) {
  const { children, className = '', type = 'button', tag = 'button' } = props

  const $button = $(`<${tag} class="normal button ${className}">${children}</${tag}>`)

  if (tag === 'button') {
    $button.prop('type', type)
  }

  return $button
}

interface ModelElements {
  $mask: JQuery
  $main: JQuery
  $container: JQuery
  $title: JQuery
  $actions: JQuery
  $content: JQuery
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
export function createModel(props: CreateModelProps) {
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
      // 为了防止 open 点击事件提前冒泡到 document 上，需要延迟绑定事件。
      if (!boundEvent) {
        $(document).on('click', docClickHandler)
        $(document).on('keydown', keyupHandler)
        boundEvent = true
      }
    }, 0)

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
