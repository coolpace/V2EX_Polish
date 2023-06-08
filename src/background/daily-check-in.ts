import { StorageKey, V2EX } from '../constants'
import type { DailyInfo } from '../types'
import { getStorage, isSameDay, setStorage } from '../utils'

const successText = '每日登录奖励已领取'

const handleCheckedIn = async (htmlText: string) => {
  const matchedArr = htmlText.match(/已连续登录 (\d+) 天/)

  let checkInDays: number | undefined

  if (matchedArr) {
    const days = Number([...matchedArr].at(1))
    if (!Number.isNaN(days)) {
      checkInDays = days
    }
  }

  const dailyInfo: DailyInfo = { lastCheckInTime: Date.now(), checkInDays }

  await setStorage(StorageKey.Daily, dailyInfo)
}

export async function checkIn() {
  // 「自动签到」在每天早上 8 点后才生效。
  if (new Date().getHours() < 8) {
    return
  }

  const storage = await getStorage(false)
  const dailyInfo = storage[StorageKey.Daily]
  const lastCheckInTime = dailyInfo?.lastCheckInTime

  if (lastCheckInTime) {
    if (isSameDay(lastCheckInTime, Date.now())) {
      return
    }
  }

  const targetTextFragment = '/mission/daily/redeem'
  const targetUrl = `${V2EX.Origin}${targetTextFragment}`

  const res = await fetch(targetUrl, { headers: { Referer: V2EX.Origin } })
  const htmlPlainText = await res.text()

  const startIndex = htmlPlainText.indexOf(targetTextFragment)

  if (startIndex !== -1) {
    const endIndex = htmlPlainText.indexOf("'", startIndex + targetTextFragment.length)

    if (endIndex !== -1) {
      const matchedString = htmlPlainText.slice(startIndex, endIndex) // 拿到 /mission/daily/redeem?once=xxxxx
      const checkInUrl = `${V2EX.Origin}${matchedString}`
      const checkInResult = await fetch(checkInUrl)
      const text = await checkInResult.text()

      if (text.includes(successText)) {
        await handleCheckedIn(text)
      }
    }
  } else {
    if (htmlPlainText.includes(successText)) {
      await handleCheckedIn(htmlPlainText)
    }
  }
}
