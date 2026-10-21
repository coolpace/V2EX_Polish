/**
 * 将时间戳格式化为「年月日 时:分:秒」。
 */
export function formatTimestamp(
  timestamp: number,
  { format = 'YMD' }: { format?: 'YMD' | 'YMDHM' | 'YMDHMS' } = {},
): string {
  const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp)
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  const YMD = `${year}-${month}-${day}`

  if (format === 'YMDHM') {
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')

    return `${YMD} ${hour}:${minute}`
  }

  if (format === 'YMDHMS') {
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    return `${YMD} ${hour}:${minute}:${second}`
  }

  return YMD
}

/**
 * 日期时间解析工具函数的配置选项类型定义
 */
interface ParseDateTimeOptions {
  /** 输出格式类型 */
  format?: 'YYYY/MM/DD HH:mm' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss' | 'YYYY/MM/DD' | 'MM/DD HH:mm' | 'HH:mm:ss' | 'timestamp'
  /** 是否返回本地时间，默认为true */
  useLocalTime?: boolean
}

/**
 * 日期时间解析工具函数的返回结果类型
 */
interface ParseDateTimeResult {
  /** 解析是否成功 */
  success: boolean
  /** 格式化后的日期时间字符串或时间戳 */
  formatted?: string | number
  /** 原始Date对象 */
  date?: Date
  /** 错误信息 */
  error?: string
}

/**
 * 解析日期时间字符串并转换为指定格式
 *
 * @param dateTimeString - 日期时间字符串，支持多种格式如 "2024-10-18 08:57:40 +08:00"
 * @param options - 配置选项
 * @returns 解析结果对象
 */
export function parseDateTime(
  dateTimeString: string,
  options: ParseDateTimeOptions = {},
): ParseDateTimeResult {
  const { format = 'YYYY-MM-DD HH:mm' } = options

  try {
    // 处理输入字符串，移除多余空格
    const trimmedInput = dateTimeString.trim()

    if (!trimmedInput) {
      return {
        success: false,
        error: '日期时间字符串不能为空',
      }
    }

    let date: Date

    // 尝试解析不同格式的日期时间字符串
    if (trimmedInput.includes('+') || trimmedInput.includes('Z')) {
      // 处理带时区信息的字符串，如 "2024-10-18 08:57:40 +08:00"
      date = new Date(trimmedInput)
    }
    else if (trimmedInput.includes('T')) {
      // 处理ISO格式，如 "2024-10-18T08:57:40"
      date = new Date(trimmedInput)
    }
    else {
      // 处理标准格式，如 "2024-10-18 08:57:40" 或 "2024/10/18 08:57:40"
      // 将斜杠替换为连字符以确保兼容性
      const normalizedString = trimmedInput.replace(/\//g, '-')
      date = new Date(normalizedString)
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return {
        success: false,
        error: '无效的日期时间格式',
      }
    }

    // 根据指定格式返回结果
    let formatted: string | number

    if (format === 'timestamp') {
      formatted = date.getTime()
    }
    else {
      // 获取日期时间组件
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      // 根据格式类型生成输出
      switch (format) {
        case 'YYYY-MM-DD HH:mm':
          formatted = `${year}-${month}-${day} ${hours}:${minutes}`
          break

        case 'YYYY/MM/DD HH:mm':
          formatted = `${year}/${month}/${day} ${hours}:${minutes}`
          break

        case 'YYYY-MM-DD HH:mm:ss':
          formatted = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
          break

        case 'YYYY/MM/DD':
          formatted = `${year}/${month}/${day}`
          break

        case 'MM/DD HH:mm':
          formatted = `${month}/${day} ${hours}:${minutes}`
          break

        case 'HH:mm:ss':
          formatted = `${hours}:${minutes}:${seconds}`
          break

        default:
          formatted = `${year}/${month}/${day} ${hours}:${minutes}`
      }
    }

    return {
      success: true,
      formatted,
      date,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '解析日期时间时发生未知错误',
    }
  }
}

/**
 * 从字符串中提取天数。
 */
export function extractDays(str: string) {
  const match = str.match(/(\d+)\s*天前/)

  return match ? Number(match[1]) : null
}

/**
 * 比较两个时间戳是否为同一天。
 */
export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1)
  const date2 = new Date(timestamp2)

  return (
    date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
  )
}
