import { getOptions } from '../helpers'
import { handlingTopicList } from './topic-list'

{
  $('#Main .tab').addClass('v2p-hover-btn')

  const links = $(
    '#Main .topic-link, .item_hot_topic_title > a, .item_node, a[href="/write"]'
  ).prop('rel', 'noopener noreferrer')

  void getOptions().then((options) => {
    if (options.openInNewTab) {
      links.prop('target', '_blank')
    }
  })
}

handlingTopicList()
