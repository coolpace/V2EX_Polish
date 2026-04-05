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

/** V2EX 回复数样式类选择器 */
const REPLY_COUNT_SELECTOR = '.count_livid, .count_orange'

/** HTML 转义 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text

  return div.innerHTML
}

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
      const $replyCount = $item.find(REPLY_COUNT_SELECTOR)

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
  catch (error) {
    console.error('[RelatedTopics] 解析标签页面失败:', error)

    return []
  }
}

/**
 * 根据标签获取相关主题列表
 */
async function fetchRelatedTopics(tag: string): Promise<RelatedTopic[]> {
  try {
    const htmlText = await crawlTagPage(tag)

    return parseTagPageTopics(htmlText)
  }
  catch (error) {
    console.error(`[RelatedTopics] 获取标签 "${tag}" 失败:`, error)

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

  const shouldEnablePreview = isBrowserExtension()
  const topicPreview = shouldEnablePreview ? useTopicPreview() : null

  // 批量构建 HTML
  const itemsHtml = topics.map((topic) => {
    const previewBtnHtml = shouldEnablePreview && topicPreview
      ? `<button class="v2p-topic-preview-btn" data-topic-id="${topic.id}" data-url="${topic.url}" data-title="${escapeHtml(topic.title)}">预览</button>`
      : ''

    return `
      <div class="cell">
        <div class="item_hot_topic_title">
          <a href="${topic.url}" target="_blank">${escapeHtml(topic.title)}</a>
          ${previewBtnHtml}
        </div>
      </div>
    `
  }).join('')

  const $relatedBox = $(`
    <div class="box">
      <div class="cell">
        <span class="fade">相关主题</span>
      </div>
      ${itemsHtml}
    </div>
  `)

  if (shouldEnablePreview && topicPreview) {
    $relatedBox.on('click', '.v2p-topic-preview-btn', function (this: HTMLElement) {
      const $btn = $(this)
      topicPreview.handlePreview({
        topicId: $btn.data('topic-id'),
        topicTitle: $btn.data('title'),
        linkHref: $btn.data('url'),
      })
    })
  }

  $rightbar.append($relatedBox)
}

/**
 * 处理相关主题推荐功能
 */
export async function handleRelatedTopics(): Promise<void> {
  // 检查当前主题 ID
  if (!pathTopicId) {
    console.warn('[RelatedTopics] 无法获取当前主题 ID，跳过相关主题推荐')

    return
  }

  try {
    const tags = extractTopicTags()

    if (tags.length === 0) {
      console.warn('[RelatedTopics] 当前主题没有标签，跳过相关主题推荐')

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
      console.warn('[RelatedTopics] 未找到相关主题')

      return
    }

    renderRelatedTopics(finalTopics)
    console.warn(`[RelatedTopics] 成功渲染 ${finalTopics.length} 个相关主题`)
  }
  catch (error) {
    console.error('[RelatedTopics] 获取相关主题失败:', error)
  }
}
