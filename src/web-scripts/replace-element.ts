import { commentCells } from './globals'

export function replaceHeart() {
  commentCells.find('.small.fade').addClass('heart-box').find('img[alt="❤️"]').replaceWith(`
      <span class="icon-heart">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
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

export function replaceReply() {
  const thankAreas = commentCells.find('.thank_area')

  thankAreas.each((_, el) => {
    const thankArea = $(el)
    const thanked = thankArea.hasClass('thanked')

    const control = $('<span class="control-area">')

    const thankIcon = $(`
      <span class="control">
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

    if (thanked) {
      thankIcon.attr('title', '已感谢').css({ color: '#f43f5e', cursor: 'default' })
      control.append($('<a>').append(thankIcon))
    } else {
      const hide = thankArea.find('> a').eq(0).removeClass('thank')
      const thank = thankArea.find('> a').eq(1).removeClass('thank')

      hide.html(`
        <span class="control effect-btn" title="隐藏">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
            <line x1="2" y1="2" x2="22" y2="22"></line>
          </svg>
        </span>
      `)

      thankIcon.attr('title', '感谢').addClass('effect-btn')
      thank.empty().append(thankIcon)

      control.append(hide).append(thank)
    }

    const reply = thankArea.find('+ a')

    reply.find('> img[alt="Reply"]').replaceWith(`
          <span class="control effect-btn" title="回复">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 17 4 12 9 7"></polyline>
              <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
            </svg>
          </span>
        `)

    control.append(reply)

    control.replaceAll(thankArea)
  })
}
