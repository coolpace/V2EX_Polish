import type { HotTopic, TopicFilterSettings } from '../../types'
import { shouldHideTopic } from './matcher'

/**
 * 对热议主题数据进行过滤。
 * 当前热议数据没有节点信息，因此简单节点屏蔽不会作用于热议列表。
 */
export function filterHotTopics(
  topics: HotTopic[],
  settings: TopicFilterSettings | undefined,
): HotTopic[] {
  return topics.filter((topic) => {
    const matches = shouldHideTopic(settings, 'hot', { title: topic.title, nodeName: '' })

    return !matches
  })
}
