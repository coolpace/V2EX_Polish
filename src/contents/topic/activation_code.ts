import { StorageKey } from '../../constants'
import { getStorageSync } from '../../utils'
import { getCommentDataList } from '../dom'
import { $commentCells, $commentTableRows, $topicContentBox, $topicHeader } from '../globals'

/**
 * 激活码的正则表达式模式
 * 匹配由数字、字母和连字符构成的字符串，不包含空格
 * 为避免误匹配，设置最小长度为8个字符
 */
const ACTIVATION_CODE_PATTERNS = [
  // 由字母、数字和连字符组成的字符串，长度至少为8
  /[A-Za-z0-9-]{8,}/g,
]

const ACTIVATION_CODES_KEY = 'v2p_used_activation_codes'

/**
 * 判断字符串是否可能是激活码
 * 排除一些明显不是激活码的字符串
 */
function isPossibleActivationCode(code: string): boolean {
  // 排除一些常见的非激活码字符串
  const excludePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // 日期格式 YYYY-MM-DD
    /^\d{2}:\d{2}:\d{2}$/, // 时间格式 HH:MM:SS
    /^(https?|ftp):\/\//i, // URL
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // 邮箱
    /^\d+\.\d+\.\d+$/, // 版本号
    /^\d+\.\d+$/, // 小数
    /^v\d+/, // 以v开头的版本号
    /^[0-9-]{10,}$/, // 纯数字和连字符（可能是电话号码）
    /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/, // 更精确的日期格式
  ]

  for (const pattern of excludePatterns) {
    if (pattern.test(code)) {
      return false
    }
  }

  // 检查是否包含至少2个字母和2个数字，这是激活码的常见特征
  const hasLettersAndNumbers = /[A-Za-z].*[A-Za-z]/.test(code) && /[0-9].*[0-9]/.test(code)

  // 排除常见的单词和短语
  const commonWords = [
    'version',
    'update',
    'download',
    'install',
    'config',
    'setting',
    'windows',
    'linux',
    'macos',
    'android',
    'iphone',
    'github',
    'latest',
    'release',
    'stable',
    'beta',
    'alpha',
    'test',
  ]

  const lowerCode = code.toLowerCase()
  for (const word of commonWords) {
    if (lowerCode === word || lowerCode.includes(word)) {
      return false
    }
  }

  return hasLettersAndNumbers
}

/**
 * 从文本中提取激活码
 */
function extractActivationCodes(text: string): string[] {
  const codes: string[] = []

  ACTIVATION_CODE_PATTERNS.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) {
      // 过滤掉不可能是激活码的字符串
      const filteredMatches = matches.filter((code) => isPossibleActivationCode(code))
      codes.push(...filteredMatches)
    }
  })

  return [...new Set(codes)] // 去重
}

/**
 * 从评论中提取激活码
 * 使用getCommentDataList函数获取评论数据
 */
function extractCodesFromComments(): string[] {
  const usedCodes: string[] = []

  // 获取当前页面的选项
  const storage = getStorageSync()
  const options = storage[StorageKey.Options]

  // 使用getCommentDataList获取评论数据
  const commentDataList = getCommentDataList({
    options,
    $commentTableRows,
    $commentCells,
  })

  // 从每条评论中提取激活码
  commentDataList.forEach((commentData) => {
    const { content } = commentData

    // 提取评论中的激活码
    const codes = extractActivationCodes(content)
    if (codes.length > 0) {
      usedCodes.push(...codes)
    }
  })

  return [...new Set(usedCodes)] // 去重
}

/**
 * 处理HTML元素中的激活码
 * 如果元素中包含已使用的激活码，则添加删除线样式
 */
function processElementWithCodes($element: JQuery, usedCodes: string[]): void {
  if (usedCodes.length === 0) {
    return
  }

  // 处理纯文本节点
  const processTextNode = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const text = node.textContent
      let newHtml = text

      // 检查文本中是否包含激活码
      for (const code of usedCodes) {
        if (text.includes(code)) {
          // 使用正则表达式确保只替换完整的激活码，而不是部分匹配
          const safeCode = code.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
          const regex = new RegExp(`(${safeCode})`, 'g')
          newHtml = newHtml.replace(regex, '<del class="v2p-used-code">$1</del>')
        }
      }

      if (newHtml !== text) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = newHtml
        const fragment = document.createDocumentFragment()
        fragment.append(...tempDiv.childNodes)
        node.parentNode?.replaceChild(fragment, node)
      }
    }
  }

  // 遍历元素的所有子节点
  const walkNodes = (element: Element): void => {
    const childNodes = element.childNodes

    for (const node of Array.from(childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = (node as Element).tagName.toLowerCase()
        if (tagName === 'code') {
          const $code = $(node)
          const codeText = $code.text()
          // 检查code元素中是否包含已使用的激活码
          // 如果包含则将code内转为纯文本，规避激活码被元素截断的问题
          const hasUsedCode = usedCodes.some((code) => codeText.includes(code))
          if (hasUsedCode) {
            $code.html(codeText)
          }
        }
        if (tagName !== 'del') {
          walkNodes(node as Element)
        }
      }
    }
  }

  $element.each((_, el) => {
    walkNodes(el)
  })
}

/**
 * 检查帖子标题是否包含激活码相关关键字
 */
function isTitleContainsActivationCodeKeywords(): boolean {
  const title = $topicHeader.find('h1').text().toLowerCase()
  const keywords = ['送码', '激活码', '注册码', 'key', 'code', '兑换码', '序列号']
  return keywords.some((keyword) => title.includes(keyword))
}

/**
 * 从sessionStorage获取已保存的激活码
 */
function getSavedActivationCodes(): string[] {
  try {
    const savedCodes = sessionStorage.getItem(ACTIVATION_CODES_KEY)
    if (!savedCodes) {
      return []
    }

    const parsedCodes = JSON.parse(savedCodes) as unknown
    // 验证解析出的数据是否为字符串数组
    if (Array.isArray(parsedCodes) && parsedCodes.every((code) => typeof code === 'string')) {
      return parsedCodes
    }
    return []
  } catch (error) {
    console.error('获取保存的激活码失败:', error)
    return []
  }
}

/**
 * 保存激活码到sessionStorage
 */
function saveActivationCodes(codes: string[]): void {
  try {
    // 去重后保存
    const uniqueCodes = [...new Set(codes)]
    sessionStorage.setItem(ACTIVATION_CODES_KEY, JSON.stringify(uniqueCodes))
  } catch (error) {
    console.error('保存激活码失败:', error)
  }
}

/**
 * 处理帖子内容中的激活码
 */
export function handleActivationCodes(): void {
  // 检查帖子标题是否包含激活码相关关键字
  if (!isTitleContainsActivationCodeKeywords()) {
    return // 不包含激活码相关关键字，不需要处理
  }

  // 从评论中提取已使用的激活码
  const currentPageCodes = extractCodesFromComments()
  // 合并当前页面提取的激活码和之前保存的激活码
  const savedCodes = getSavedActivationCodes()
  const allUsedCodes = [...savedCodes, ...currentPageCodes]

  if (allUsedCodes.length === 0) {
    return // 没有找到已使用的激活码，不需要处理
  }

  // 保存合并后的激活码，供翻页后使用
  saveActivationCodes(allUsedCodes)

  // 处理主题内容中的激活码
  const $topicContents = $topicContentBox.find('.topic_content')
  $topicContents.each((_, content) => {
    processElementWithCodes($(content), allUsedCodes)
  })
}
