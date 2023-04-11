import { StorageKey, V2EX } from '../constants'
import type { DailyInfo, StorageData } from '../types'
import { isSameDay } from '../utils'

const checkedInText = '每日登录奖励已领取'

const handleCheckedIn = async () => {
  const dailyInfo: DailyInfo = { lastCheckInTime: Date.now() }
  await chrome.storage.sync.set({ [StorageKey.Daily]: dailyInfo })
  console.log('自动签到成功')
}

export async function checkIn() {
  const result: StorageData = await chrome.storage.sync.get(StorageKey.Daily)
  const lastCheckInTime = result[StorageKey.Daily]?.lastCheckInTime

  if (lastCheckInTime) {
    if (isSameDay(lastCheckInTime, Date.now())) {
      console.log('今天已经领取奖励了')
      return
    }
  }

  const targetTextFragment = '/mission/daily/redeem'
  const targetUrl = `${V2EX.Origin}${targetTextFragment}`

  const res = await fetch(targetUrl)
  const htmlPlainText = await res.text()

  const startIndex = htmlPlainText.indexOf(targetTextFragment)

  if (startIndex !== -1) {
    const endIndex = htmlPlainText.indexOf("'", startIndex + targetTextFragment.length)

    if (endIndex !== -1) {
      const matchedString = htmlPlainText.slice(startIndex, endIndex) // 拿到 /mission/daily/redeem?once=xxxxx
      const checkInUrl = `${V2EX.Origin}${matchedString}`
      const checkInResult = await fetch(checkInUrl)
      const text = await checkInResult.text()

      if (text.includes(checkedInText)) {
        await handleCheckedIn()
        // const result = text.match(/已连续登录 \d+ 天/)
        // console.log(123, result)
      }
    }
  } else {
    if (htmlPlainText.includes(checkedInText)) {
      void handleCheckedIn()
    }
  }
}
