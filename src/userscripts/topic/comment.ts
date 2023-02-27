import { computePosition, flip, offset, shift } from '@floating-ui/dom'

import {
  $commentBox,
  $commentCells,
  $commentTableRows,
  $topicContentBox,
  commentDataList,
  getOS,
} from '../globals'
import {
  iconEmoji,
  iconHeart,
  iconHide,
  iconIgnore,
  iconLove,
  iconReply,
  iconStar,
  iconTwitter,
} from '../icons'

/**
 * 设置热门回复。
 */
function handlingPopularComments() {
  $topicContentBox.find('.topic_content a[href]').prop('target', '_blank')

  const popularCommentData = commentDataList
    .filter(({ likes }) => likes > 0)
    .sort((a, b) => b.likes - a.likes)

  if (
    popularCommentData.length > 4 ||
    (popularCommentData.length > 0 && popularCommentData.every(({ likes }) => likes >= 4))
  ) {
    const cmMask = $('<div class="v2p-cm-mask">')
    const cmContent = $(`
      <div class="v2p-cm-content box">
        <div class="v2p-cm-bar">
          <span>本页共有 ${popularCommentData.length} 条热门回复</span>
          <button class="v2p-cm-close-btn normal button">关闭<kbd>Esc</kbd></button>
        </div>
      </div>
    `)
    const cmContainer = cmMask.append(cmContent).hide()

    {
      const commentBoxCount = $commentBox.find('.cell:first-of-type > span.gray')
      const countText = commentBoxCount.text()
      const newCountText = countText.substring(0, countText.indexOf('回复') + 2)
      const countTextSpan = `<span class="count-text">${newCountText}</span><span class="v2p-dot">·</span>`

      let boundEvent = false

      const docClickHandler = (e: JQuery.ClickEvent) => {
        if ($(e.target).closest(cmContent).length === 0) {
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

        cmContainer.fadeOut('fast')
        document.body.classList.remove('modal-open')
      }

      const handleModalOpen = () => {
        if (!boundEvent) {
          $(document).on('click', docClickHandler)
          $(document).on('keydown', keyupHandler)
          boundEvent = true
        }

        cmContainer.fadeIn('fast')
        document.body.classList.add('modal-open')
      }

      const closeBtn = cmContainer.find('.v2p-cm-close-btn')
      closeBtn.on('click', handleModalClose)

      const popularBtn = $(
        `<span class="v2p-popular-btn v2p-hover-btn"><span class="v2p-icon-heart">${iconHeart}</span>查看本页感谢回复</span>`
      )
      popularBtn.on('click', (e) => {
        e.stopPropagation()
        handleModalOpen()
      })

      commentBoxCount.empty().append(countTextSpan).append(popularBtn)
    }

    const templete = $('<templete></templete>')

    popularCommentData.forEach(({ index }) => {
      templete.append($commentCells.eq(index).clone())
    })

    cmContent.append(templete.html())

    $commentBox.append(cmContainer)
  }
}

/**
 * 设置回复的操作。
 */
function handlingControls() {
  const crtlAreas = $commentTableRows.find('> td:last-of-type > .fr')

  crtlAreas.each((_, el) => {
    const ctrlArea = $(el)

    const crtlContainer = $('<span class="v2p-controls">')

    const thankIcon = $(`<span class="v2p-control">${iconHeart}</span>`)

    const thankArea = ctrlArea.find('> .thank_area')
    const thanked = thankArea.hasClass('thanked')

    if (thanked) {
      thankIcon.prop('title', '已感谢').css({ color: '#f43f5e', cursor: 'default' })
      crtlContainer.append($('<a>').append(thankIcon))
    } else {
      const thankEle = thankArea.find('> .thank')
      const hide = thankEle.eq(0).removeClass('thank')
      const thank = thankEle.eq(1).removeClass('thank')

      hide.html(`<span class="v2p-control v2p-hover-btn" title="隐藏">${iconHide}</span>`)

      thankIcon.prop('title', '感谢').addClass('v2p-hover-btn')
      thank.empty().append(thankIcon)

      crtlContainer.append(hide).append(thank)
    }

    const reply = ctrlArea.find('a:last-of-type')

    reply
      .find('> img[alt="Reply"]')
      .replaceWith(
        `<span class="v2p-control v2p-ac-reply v2p-hover-btn" title="回复">${iconReply}</span>`
      )

    crtlContainer.append(reply)

    thankArea.remove()
    const floorNum = ctrlArea.find('.no').clone()
    ctrlArea.empty().append(crtlContainer, floorNum)
  })

  const topicBtn = $('.topic_buttons .tb').addClass('v2p-tb')
  topicBtn.eq(0).append(`<span class="v2p-tb-icon">${iconStar}</span>`)
  topicBtn.eq(1).append(`<span class="v2p-tb-icon">${iconTwitter}</span>`)
  topicBtn.eq(2).append(`<span class="v2p-tb-icon">${iconIgnore}</span>`)
  topicBtn.eq(3).append(`<span class="v2p-tb-icon">${iconLove}</span>`)
}

function insertEmojiBox() {
  const os = getOS()

  const replyBtn = $(
    `<button class="normal button">回复<kbd>${os === 'macos' ? 'Cmd' : 'Ctrl'}+Enter</kbd></button>`
  ).replaceAll($('#reply-box input[type="submit"]'))

  const emoticons = ['🤩', '😂', '😅', '🥳', '😀', '🐶', '🐔', '🤡', '💩']

  const emoticonsContent = $(`
  <div class="v2p-emoticons">
    ${emoticons.map((emoji) => `<span>${emoji}</span>`).join('')}
  </div>
`)

  const emojiBtn = $(
    `<button type="button" class="normal button">${iconEmoji}</button>`
  ).insertAfter(replyBtn)

  const emojiBox = $('<div id="v2p-tooltip" role="tooltip"></div>')
    .append(emoticonsContent)
    .appendTo($('#reply-box'))
    .get(0)!

  const docClickHandler = (e: JQuery.ClickEvent) => {
    if ($(e.target).closest(emojiBox).length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleClose()
    }
  }

  const handleClose = () => {
    $(document).off('click', docClickHandler)
    emojiBox.style.visibility = 'hidden'
  }

  const handleEmojiOpen = () => {
    $(document).on('click', docClickHandler)

    void computePosition(emojiBtn.get(0)!, emojiBox, {
      placement: 'right-start',
      middleware: [offset(6), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      Object.assign(emojiBox.style, {
        left: `${x}px`,
        top: `${y}px`,
      })
      emojiBox.style.visibility = 'visible'
    })
  }

  emojiBtn.on('click', (e) => {
    e.stopPropagation()
    handleEmojiOpen()
  })
}

export function handlingComments() {
  {
    /**
     * 替换感谢的爱心。
     */
    $commentCells
      .find('.small.fade')
      .addClass('v2p-heart-box')
      .find('img[alt="❤️"]')
      .replaceWith(`<span class="v2p-icon-heart">${iconHeart}</span>`)
  }

  handlingControls()
  handlingPopularComments()

  {
    let i = 1
    while (i < $commentCells.length) {
      const cellDom = $commentCells.get(i)
      const currentComment = commentDataList.find((data) => data.id === cellDom?.id)

      if (cellDom && currentComment) {
        const { refMemberNames, refFloors } = currentComment

        const firstRefMemberName = refMemberNames?.at(0)
        const firstRefFloor = refFloors?.at(0)

        if (firstRefMemberName) {
          for (let j = i - 1; j >= 0; j--) {
            const { memberName: eachMemberName, floor: eachFloor } = commentDataList.at(j) || {}

            if (eachMemberName === firstRefMemberName) {
              // 首先以用户手动指定的楼层为准。
              if (firstRefFloor && firstRefFloor !== eachFloor) {
                const targetIdx = commentDataList
                  .slice(0, j)
                  .findIndex((data) => data.floor === firstRefFloor)

                if (targetIdx >= 0) {
                  $commentCells.eq(targetIdx).append(cellDom)
                  break
                }
              }

              $commentCells.eq(j).append(cellDom)
              break
            }
          }
        }

        i++
      }
    }
  }

  insertEmojiBox()
}
