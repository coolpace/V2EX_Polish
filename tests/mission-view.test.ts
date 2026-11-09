// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from 'vitest'

import {
  getMissionPanelView,
  renderMissionPanel,
  syncNativeClaimButton,
} from '../apps/extension/src/contents/mission/view'

const now = Date.UTC(2026, 10, 5, 0, 10)

describe('mission check-in view', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('成功时只展示简洁确认', () => {
    const view = getMissionPanelView(
      { type: 'checked-in', checkInTime: now - 1000, checkInDays: 12 },
      now,
    )

    expect(view).toMatchObject({
      tone: 'success',
      title: '今日已自动签到',
      showDiagnostics: false,
    })
    expect(view.description).toContain('12 天')
    expect(view.retryLabel).toBeUndefined()
  })

  it('等待状态提供立即尝试与诊断入口', () => {
    const view = getMissionPanelView(
      { type: 'not-attempted', nextActionAt: now + 5 * 60_000 },
      now,
    )

    expect(view).toMatchObject({
      tone: 'waiting',
      retryLabel: '立即尝试',
      showDiagnostics: true,
    })
  })

  it('登录失效时引导登录并保留诊断入口', () => {
    const view = getMissionPanelView(
      {
        type: 'failed',
        attemptTime: now,
        code: 'unauthenticated',
        userMessage: '登录状态已失效',
        needsAction: true,
      },
      now,
    )

    expect(view.retryLabel).toBeUndefined()
    expect(view.primaryLink).toEqual({
      label: '去登录',
      href: '/signin?next=/mission/daily',
    })
    expect(view.showDiagnostics).toBe(true)
  })

  it('人机验证时明确归因为 V2EX 安全验证且不展示重试按钮', () => {
    const view = getMissionPanelView(
      {
        type: 'failed',
        attemptTime: now,
        code: 'challenge',
        httpStatus: 403,
        userMessage: '这是 V2EX 的安全验证，不是插件故障。自动签到已暂停，请打开签到页完成验证后领取每日奖励。',
        needsAction: true,
      },
      now,
    )

    expect(view).toMatchObject({
      title: 'V2EX 要求完成人机验证',
      description: '这是 V2EX 的安全验证，不是插件故障。自动签到已暂停，请打开签到页完成验证后领取每日奖励。',
      showDiagnostics: true,
    })
    expect(view.retryLabel).toBeUndefined()
  })

  it('渲染失败状态及三个操作', () => {
    const panel = document.createElement('section')

    renderMissionPanel(
      panel,
      {
        type: 'failed',
        attemptTime: now,
        code: 'network',
        retryAt: now + 60_000,
      },
      now,
    )

    expect(panel.className).toContain('v2p-checkin-mission-panel--error')
    expect(panel.querySelectorAll('button[data-action]')).toHaveLength(3)
    expect(panel.textContent).toContain('下次自动重试')
  })

  it('自动签到关闭时不着重展示故障操作', () => {
    const panel = document.createElement('section')

    renderMissionPanel(panel, { type: 'auto-disabled' }, now)

    expect(panel.querySelector('button')).toBeNull()
    expect(panel.textContent).toContain('自动签到已关闭')
  })
})

describe('syncNativeClaimButton', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="Main">
        <div class="box">
          <div class="cell">
            <input class="super normal button" value="领取 8 铜币" onclick="claim()">
          </div>
        </div>
      </div>
    `
  })

  it('自动签到成功后禁用原生领取按钮，并能在状态回退时恢复', () => {
    const button = document.querySelector<HTMLInputElement>('input.button')!

    syncNativeClaimButton(true)

    expect(button.value).toBe('今日已领取')
    expect(button.disabled).toBe(true)
    expect(button.hasAttribute('onclick')).toBe(false)

    syncNativeClaimButton(false)

    expect(button.value).toBe('领取 8 铜币')
    expect(button.disabled).toBe(false)
    expect(button.getAttribute('onclick')).toBe('claim()')
  })
})
