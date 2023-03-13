import { handlingTopicList } from './topic-list'

{
  $('#Main .tab').addClass('v2p-hover-btn')
  $('#Main .topic-link, .item_hot_topic_title > a, .item_node, a[href="/write"]')
    .prop('target', '_blank')
    .prop('rel', 'noopener noreferrer')
}

handlingTopicList()
