/**
 * 页面内 Base64 候选的识别与解码。
 *
 * 全页解析天然会和普通英文冲突，因此这里不只看字符表和长度，还会检查解码后
 * 的内容是否像一段正常文本。长度、填充和可读性共同决定候选是否值得替换。
 */

export interface DecodedBase64Candidate {
  /** 候选串在原始文本中的起始位置。 */
  index: number
  /** 原始候选串，保留给页面展示。 */
  original: string
  /** 解码后的文本。 */
  decoded: string
}

const BASE64_ALPHABET_RE = /^[A-Za-z0-9+/]+={0,2}$/
const BASE64_RUN_RE = /[A-Za-z0-9+/]+={0,2}/g

/** 8 个字符的 Base64 可以表示 6 个字节，足以容纳 2 个中文字符。 */
const MIN_BASE64_LENGTH = 8

/** 在失败的长串里寻找嵌入候选时，限制单次扫描范围，避免阻塞页面。 */
const MAX_EMBEDDED_RUN_LENGTH = 256
const MAX_EMBEDDED_CANDIDATE_LENGTH = 64

const CJK_RE = /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF]/u
const CJK_PUNCTUATION_RE = /[\u3000-\u303F\uFF00-\uFFEF\u2000-\u206F]/u
const LATIN_TEXT_RE = /[\u00C0-\u00FF\u2000-\u206F]/u

const INVISIBLE_CHAR_RE = /[\uFFFD\uFEFF\u200B-\u200F\u202A-\u202E]/

interface NormalizedBase64 {
  value: string
  hadPadding: boolean
}

/**
 * 允许换行和制表符，拒绝 NUL、其他控制字符以及 DEL。
 */
function hasControlChar(text: string): boolean {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0
    const isLowControl = codePoint <= 0x08
    const isMiddleControl = codePoint >= 0x0B && codePoint <= 0x1F

    if (isLowControl || isMiddleControl || codePoint === 0x7F) {
      return true
    }
  }

  return false
}

/**
 * 校验 Base64 结构并补齐 padding。
 *
 * 浏览器 `atob` 本身可以接受部分无填充数据，但现有逻辑在进入 `atob` 前就
 * 用 `length % 4` 把这类数据排除了。这里统一补齐，同时拒绝余数为 1 的非法长度。
 */
function normalizeBase64(text: string): NormalizedBase64 | null {
  const candidate = text.trim()

  if (candidate.length < MIN_BASE64_LENGTH || !BASE64_ALPHABET_RE.test(candidate)) {
    return null
  }

  const unpadded = candidate.replace(/=+$/, '')
  const paddingLength = candidate.length - unpadded.length
  const expectedPadding = (4 - unpadded.length % 4) % 4
  const hasInvalidPadding = paddingLength !== 0 && paddingLength !== expectedPadding

  if (unpadded.length % 4 === 1 || hasInvalidPadding) {
    return null
  }

  return {
    value: unpadded + '='.repeat(expectedPadding),
    hadPadding: paddingLength > 0,
  }
}

/**
 * 将 `atob` 得到的 binary string（每个字符对应一个字节）按 UTF-8 解码为字符串。
 */
function decodeBinaryAsUtf8(binary: string): string {
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

/**
 * 兼容旧版先 URL 编码、再 Base64 的历史数据。
 */
function decodeLegacyPercentEncodedText(text: string): string {
  if (!/%[0-9A-Fa-f]{2}/.test(text)) {
    return text
  }

  try {
    return decodeURIComponent(text)
  }
  catch {
    return text
  }
}

/**
 * 判断解码结果是否像正常文本。
 *
 * 这一步是替代维护“普通英文排除列表”的关键：
 * - 控制字符、替换字符和不可见格式字符直接拒绝；
 * - 标点/符号比例过高时拒绝，避免把 `n)bn)b` 这类误判显示出来；
 * - 短串要求使用常见文字体系，并额外检查无 padding 的 ASCII 结果；
 * - 长串因为本身已经很像 Base64，只做较宽松的可读性检查。
 */
function isPlausibleDecodedText(text: string, hadPadding: boolean): boolean {
  const normalizedText = text.replace(/\r\n?/g, '\n')

  if (!normalizedText || hasControlChar(normalizedText) || INVISIBLE_CHAR_RE.test(normalizedText)) {
    return false
  }

  const chars = Array.from(normalizedText)
  let letters = 0
  let digits = 0
  let punctuation = 0
  let symbols = 0
  let other = 0

  for (const char of chars) {
    if (/\s/u.test(char)) {
      continue
    }

    if (/\p{L}/u.test(char)) {
      letters += 1
    }
    else if (/\p{N}/u.test(char)) {
      digits += 1
    }
    else if (/\p{P}/u.test(char)) {
      punctuation += 1
    }
    else if (/\p{S}/u.test(char)) {
      symbols += 1
    }
    else {
      other += 1
    }
  }

  if (other > 0 || letters + digits === 0) {
    return false
  }

  if (/^https?:\/\/\S+$/iu.test(normalizedText)) {
    return true
  }

  const hasCjk = CJK_RE.test(normalizedText)
  const punctuationRatio = (punctuation + symbols) / chars.length

  if (punctuationRatio > (hasCjk ? 0.35 : 0.2)) {
    return false
  }

  if (chars.length > 8) {
    return true
  }

  const hasAsciiLetter = /[A-Za-z]/.test(normalizedText)
  const hasNonAscii = chars.some((char) => (char.codePointAt(0) ?? 0) > 0x7F)

  // 短串里 ASCII 和 CJK 混排通常意味着误判，例如 `jf虩ey`。
  // 只有带 padding 的连续内容才放行，例如 `你好world` 的常见编码。
  if (hasAsciiLetter && hasCjk) {
    const hasWhitespace = /\s/u.test(normalizedText)
    const hasNonLetterOrDigit = /[^A-Za-z0-9\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF]/u.test(normalizedText)

    if (!hadPadding || hasWhitespace || hasNonLetterOrDigit) {
      return false
    }

    return true
  }

  const firstChar = chars[0]

  // 短文本以符号或标点开头时，多半是随机字节解码后的误判。
  if (!firstChar || /\p{P}/u.test(firstChar) || /\p{S}/u.test(firstChar)) {
    return false
  }

  if (hasCjk) {
    const nonAsciiChars = chars.filter((char) => (char.codePointAt(0) ?? 0) > 0x7F)
    const cjkChars = chars.filter((char) => CJK_RE.test(char)).length

    const allNonAsciiAreCjk = nonAsciiChars.every(
      (char) => CJK_RE.test(char) || CJK_PUNCTUATION_RE.test(char),
    )

    if (cjkChars / chars.length <= 0.5 || !allNonAsciiAreCjk) {
      return false
    }
  }
  else if (hasNonAscii) {
    const nonAsciiChars = chars.filter((char) => (char.codePointAt(0) ?? 0) > 0x7F)

    // 短串只接受常见的西欧文字和标点，避免把随机 Unicode 字符当成正文。
    if (!nonAsciiChars.every((char) => LATIN_TEXT_RE.test(char))) {
      return false
    }
  }

  if (!hadPadding && hasAsciiLetter && !hasCjk) {
    // 无 padding 的短 ASCII 候选最容易误判，要求它是连续的字母数字并至少含两个元音。
    const vowelCount = normalizedText.match(/[aeiouAEIOU]/g)?.length ?? 0

    if (!/^[A-Za-z0-9]+$/.test(normalizedText) || vowelCount < 2) {
      return false
    }
  }

  return true
}

/**
 * 尝试解码一个 Base64 候选。
 */
function decodeBase64Candidate(text: string): string | null {
  const normalized = normalizeBase64(text)

  if (!normalized) {
    return null
  }

  try {
    const binary = atob(normalized.value)
    const decoded = decodeLegacyPercentEncodedText(decodeBinaryAsUtf8(binary))

    return isPlausibleDecodedText(decoded, normalized.hadPadding) ? decoded : null
  }
  catch {
    return null
  }
}

/**
 * 当一整段字母数字串不是合法 Base64 时，尝试找出其中嵌入的候选。
 *
 * 例如 `prefix5L2g5aW9suffix` 这种与英文连在一起的内容，单靠最外层正则
 * 无法拆分。这里只扫描有限长度，避免对超长代码行做平方级遍历。
 */
function findEmbeddedCandidate(text: string, fromIndex: number): DecodedBase64Candidate | null {
  if (text.length > MAX_EMBEDDED_RUN_LENGTH) {
    return null
  }

  for (let start = fromIndex; start <= text.length - MIN_BASE64_LENGTH; start += 1) {
    const maxLength = Math.min(MAX_EMBEDDED_CANDIDATE_LENGTH, text.length - start)

    for (let length = maxLength; length >= MIN_BASE64_LENGTH; length -= 1) {
      if (length % 4 === 1) {
        continue
      }

      const original = text.slice(start, start + length)
      const decoded = decodeBase64Candidate(original)

      if (decoded !== null) {
        return { index: start, original, decoded }
      }
    }
  }

  return null
}

/**
 * 找出文本中所有值得展示的 Base64 候选，返回它们在原文中的位置。
 */
export function findBase64Candidates(text: string): DecodedBase64Candidate[] {
  const candidates: DecodedBase64Candidate[] = []
  const base64RunRegex = new RegExp(BASE64_RUN_RE.source, 'g')
  let match: RegExpExecArray | null

  while ((match = base64RunRegex.exec(text)) !== null) {
    const run = match[0]
    const wholeDecoded = decodeBase64Candidate(run)

    if (wholeDecoded !== null) {
      candidates.push({
        index: match.index,
        original: run,
        decoded: wholeDecoded,
      })
      continue
    }

    let fromIndex = 0

    while (fromIndex < run.length) {
      const embedded = findEmbeddedCandidate(run, fromIndex)

      if (!embedded) {
        break
      }

      candidates.push({
        index: match.index + embedded.index,
        original: embedded.original,
        decoded: embedded.decoded,
      })

      fromIndex = embedded.index + embedded.original.length
    }
  }

  return candidates
}
