import { crawlTagPage } from '../../services'
import { useTopicPreview } from '../../use-topic-preview'
import { isBrowserExtension } from '../../utils'
import { pathTopicId } from '../globals'

interface RelatedTopic {
  id: string
  title: string
  url: string
  replies: number
}

/** 最大显示的相关主题数量 */
const MAX_RELATED_TOPICS = 10

/** 最大提取的标签数量 */
const MAX_TAGS = 3

/**
 * 从当前主题页面提取标签关键词
 */
function extractTopicTags(): string[] {
  const $tags = $('.cell .fr a.tag')
  const tags: string[] = []

  $tags.each((index, el) => {
    if (index >= MAX_TAGS) {
      return false
    }

    const $el = $(el)
    const tagText = $el.text().trim()

    if (tagText) {
      tags.push(tagText)
    }
  })

  return tags
}

/**
 * 从标签页面 HTML 中解析主题列表
 */
function parseTagPageTopics(htmlText: string): RelatedTopic[] {
  try {
    const $page = $(htmlText)
    const $topicItems = $page.find('.cell.item')
    const topics: RelatedTopic[] = []

    $topicItems.each((_, item) => {
      const $item = $(item)
      const $topicLink = $item.find('.item_title .topic-link')
      // V2EX 用 .count_livid（普通）或 .count_orange（热门）显示回复数
      const $replyCount = $item.find('.count_livid, .count_orange')

      const title = $topicLink.text().trim()
      const url = $topicLink.attr('href')
      const replies = parseInt($replyCount.text().trim(), 10) || 0

      if (title && url) {
        const match = url.match(/\/t\/(\d+)/)
        const id = match?.at(1)

        if (id) {
          topics.push({ id, title, url, replies })
        }
      }
    })

    return topics
  }
  catch {
    return []
  }
}

/**
 * 根据标签获取相关主题列表
 */
async function fetchRelatedTopics(tag: string): Promise<RelatedTopic[]> {
  try {
    const htmlText = await crawlTagPage(tag)

    return parseTagPageTopics(htmlText).sort((a, b) => b.replies - a.replies)
  }
  catch {
    return []
  }
}

/**
 * 渲染相关主题列表到右侧栏
 */
function renderRelatedTopics(topics: RelatedTopic[]): void {
  const $rightbar = $('#Rightbar')

  if ($rightbar.length === 0) {
    return
  }

  const $relatedBox = $(`
    <div class="box">
      <div class="cell">
        <span class="fade">相关主题</span>
      </div>
    </div>
  `)

  const shouldEnablePreview = isBrowserExtension()
  const topicPreview = shouldEnablePreview ? useTopicPreview() : null
  const $previewBtn = $('<button class="v2p-topic-preview-btn">预览</button>')

  topics.forEach((topic) => {
    const $item = $(`
      <div class="cell">
        <div class="item_hot_topic_title">
          <a href="${topic.url}" target="_blank">${topic.title}</a>
        </div>
      </div>
    `)

    if (shouldEnablePreview && topicPreview) {
      $previewBtn
        .clone()
        .on('click', () => {
          topicPreview.handlePreview({
            topicId: topic.id,
            topicTitle: topic.title,
            linkHref: topic.url,
          })
        })
        .appendTo($item.find('.item_hot_topic_title'))
    }

    $relatedBox.append($item)
  })

  $rightbar.append($relatedBox)
}

/**
 * 处理相关主题推荐功能
 */
export async function handleRelatedTopics(): Promise<void> {
  try {
    const tags = extractTopicTags()

    if (tags.length === 0) {
      return
    }

    const topicsArrays = await Promise.all(tags.map(fetchRelatedTopics))

    const seenIds = new Set<string>()
    const candidateTopics: RelatedTopic[] = []

    for (const topics of topicsArrays) {
      for (const topic of topics) {
        if (topic.id !== pathTopicId && !seenIds.has(topic.id)) {
          seenIds.add(topic.id)
          candidateTopics.push(topic)
        }
      }
    }

    const finalTopics = candidateTopics
      .sort((a, b) => b.replies - a.replies)
      .slice(0, MAX_RELATED_TOPICS)

    if (finalTopics.length === 0) {
      return
    }

    renderRelatedTopics(finalTopics)
  }
  catch {
    // 静默处理错误，不影响页面其他功能
  }
}
