import {
  describeCheckInErrorCode,
  resolveCheckInDisplayState,
} from '../background/check-in-utils'
import { StorageKey } from '../constants'
import { getCurrentMemberName } from '../contents/member-name'
import {
  fetchLatestTopics,
  fetchNotifications,
  getHotTopics,
} from '../services'
import type { DailyInfo, Notification, ReadingItem, Topic } from '../types'
import {
  copyCheckInDiagnostic,
  escapeHTML,
  formatTimestamp,
  getStorage,
  setStorage,
} from '../utils'
import { runPageCheckIn } from './scheduler'

export type ControlCenterTab
  = | 'reading'
    | 'hot'
    | 'latest'
    | 'messages'
    | 'features'
    | 'settings'

const VALID_TABS = new Set<ControlCenterTab>([
  'reading',
  'hot',
  'latest',
  'messages',
  'features',
  'settings',
])

const TAB_LABELS: Record<ControlCenterTab, string> = {
  reading: '稍后阅读',
  hot: '最热',
  latest: '最新',
  messages: '消息',
  features: '签到',
  settings: '设置',
}

function normalizeTab(tab: string | undefined): ControlCenterTab {
  if (VALID_TABS.has(tab as ControlCenterTab)) {
    return tab as ControlCenterTab
  }

  return 'reading'
}

function renderTopics(
  topics: Array<Pick<Topic, 'title' | 'url'> & { content?: string }>,
): string {
  if (topics.length === 0) {
    return '<div class="v2p-empty">暂无主题</div>'
  }

  return `
    <div class="v2p-topic-list">
      ${topics
        .map(
          (topic) => `
        <a class="v2p-topic-item" href="${escapeHTML(topic.url)}" target="_blank">
          <span class="v2p-item-title">${escapeHTML(topic.title)}</span>
          ${topic.content ? `<span class="v2p-item-summary">${escapeHTML(topic.content)}</span>` : ''}
        </a>
      `,
        )
        .join('')}
    </div>
  `
}

function renderReading(items: ReadingItem[]): string {
  if (items.length === 0) {
    return '<div class="v2p-empty">暂未添加稍后阅读的主题</div>'
  }

  return `
    <div class="v2p-toolbar-row" style="margin-bottom:12px">
      <button type="button" data-action="open-all-reading">打开全部</button>
    </div>
    <div class="v2p-reading-list">
      ${items
        .map(
          (item) => `
        <div class="v2p-reading-item">
          <a href="${escapeHTML(item.url)}" target="_blank">
            <span class="v2p-item-title">${escapeHTML(item.title)}</span>
            <span class="v2p-item-summary">${escapeHTML(item.content)}</span>
          </a>
          <div class="v2p-item-actions">
            <button type="button" data-action="remove-reading" data-url="${escapeHTML(item.url)}">移除</button>
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
  `
}

function renderMessages(items: Notification[], unread: number): string {
  if (items.length === 0) {
    const unreadText = unread > 0 ? `，未读 ${unread} 条` : ''

    return `<div class="v2p-empty">暂无新消息${unreadText}</div>`
  }

  return `
    <div class="v2p-toolbar-row" style="margin-bottom:12px">
      <strong>未读 ${unread} 条</strong>
    </div>
    <div class="v2p-message-list">
      ${items
        .map(
          (item) => `
        <div class="v2p-message-item">
          <span class="v2p-item-title">${escapeHTML(item.member?.username ?? 'V2EX')}</span>
          <span class="v2p-item-summary">${item.text ?? ''}</span>
          ${item.payload ? `<span class="v2p-item-summary">${escapeHTML(item.payload)}</span>` : ''}
        </div>
      `,
        )
        .join('')}
    </div>
  `
}

type PendingCheckInState = Extract<
  ReturnType<typeof resolveCheckInDisplayState>,
  { type: 'not-attempted' }
>

function describePendingCheckIn(state: PendingCheckInState): string {
  if (state.skipReason) {
    return escapeHTML(state.skipReason)
  }

  if (state.nextActionAt) {
    return `计划于 ${formatTimestamp(state.nextActionAt, { format: 'YMDHMS' })} 自动尝试`
  }

  return '页面存活期间会自动检查签到状态。'
}

function renderCheckIn(
  daily: DailyInfo | undefined,
  autoEnabled: boolean,
): string {
  const memberName = getCurrentMemberName()
  const state = resolveCheckInDisplayState({
    now: Date.now(),
    dailyInfo: daily,
    autoCheckInEnabled: autoEnabled,
    currentMemberName: memberName,
  })

  if (state.type === 'checked-in') {
    return `
      <div class="v2p-feature-card">
        <h2>今日已签到</h2>
        <p>${formatTimestamp(state.checkInTime, { format: 'YMDHMS' })}${state.checkInDays ? `，连续 ${state.checkInDays} 天` : ''}</p>
      </div>
    `
  }

  if (state.type === 'auto-disabled') {
    return `
      <div class="v2p-feature-card">
        <h2>自动签到已关闭</h2>
        <p>可在设置中重新开启，也可以手动签到。</p>
        <button type="button" class="v2p-primary" data-action="check-in">立即签到</button>
      </div>
    `
  }

  if (state.type === 'failed') {
    const description = describeCheckInErrorCode(state.code)

    return `
      <div class="v2p-feature-card">
        <h2>${escapeHTML(description.title)}</h2>
        <p>${escapeHTML(state.userMessage ?? state.reason ?? description.hint)}</p>
        <button type="button" class="v2p-primary" data-action="check-in">重试签到</button>
      </div>
    `
  }

  return `
    <div class="v2p-feature-card">
      <h2>每日签到</h2>
      <p>${describePendingCheckIn(state)}</p>
      <button type="button" class="v2p-primary" data-action="check-in">立即签到</button>
    </div>
  `
}

export function mountControlCenter(params: {
  container: HTMLElement
  initialTab?: string
  close: () => void
  openSettings: (section?: string) => void
}): () => void {
  const { container, close, openSettings } = params
  let activeTab = normalizeTab(params.initialTab)
  let disposed = false

  container.innerHTML = `
    <div class="v2p-panel">
      <header class="v2p-panel-header">
        <div class="v2p-panel-title">V2EX Polish</div>
        <button type="button" class="v2p-icon-button" data-action="close" aria-label="关闭">×</button>
      </header>
      <nav class="v2p-panel-tabs">
        ${(Object.entries(TAB_LABELS) as Array<[ControlCenterTab, string]>)
          .map(([tab, label]) => `<button type="button" data-tab="${tab}">${label}</button>`)
          .join('')}
      </nav>
      <div class="v2p-panel-content" role="region" aria-live="polite"></div>
    </div>
  `

  const content = container.querySelector<HTMLElement>('.v2p-panel-content')

  if (!content) {
    return () => undefined
  }

  const setActiveTab = (tab: ControlCenterTab) => {
    activeTab = tab
    container.querySelectorAll<HTMLElement>('[data-tab]').forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === tab)
    })
  }

  const render = async () => {
    if (disposed || !content) {
      return
    }

    setActiveTab(activeTab)
    content.innerHTML = '<div class="v2p-loading">加载中...</div>'

    try {
      switch (activeTab) {
        case 'reading': {
          const storage = await getStorage(false)
          const items = storage[StorageKey.ReadingList]?.data ?? []
          content.innerHTML = `<section class="v2p-panel-section">${renderReading(items)}</section>`

          break
        }

        case 'hot': {
          const { result } = await getHotTopics({ range: '3d', limits: 20 })
          content.innerHTML = `<section class="v2p-panel-section">${renderTopics(result)}</section>`

          break
        }

        case 'latest': {
          const topics = await fetchLatestTopics()
          content.innerHTML = `<section class="v2p-panel-section">${renderTopics(topics)}</section>`

          break
        }

        case 'messages': {
          const storage = await getStorage(false)

          if (!storage[StorageKey.API]?.pat) {
            content.innerHTML = `
              <section class="v2p-panel-section">
                <div class="v2p-empty">需要先设置个人访问令牌（PAT）</div>
                <div class="v2p-action-row">
                  <button type="button" class="v2p-primary" data-action="open-settings-token">去设置</button>
                </div>
              </section>
            `

            break
          }

          const response = await fetchNotifications()
          const notifications = response.result ?? []
          content.innerHTML = `
            <section class="v2p-panel-section">
              ${renderMessages(notifications, notifications.length)}
            </section>
          `
          content.querySelectorAll<HTMLAnchorElement>('.v2p-message-item a').forEach((link) => {
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
          })

          break
        }

        case 'features': {
          const storage = await getStorage(false)
          content.innerHTML = `
            <section class="v2p-panel-section">
              ${renderCheckIn(
                storage[StorageKey.Daily],
                storage[StorageKey.Options].autoCheckIn.enabled,
              )}
              <div class="v2p-action-row">
                <button type="button" data-action="copy-diagnostic">复制签到诊断信息</button>
              </div>
            </section>
          `

          break
        }

        case 'settings': {
          content.innerHTML = `
            <section class="v2p-panel-section">
              <div class="v2p-feature-card">
                <h2>V2EX Polish 设置</h2>
                <p>配置主题、回复、主题屏蔽、用户标签、PAT 与备份。</p>
                <button type="button" class="v2p-primary" data-action="open-settings">打开设置中心</button>
              </div>
            </section>
          `

          break
        }
      }
    }
    catch (error) {
      content.innerHTML = `
        <section class="v2p-panel-section">
          <div class="v2p-error">${escapeHTML(
            error instanceof Error ? error.message : '加载失败，请稍后重试',
          )}</div>
          <div class="v2p-action-row">
            <button type="button" data-action="retry">重试</button>
          </div>
        </section>
      `
    }
  }

  const handleClick = (event: MouseEvent) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    const tabButton = target.closest<HTMLElement>('[data-tab]')

    if (tabButton) {
      activeTab = normalizeTab(tabButton.dataset.tab)
      void render()

      return
    }

    const actionButton = target.closest<HTMLElement>('[data-action]')

    if (!actionButton) {
      return
    }

    switch (actionButton.dataset.action) {
      case 'close':
        close()
        break

      case 'retry':
        void render()
        break

      case 'open-settings':
        openSettings()
        break

      case 'open-settings-token':
        openSettings('token')
        break

      case 'remove-reading':
        void (async () => {
          const url = actionButton.dataset.url

          if (!url) {
            return
          }

          const storage = await getStorage(false)
          const data = storage[StorageKey.ReadingList]?.data ?? []
          await setStorage(StorageKey.ReadingList, {
            data: data.filter((item) => item.url !== url),
          })
          await render()
        })()

        break

      case 'open-all-reading':
        void (async () => {
          const storage = await getStorage(false)
          const data = storage[StorageKey.ReadingList]?.data ?? []

          for (const item of data) {
            window.open(item.url, '_blank', 'noopener,noreferrer')
          }
        })()

        break

      case 'check-in':
        ;(actionButton as HTMLButtonElement).disabled = true
        actionButton.textContent = '签到中...'
        void runPageCheckIn({
          force: true,
          trigger: 'manual',
          memberName: getCurrentMemberName(),
        }).finally(() => {
          void render()
        })
        break

      case 'copy-diagnostic':
        void (async () => {
          const copied = await copyCheckInDiagnostic()
          actionButton.textContent = copied ? '已复制诊断信息' : '复制失败'

          setTimeout(() => {
            actionButton.textContent = '复制签到诊断信息'
          }, 2000)
        })()

        break
    }
  }

  container.addEventListener('click', handleClick)
  void render()

  return () => {
    disposed = true
    container.removeEventListener('click', handleClick)
  }
}
