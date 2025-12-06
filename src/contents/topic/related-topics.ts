import { crawlTagPage } from '../../services'
import { useTopicPreview } from '../../use-topic-preview'
import { isBrowserExtension } from '../../utils'
import { pathTopicId } from '../globals'

/** 相关主题的数据结构 */
interface RelatedTopic {
  /** 主题 ID */
  id: string
  /** 主题标题 */
  title: string
  /** 主题链接 */
  url: string
}

/** 最大显示的相关主题数量 */
const MAX_RELATED_TOPICS = 10

/** 最大提取的标签数量 */
const MAX_TAGS = 3

/**
 * 从当前主题页面提取标签关键词。
 *
 * @returns 前 3 个标签的文本数组
 */
function extractTopicTags(): string[] {
  const $tags = $('.cell .fr a.tag')
  const tags: string[] = []

  $tags.each((index, el) => {
    if (index >= MAX_TAGS) {
      return false
    }

    // 获取标签文本，去除 <li> 图标部分
    // 标签结构：<a class="tag"><li class="fa fa-tag"></li> 标签名</a>
    const $el = $(el)
    const tagText = $el.text().trim()

    if (tagText) {
      tags.push(tagText)
    }
  })

  return tags
}

/**
 * 从标签页面 HTML 中解析主题列表。
 *
 * @param htmlText - 标签页面的 HTML 文本
 * @returns 主题列表数组
 */
function parseTagPageTopics(htmlText: string): RelatedTopic[] {
  try {
    const $page = $(htmlText)
    const $topicItems = $page.find('.cell.item')
    const topics: RelatedTopic[] = []

    $topicItems.each((_, item) => {
      const $item = $(item)
      const $topicLink = $item.find('.item_title .topic-link')

      const title = $topicLink.text().trim()
      const url = $topicLink.attr('href')

      if (title && url) {
        // 从 URL 中提取主题 ID
        const match = url.match(/\/t\/(\d+)/)
        const id = match?.at(1)

        if (id) {
          topics.push({ id, title, url })
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
 * 根据标签获取相关主题列表。
 *
 * @param tag - 标签名称
 * @returns 主题列表数组
 */
async function fetchRelatedTopics(tag: string): Promise<RelatedTopic[]> {
  try {
    const htmlText = await crawlTagPage(tag)

    return parseTagPageTopics(htmlText)
  }
  catch {
    return []
  }
}

/**
 * 渲染相关主题列表到右侧栏。
 *
 * @param topics - 相关主题列表
 */
function renderRelatedTopics(topics: RelatedTopic[]): void {
  const $rightbar = $('#Rightbar')

  if ($rightbar.length === 0) {
    return
  }

  // 创建符合 V2EX 风格的 box 容器
  const $relatedBox = $(`
    <div class="box">
      <div class="cell">
        <span class="fade">相关主题</span>
      </div>
    </div>
  `)

  // 仅在浏览器扩展环境下添加预览功能
  const shouldEnablePreview = isBrowserExtension()
  const topicPreview = shouldEnablePreview ? useTopicPreview() : null
  const $previewBtn = $('<button class="v2p-topic-preview-btn">预览</button>')

  // 添加主题列表项
  topics.forEach((topic) => {
    const $item = $(`
      <div class="cell">
        <div class="item_hot_topic_title">
          <a href="${topic.url}" target="_blank">${topic.title}</a>
        </div>
      </div>
    `)

    // 为每个主题添加预览按钮
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

  // 追加到右侧栏底部
  $rightbar.append($relatedBox)
}

/**
 * 处理相关主题推荐功能。
 *
 * 该函数会：
 * 1. 从当前主题页面提取前 3 个标签
 * 2. 根据标签并行获取相关主题
 * 3. 合并、去重、排除当前主题
 * 4. 渲染前 10 个相关主题到右侧栏底部
 */
export async function handleRelatedTopics(): Promise<void> {
  try {
    // 1. 提取标签关键词
    const tags = extractTopicTags()

    if (tags.length === 0) {
      return
    }

    // 2. 并行获取所有标签的相关主题
    const topicsArrays = await Promise.all(tags.map(fetchRelatedTopics))

    // 3. 合并所有主题并去重
    const allTopics = topicsArrays.flat()
    const uniqueTopicsMap = new Map<string, RelatedTopic>()

    allTopics.forEach((topic) => {
      // 排除当前正在浏览的主题
      if (topic.id !== pathTopicId && !uniqueTopicsMap.has(topic.id)) {
        uniqueTopicsMap.set(topic.id, topic)
      }
    })

    // 4. 取前 10 个主题
    const uniqueTopics = Array.from(uniqueTopicsMap.values()).slice(0, MAX_RELATED_TOPICS)

    if (uniqueTopics.length === 0) {
      return
    }

    // 5. 渲染到右侧栏
    renderRelatedTopics(uniqueTopics)
  }
  catch {
    // 静默处理错误，不影响页面其他功能
  }
}
