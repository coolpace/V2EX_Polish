import type { CheckInDisplayState } from '../../background/check-in-utils'
import { describeCheckInErrorCode } from '../../background/check-in-utils'
import { formatTimestamp } from '../../utils/date'

export interface MissionPanelView {
  tone: 'success' | 'waiting' | 'error' | 'muted'
  title: string
  description: string
  detail?: string
  retryLabel?: string
  primaryLink?: {
    label: string
    href: string
  }
  showDiagnostics: boolean
}

const panelMarks: Record<MissionPanelView['tone'], string> = {
  success: '✓',
  waiting: '•',
  error: '!',
  muted: '•',
}

function getRetryDetail(retryAt: number | undefined, now: number): string {
  if (!retryAt) {
    return ''
  }

  return retryAt > now
    ? `下次自动重试 ${formatTimestamp(retryAt, { format: 'YMDHM' })}`
    : '下一次自动重试即将开始'
}

/**
 * 将签到状态转换为签到页面板需要展示的内容。
 */
export function getMissionPanelView(
  state: CheckInDisplayState,
  now = Date.now(),
): MissionPanelView {
  if (state.type === 'checked-in') {
    const days = state.checkInDays ? `，已连续登录 ${state.checkInDays} 天` : ''

    return {
      tone: 'success',
      title: '今日已自动签到',
      description: `V2EX Polish 已完成今日领取${days}`,
      showDiagnostics: false,
    }
  }

  if (state.type === 'auto-disabled') {
    return {
      tone: 'muted',
      title: '自动签到已关闭',
      description: '仍可使用上方按钮手动领取每日奖励。',
      showDiagnostics: false,
    }
  }

  if (state.type === 'not-attempted') {
    const description = state.nextActionAt && state.nextActionAt > now
      ? `计划于 ${formatTimestamp(state.nextActionAt, { format: 'YMDHM' })} 自动领取。`
      : '正在检查今天的签到状态。'

    return {
      tone: 'waiting',
      title: '等待自动签到',
      description,
      retryLabel: '立即尝试',
      showDiagnostics: true,
    }
  }

  const { title, hint } = describeCheckInErrorCode(state.code)
  const attempt = formatTimestamp(state.attemptTime, { format: 'YMDHM' })
  const status = state.httpStatus ? `HTTP ${state.httpStatus}` : ''
  const retry = getRetryDetail(state.retryAt, now)
  const detail = [attempt, status, retry].filter(Boolean).join(' · ')

  if (state.code === 'unauthenticated') {
    return {
      tone: 'error',
      title,
      description: state.userMessage ?? hint,
      detail,
      primaryLink: {
        label: '去登录',
        href: '/signin?next=/mission/daily',
      },
      showDiagnostics: true,
    }
  }

  return {
    tone: 'error',
    title,
    description: state.userMessage ?? hint,
    detail,
    ...state.needsAction ? {} : { retryLabel: '立即重试' },
    showDiagnostics: true,
  }
}

function createButton(action: string, label: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'v2p-checkin-mission-panel__button'
  button.dataset.action = action
  button.textContent = label

  return button
}

/**
 * 渲染签到页状态面板。容器由调用方创建，便于后续绑定事件代理。
 */
export function renderMissionPanel(
  panel: HTMLElement,
  state: CheckInDisplayState,
  now = Date.now(),
): void {
  const view = getMissionPanelView(state, now)

  panel.className = `v2p-checkin-mission-panel v2p-checkin-mission-panel--${view.tone}`
  panel.replaceChildren()

  const content = document.createElement('div')
  content.className = 'v2p-checkin-mission-panel__content'

  const mark = document.createElement('span')
  mark.className = 'v2p-checkin-mission-panel__mark'
  mark.setAttribute('aria-hidden', 'true')
  mark.textContent = panelMarks[view.tone]

  const copy = document.createElement('div')
  copy.className = 'v2p-checkin-mission-panel__copy'

  const title = document.createElement('strong')
  title.className = 'v2p-checkin-mission-panel__title'
  title.textContent = view.title

  const description = document.createElement('p')
  description.className = 'v2p-checkin-mission-panel__description'
  description.textContent = view.description
  copy.append(title, description)

  if (view.detail) {
    const detail = document.createElement('span')
    detail.className = 'v2p-checkin-mission-panel__detail'
    detail.textContent = view.detail
    copy.append(detail)
  }

  content.append(mark, copy)
  panel.append(content)

  if (!view.retryLabel && !view.primaryLink && !view.showDiagnostics) {
    return
  }

  const actions = document.createElement('div')
  actions.className = 'v2p-checkin-mission-panel__actions'

  if (view.retryLabel) {
    actions.append(createButton('retry', view.retryLabel))
  }

  if (view.primaryLink) {
    const link = document.createElement('a')
    link.className = 'v2p-checkin-mission-panel__button v2p-checkin-mission-panel__button--primary'
    link.href = view.primaryLink.href
    link.textContent = view.primaryLink.label
    actions.append(link)
  }

  if (view.showDiagnostics) {
    actions.append(
      createButton('copy-diagnostic', '复制签到诊断信息'),
      createButton('report-issue', '反馈问题'),
    )
  }

  panel.append(actions)
}

/** 成功后禁用页面中仍显示的原生领取按钮，避免重复领取提示。 */
export function syncNativeClaimButton(checkedIn: boolean): void {
  const button = document.querySelector<HTMLInputElement>('#Main .box input.button[value^="领取"]')

  if (!button) {
    return
  }

  if (button.dataset.v2pOriginalValue === undefined) {
    button.dataset.v2pOriginalValue = button.value
    button.dataset.v2pOriginalOnclick = button.getAttribute('onclick') ?? ''
    button.dataset.v2pOriginalDisabled = String(button.disabled)
  }

  if (checkedIn) {
    button.value = '今日已领取'
    button.disabled = true
    button.classList.add('v2p-checkin-claimed')
    button.removeAttribute('onclick')

    return
  }

  button.value = button.dataset.v2pOriginalValue ?? '领取'
  button.disabled = button.dataset.v2pOriginalDisabled === 'true'
  button.classList.remove('v2p-checkin-claimed')

  const originalOnclick = button.dataset.v2pOriginalOnclick

  if (originalOnclick) {
    button.setAttribute('onclick', originalOnclick)
  }
}
