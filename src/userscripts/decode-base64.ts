import { $commentCells } from './globals'

/**
 * 代码参考自：https://github.com/bjzhou/v2ex-base64-decoder/blob/master/index.js
 */
const base64regex = /[A-z0-9+/=]+/g

// 已知以下字符串不能作为 base64 字符串识别，排除掉。
const excludeList = [
  'bilibili',
  'Bilibili',
  'MyTomato',
  'InDesign',
  'Encrypto',
  'encrypto',
  'Window10',
  'USERNAME',
  'airpords',
  'Windows7',
]

$commentCells.find('.reply_content').each((_, cellDom) => {
  cellDom.innerHTML = cellDom.innerHTML.replace(base64regex, (str) => {
    // 先从格式规则上简单排除掉非 base64 字符串。
    if (str.length < 8 || str.length % 4 !== 0) {
      return str
    }

    // 再从排除列表中排除掉非 base64 字符串。
    if (excludeList.includes(str)) {
      return str
    }

    try {
      const decodedStr = window.atob(str)
      return `${str}(<span class="v2p-decode" title="复制${decodedStr}">${decodedStr}</span>)`
    } catch {
      return str
    }
  })
})

$('.v2p-decode').on('click', (ev) => {
  const text = ev.target.innerText
  void navigator.clipboard.writeText(text)
  console.log('click', text)
})
