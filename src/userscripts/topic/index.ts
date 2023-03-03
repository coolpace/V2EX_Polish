import { $commentTableRows } from '../globals'
import { handlingComments } from './comment'
import { handlingContent } from './content'
import { handlingPaging } from './paging'

{
  $commentTableRows.find('> td:nth-child(3) > strong > a').prop('target', '_blank')
}

{
  // 按 ESC 隐藏回复框。
  $(document).on('keydown', (e) => {
    if (e.key === 'Escape') {
      const $replyBox = $('#reply-box')
      const $replyContent = $('#reply_content')

      if ($replyBox.hasClass('reply-box-sticky')) {
        $replyBox.removeClass('reply-box-sticky')
        $('#undock-button').css('display', 'none')
      }

      $replyContent.trigger('blur')
    }
  })
}

handlingContent()

{
  // 如果是从相同的主题页面跳转过来的，则认为是执行翻页操作，直接滚动到评论区。
  if (document.referrer !== '') {
    if (document.referrer.includes(document.location.pathname)) {
      document.querySelector('.topic_buttons')?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

handlingComments()
handlingPaging()
