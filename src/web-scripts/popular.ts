import { commentBox, commentCells, commentData } from './globals'

export function popular() {
  const popularCommentData = commentData
    .filter(({ likes }) => likes > 0)
    .sort((a, b) => b.likes - a.likes)

  if (popularCommentData.length > 0) {
    const commentContainer = $(`
        <div class="extra-comments-mask">
          <div class="extra-comments-content box">
            <div class="extra-comments-bar">
              <span>本页共有 ${popularCommentData.length} 条热门回复</span>
              <button class="extra-comments-close-btn normal button">关闭<kbd>Esc</kbd></button>
            </div>
          </div>
        </div>
        `)
      .css({
        position: 'fixed',
        inset: '0',
        'z-index': '999',
        'overflow-y': 'auto',
      })
      .hide()

    {
      const commentBoxCount = commentBox.find('.cell:first-of-type > span.gray')
      const countText = commentBoxCount.text()
      const newCountText = countText.substring(0, countText.indexOf('回复') + 2)
      const countTextSpan = `<span class="count-text">${newCountText}</span><span class="split-dot">·</span>`

      let boundEvent = false

      const clickHandler = (e: JQuery.ClickEvent) => {
        const content = $('.extra-comments-content')
        if ($(e.target).closest(content).length === 0) {
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

        commentContainer.hide()
        document.body.classList.remove('modal-open')
      }

      const handleModalOpen = () => {
        if (!boundEvent) {
          $(document).on('click', clickHandler)
          $(document).on('keydown', keyupHandler)
          boundEvent = true
        }

        commentContainer.show()
        document.body.classList.add('modal-open')
      }

      const closeBtn = commentContainer.find('.extra-comments-close-btn')
      closeBtn.on('click', handleModalClose)

      const popularBtn = $('<span class="popular-btn effect-btn">🔥 查看热门回复</span>')
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

    commentContainer.find('.extra-comments-content').append(templete.html())

    commentBox.append(commentContainer)
  }
}
