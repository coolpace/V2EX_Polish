import { buildCheckInDiagnostic } from '../background/check-in-utils'
import { StorageKey } from '../constants'
import { getStorage } from './storage'

/** 生成当前签到诊断文本。 */
export async function createCheckInDiagnostic(): Promise<string> {
  const storage = await getStorage(false)
  const browser = navigator.userAgent.includes('Firefox/') ? 'Firefox' : 'Chromium'

  return buildCheckInDiagnostic({
    now: Date.now(),
    dailyInfo: storage[StorageKey.Daily],
    autoCheckInEnabled: storage[StorageKey.Options].autoCheckIn.enabled,
    extensionVersion: chrome.runtime.getManifest().version,
    browser: `${browser}（${navigator.userAgent}）`,
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
  })
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)

    return true
  }
  catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.append(textarea)
    textarea.select()

    try {
      return document.execCommand('copy')
    }
    catch {
      return false
    }
    finally {
      textarea.remove()
    }
  }
}

/** 复制签到诊断文本，供 popup 与签到页共用。 */
export async function copyCheckInDiagnostic(): Promise<boolean> {
  return copyText(await createCheckInDiagnostic())
}
