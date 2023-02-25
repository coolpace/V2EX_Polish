import { computePosition, flip, offset, shift } from '@floating-ui/dom'

import {
  cellTableRows,
  commentBox,
  commentCells,
  commentData,
  getOS,
  loginName,
  topicContentBox,
  topicOwnerName,
} from './globals'
import {
  iconEmoji,
  iconHeart,
  iconHide,
  iconIgnore,
  iconLove,
  iconReply,
  iconStar,
  iconTwitter,
} from './icons'

export function popular() {
  topicContentBox.find('.topic_content a[href]').prop('target', '_blank')

  const popularCommentData = commentData
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
      const commentBoxCount = commentBox.find('.cell:first-of-type > span.gray')
      const countText = commentBoxCount.text()
      const newCountText = countText.substring(0, countText.indexOf('回复') + 2)
      const countTextSpan = `<span class="count-text">${newCountText}</span><span class="v2p-dot">·</span>`

      let boundEvent = false

      const clickHandler = (e: JQuery.ClickEvent) => {
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
        $(document).off('click', clickHandler)
        $(document).off('keydown', keyupHandler)
        boundEvent = false

        cmContainer.fadeOut('fast')
        document.body.classList.remove('modal-open')
      }

      const handleModalOpen = () => {
        if (!boundEvent) {
          $(document).on('click', clickHandler)
          $(document).on('keydown', keyupHandler)
          boundEvent = true
        }

        cmContainer.fadeIn('fast')
        document.body.classList.add('modal-open')
      }

      const closeBtn = cmContainer.find('.v2p-cm-close-btn')
      closeBtn.on('click', handleModalClose)

      const popularBtn = $('<span class="v2p-popular-btn effect-btn">🔥 查看热门回复</span>')
      popularBtn.on('click', (e) => {
        e.stopPropagation()
        handleModalOpen()
      })

      commentBoxCount.empty().append(countTextSpan).append(popularBtn)
    }

    const templete = $('<templete></templete>')

    popularCommentData.forEach(({ index }) => {
      templete.append(commentCells.eq(index).clone())
    })

    cmContent.append(templete.html())

    commentBox.append(cmContainer)
  }
}

export function replaceHeart() {
  commentCells
    .find('.small.fade')
    .addClass('heart-box')
    .find('img[alt="❤️"]')
    .replaceWith(`<span class="icon-heart">${iconHeart}</span>`)
}

export function setControls() {
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
  const closeBtn = $('<button type="button" class="normal button">隐藏</button>')
  const tooltip = $('<div id="v2p-tooltip" role="tooltip"></div>')
    .append(emoticonsContent, closeBtn)
    .appendTo($('#reply-box'))
  const tooltipEle = tooltip.get(0)!

  closeBtn.on('click', () => {
    tooltipEle.style.visibility = 'hidden'
  })

  const handler = () => {
    void computePosition(emojiBtn.get(0)!, tooltipEle, {
      placement: 'bottom',
      middleware: [offset(6), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      Object.assign(tooltipEle.style, {
        left: `${x}px`,
        top: `${y}px`,
      })
      tooltipEle.style.visibility = 'visible'
    })
  }
  emojiBtn.on('click', handler)

  const crtlAreas = cellTableRows.find('> td:last-of-type > .fr')

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

      hide.html(`<span class="v2p-control effect-btn" title="隐藏">${iconHide}</span>`)
      // const [, param1, param2] = Array.from(onclickStr!.match(/ignoreReply\((.*?),(.*?)\)/)!)

      thankIcon.prop('title', '感谢').addClass('effect-btn')
      thank.empty().append(thankIcon)

      crtlContainer.append(hide).append(thank)
    }

    const reply = ctrlArea.find('a:last-of-type')

    reply
      .find('> img[alt="Reply"]')
      .replaceWith(
        `<span class="v2p-control v2p-ac-reply effect-btn" title="回复">${iconReply}</span>`
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

export function nestedComments() {
  let i = 1
  while (i < commentCells.length) {
    const cellDom = commentCells[i]
    const { memberName, content } = commentData[i]

    if (memberName === topicOwnerName) {
      cellDom.classList.add('owner')
    }

    if (memberName === loginName) {
      cellDom.classList.add('self')
    }

    if (content.includes('@')) {
      for (let j = i - 1; j >= 0; j--) {
        if (content.match(`@${commentData[j].memberName}`)) {
          cellDom.classList.add('responder')
          commentCells[j].append(cellDom)
          break
        }
      }
    }

    i++
  }
}

export function paging() {
  const notCommentCells = commentBox.find('> .cell:not([id^="r_"])')

  if (notCommentCells.length <= 1) {
    return
  }

  const pagingCells = notCommentCells.slice(1).addClass('v2p-paging')
  const pageBtns = pagingCells.find('.super.button')
  pageBtns.eq(0).addClass('v2p-prev-btn')
  pageBtns.eq(1).addClass('v2p-next-btn')
}
