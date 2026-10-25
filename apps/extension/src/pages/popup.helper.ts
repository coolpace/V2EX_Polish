import type { ReadingItem, Topic } from '../types'
import { escapeHTML } from '../utils'
import { TabId } from './popup.var'

/** 所有合法的 Tab ID，用于校验来自 DOM/存储的不可信字符串。 */
const TAB_IDS: readonly string[] = [
  TabId.Reading,
  TabId.Hot,
  TabId.Latest,
  TabId.Message,
  TabId.Feature,
  TabId.Setting,
]

export function isTabId(tabId: unknown): tabId is TabId {
  return typeof tabId === 'string' && TAB_IDS.includes(tabId)
}

export const generateReadingItmes = (items: ReadingItem[]) => {
  return items
    .map((topic) => {
      const escapedText = $('<div>').text(topic.content).html()

      return `
        <div class="topic-item">
          <a href="${escapeHTML(topic.url)}" target="_blank">
            <span class="title">${escapeHTML(topic.title)}</span>
            <span class="content">${escapedText}</span>

            <div class="topic-item-actions">
              <button class="topic-item-action-remove" data-url="${escapeHTML(topic.url)}"> 移除</button>
            </div>
          </a>
        </div>
      `
    })
    .join('')
}

export const generateTopicItmes = (topics: Topic[]) => {
  return topics
    .map((topic) => {
      const escapedText = $('<div>').text(topic.content).html()

      return `
        <li class="topic-item">
          <a href="${escapeHTML(topic.url)}" target="_blank">
            <span class="title">${escapeHTML(topic.title)}</span>
            <span class="content">${escapedText}</span>
          </a>
        </li>
        `
    })
    .join('')
}

/**
 * 计算 local storage 的数据大小。
 */
export function calculateLocalStorageSize(): number {
  let total = 0

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)

    if (key) {
      const value = window.localStorage.getItem(key)

      if (value) {
        total += key.length + value.length
      }
    }
  }

  return total
}

/**
 * 将字节数格式化易读的单位。
 */
export function formatSizeUnits(bytes: number): string {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB']
  let i = 0

  while (bytes >= 1024 && i < 4) {
    bytes /= 1024
    i++
  }

  return bytes.toFixed(2) + ' ' + units[i]
}
