import { arrow, computePosition } from '@floating-ui/dom'

import {
  cellTableRows,
  commentBox,
  commentCells,
  commentData,
  loginName,
  topicContentBox,
  topicOwnerName,
} from './globals'

export function popular() {
  topicContentBox.find('a[href]').attr('target', '_blank')

  const popularCommentData = commentData
    .filter(({ likes }) => likes > 0)
    .sort((a, b) => b.likes - a.likes)

  if (popularCommentData.length > 0) {
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

const iconHeart = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
  />
</svg>
`

export function replaceHeart() {
  commentCells.find('.small.fade').addClass('heart-box').find('img[alt="❤️"]').replaceWith(`
      <span class="icon-heart">
        ${iconHeart}
      </span>
    `)
}

export function setControls() {
  const blockContent = $('<p></p>')
  const action1 = $('<button class="normal button">取消</button>')
  const action2 = $('<button class="normal button">确定隐藏</button>')
  const tooltip = $('<div id="v2p-tooltip" role="tooltip"><div id="v2p-tooltip-arrow"></div></div>')
    .append(blockContent, action1, action2)
    .appendTo($('body'))
  action1.on('click', () => {
    tooltip.get(0)!.style.visibility = 'hidden'
    action2.off('click')
  })

  const crtlAreas = cellTableRows.find('> td:last-of-type > .fr')

  crtlAreas.each((_, el) => {
    const ctrlArea = $(el)

    const crtlContainer = $('<span class="v2p-controls">')

    const thankIcon = $(`
      <span class="v2p-control">
        ${iconHeart}
      </span>
    `)

    const thankArea = ctrlArea.find('> .thank_area')
    const thanked = thankArea.hasClass('thanked')

    if (thanked) {
      thankIcon.attr('title', '已感谢').css({ color: '#f43f5e', cursor: 'default' })
      crtlContainer.append($('<a>').append(thankIcon))
    } else {
      const thankEle = thankArea.find('> .thank')
      const hide = thankEle.eq(0).removeClass('thank')
      const thank = thankEle.eq(1).removeClass('thank')

      hide.html(`
        <span class="v2p-control effect-btn" title="隐藏">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        </span>
      `)
      const handler = () => {
        computePosition(hide.get(0)!, tooltip.get(0)!, {
          placement: 'bottom',
          middleware: [arrow({ element: document.querySelector('#v2p-tooltip-arrow')! })],
        }).then(({ x, y }) => {
          Object.assign(tooltip.get(0)!.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
          tooltip.get(0)!.style.visibility = 'visible'
        })
      }
      const onclickStr = hide.attr('onclick')
      const [, param1, param2] = Array.from(onclickStr!.match(/ignoreReply\((.*?),(.*?)\)/)!)
      blockContent.html(`确定隐藏 ${param1}, ${param2}？`)
      action2.on('click', () => {
        console.log({ param1 })
        tooltip.get(0)!.style.visibility = 'hidden'
        // eval(`ignoreReply(${param1}, ${param2})`)
      })
      hide.prop('onclick', null).off('click')
      hide.on('click', handler)

      thankIcon.attr('title', '感谢').addClass('effect-btn')
      thank.empty().append(thankIcon)

      crtlContainer.append(hide).append(thank)
    }

    const reply = ctrlArea.find('a:last-of-type')

    reply.find('> img[alt="Reply"]').replaceWith(`
      <span class="v2p-control v2p-ac-reply effect-btn" title="回复">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      </span>
    `)

    crtlContainer.append(reply)

    thankArea.remove()
    const floorNum = ctrlArea.find('.no').clone()
    ctrlArea.empty().append(crtlContainer, floorNum)
  })

  $('#reply-box input[type="submit"]').attr('value', '发表回复')

  const topicBtn = $('.topic_buttons .tb').addClass('v2p-tb')
  topicBtn.eq(0).append(`
    <span class="v2p-tb-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        ></polygon>
      </svg>
    </span>
  `)
  topicBtn.eq(1).append(`
    <span class="v2p-tb-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
        ></path>
      </svg>
    </span>
  `)
  topicBtn.eq(2).append(`
    <span class="v2p-tb-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 15h8"></path>
        <path d="M8 9h2"></path>
        <path d="M14 9h2"></path>
      </svg>
    </span>
  `)
  topicBtn.eq(3).append(`
    <span class="v2p-tb-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"
        ></path>
      </svg>
    </span>
  `)
}

export function nestedComments() {
  let i = 1
  while (i < commentCells.length) {
    const cellDom = commentCells[i]
    const { name, content } = commentData[i]

    if (name === topicOwnerName) {
      cellDom.classList.add('owner')
    }

    if (name === loginName) {
      cellDom.classList.add('self')
    }

    if (content.includes('@')) {
      for (let j = i - 1; j >= 0; j--) {
        if (content.match(`@${commentData[j].name}`)) {
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
