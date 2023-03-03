import { $commentTableRows } from '../globals'
import { handlingComments } from './comment'
import { handlingContent } from './content'
import { handlingPaging } from './paging'

{
  $commentTableRows.find('> td:nth-child(3) > strong > a').prop('target', '_blank')
}

{
  // 按 ESC 隐藏回复框：
  $(document).on('keydown', (e) => {
    if (e.key === 'Escape') {
      const $replyBox = $('#reply-box')
      if ($replyBox.hasClass('reply-box-sticky')) {
        $replyBox.removeClass('reply-box-sticky')
      }
      $('#reply_content').trigger('blur')
    }
  })
}

handlingContent()
handlingComments()
handlingPaging()
