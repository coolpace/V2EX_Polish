import type { CommentData } from '../types'

/** 登录人的昵称 */
export const loginName = $('#Top .tools > a[href^="/member"]').text()

/** 发帖人的昵称 */
export const topicOwnerName = $('#Main > .box:nth-child(1) > .header > small > a').text()

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

interface JQElements {
  $modelMask: JQuery
  $modelMain: JQuery
  $modelContainer: JQuery
  $modelContent: JQuery
}

interface CreateModelProps {
  root?: JQuery
  title?: string
  onMount?: (elements: JQElements) => void
  onOpen?: (elements: JQElements) => void
  onClose?: (elements: JQElements) => void
}

/**
 * 创建 model 框。
 */
export function createModel(props: CreateModelProps) {
  const { root, title, onOpen, onClose, onMount } = props

  const $modelMask = $('<div class="v2p-model-mask">')

  const $modelContent = $('<div class="v2p-model-content">')

  const $modelMain = $(`
    <div class="v2p-model-main">
      <div class="v2p-model-header">
        <span>${title ?? ''}</span>
        <button class="v2p-model-close-btn normal button">关闭<kbd>Esc</kbd></button>
      </div>
    </div>
    `).append($modelContent)

  const $modelContainer = $modelMask.append($modelMain).hide()

  const JQElements = {
    $modelMask,
    $modelMain,
    $modelContainer,
    $modelContent,
  }

  // 用于判定是否已经绑定了事件, 避免重复绑定。
  let boundEvent = false

  const docClickHandler = (e: JQuery.ClickEvent) => {
    // 通过判定点击的元素是否在评论框内来判断是否关闭评论框。
    if ($(e.target).closest($modelContent).length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleModalClose()
    }
  }

  const keyupHandler = (e: JQuery.KeyDownEvent) => {
    if (e.key === 'Escape') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleModalClose()
    }
  }

  const handleModalClose = () => {
    $(document).off('click', docClickHandler)
    $(document).off('keydown', keyupHandler)
    boundEvent = false

    $modelContainer.fadeOut('fast')
    document.body.classList.remove('v2p-modal-open')

    onClose?.(JQElements)
  }

  const handleModalOpen = () => {
    if (!boundEvent) {
      $(document).on('click', docClickHandler)
      $(document).on('keydown', keyupHandler)
      boundEvent = true
    }

    $modelContainer.fadeIn('fast')
    document.body.classList.add('v2p-modal-open')

    onOpen?.(JQElements)
  }

  const $closeBtn = $modelContainer.find('.v2p-model-close-btn')
  $closeBtn.on('click', handleModalClose)

  onMount?.(JQElements)

  if (root) {
    root.append($modelContainer)
  }

  return { ...JQElements, open: handleModalOpen }
}
