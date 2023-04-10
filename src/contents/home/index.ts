import { getOptions } from '../helpers'
import { handlingTopicList } from './topic-list'

{
  $('#Main .tab').addClass('v2p-hover-btn')

  void getOptions().then((options) => {
    if (options.openInNewTab) {
      $('#Main .topic-link, .item_hot_topic_title > a, .item_node, a[href="/write"]').prop(
        'target',
        '_blank'
      )
    }
  })
}

handlingTopicList()
