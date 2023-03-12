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
  // 如果是从相同的主题跳转过来的，且含有分页参数，则被认为是执行翻页操作，跳过内容直接滚动到评论区。
  if (document.referrer !== '') {
    if (document.referrer.includes(document.location.pathname)) {
      const url = new URL(document.location.href)
      const page = url.searchParams.get('p')
      if (page && page !== '1') {
        document.querySelector('.topic_buttons')?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}

handlingComments()
handlingPaging()
