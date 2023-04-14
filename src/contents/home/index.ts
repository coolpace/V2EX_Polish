import { getOptions } from '../../utils'
import { handlingTopicList } from './topic-list'

void (async () => {
  {
    $('#Main .tab').addClass('v2p-hover-btn')

    const options = await getOptions()

    if (options.openInNewTab) {
      $('#Main .topic-link, .item_hot_topic_title > a, .item_node, a[href="/write"]').prop(
        'target',
        '_blank'
      )
    }
  }

  await handlingTopicList()
})()
