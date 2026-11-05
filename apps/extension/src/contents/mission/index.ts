import { resolveCheckInDisplayState } from '../../background/check-in-utils'
import { Links, MessageKey, StorageKey } from '../../constants'
import type { CheckInResult, StorageSettings } from '../../types'
import { copyCheckInDiagnostic, getStorage } from '../../utils'
import { renderMissionPanel, syncNativeClaimButton } from './view'

function findMissionBox(): HTMLElement | undefined {
  const headings = document.querySelectorAll<HTMLElement>('#Main .box h1')

  for (const heading of headings) {
    if (heading.textContent?.trim().startsWith('每日登录奖励')) {
      return heading.closest<HTMLElement>('.box') ?? undefined
    }
  }

  return undefined
}

function renderFromStorage(storage: StorageSettings): HTMLElement | undefined {
  const missionBox = findMissionBox()

  if (!missionBox) {
    return undefined
  }

  let panel = missionBox.querySelector<HTMLElement>('.v2p-checkin-mission-panel')

  if (!panel) {
    panel = document.createElement('section')
    panel.className = 'v2p-checkin-mission-panel'
    panel.setAttribute('aria-live', 'polite')
    missionBox.append(panel)
  }

  const state = resolveCheckInDisplayState({
    now: Date.now(),
    dailyInfo: storage[StorageKey.Daily],
    autoCheckInEnabled: storage[StorageKey.Options].autoCheckIn.enabled,
  })

  renderMissionPanel(panel, state)
  syncNativeClaimButton(state.type === 'checked-in')

  return panel
}

let retryInFlight = false

async function handleRetry(button: HTMLButtonElement): Promise<void> {
  if (retryInFlight) {
    return
  }

  retryInFlight = true
  button.disabled = true
  button.setAttribute('aria-busy', 'true')
  button.textContent = '重试中...'

  try {
    await chrome.runtime.sendMessage<
      { [MessageKey.checkInRetry]: true },
      CheckInResult | undefined
    >({
      [MessageKey.checkInRetry]: true,
    })
    renderFromStorage(await getStorage(false))
  }
  catch (error) {
    console.warn('[V2EX Polish] 签到页重试失败：', error)
    button.textContent = '重试失败，请稍后再试'
  }
  finally {
    retryInFlight = false
  }
}

async function handleDiagnostic(
  button: HTMLButtonElement,
  openIssue: boolean,
): Promise<void> {
  const idleText = button.textContent ?? ''
  let copied = false
  button.disabled = true

  try {
    copied = await copyCheckInDiagnostic()
  }
  catch (error) {
    console.warn('[V2EX Polish] 生成签到诊断信息失败：', error)
  }

  button.textContent = copied
    ? '已复制诊断信息'
    : '复制失败，请打开扩展面板'

  if (copied && openIssue) {
    window.open(Links.NewIssue, '_blank', 'noopener,noreferrer')
  }

  setTimeout(() => {
    button.disabled = false
    button.textContent = idleText
  }, 2000)
}

function handlePanelClick(event: MouseEvent): void {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
    'button[data-action]',
  )

  if (!button) {
    return
  }

  if (button.dataset.action === 'retry') {
    void handleRetry(button)

    return
  }

  if (button.dataset.action === 'copy-diagnostic' || button.dataset.action === 'report-issue') {
    void handleDiagnostic(button, button.dataset.action === 'report-issue')
  }
}

void (async () => {
  if (window.top !== window) {
    return
  }

  const initialStorage = await getStorage(false)
  const panel = renderFromStorage(initialStorage)

  if (!panel) {
    return
  }

  panel.addEventListener('click', handlePanelClick)

  chrome.storage.onChanged.addListener((changes, areaName) => {
    const dailyChanged = areaName === 'local'
      && Object.hasOwn(changes, StorageKey.Daily)
    const optionsChanged = areaName === 'sync'
      && Object.hasOwn(changes, StorageKey.Options)

    if (dailyChanged || optionsChanged) {
      void getStorage(false)
        .then(renderFromStorage)
        .catch((error: unknown) => {
          console.warn('[V2EX Polish] 刷新签到页面板失败：', error)
        })
    }
  })
})().catch((error: unknown) => {
  console.warn('[V2EX Polish] 初始化签到页面板失败：', error)
})
