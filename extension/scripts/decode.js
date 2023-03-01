const $commentBox = $('#Main .box:has(.cell[id^="r_"])')

const $commentCells = $commentBox.find('.cell[id^="r_"]')

const base64regex = /[A-z0-9+/=]+/g

// 已知以下字符串不能作为 base64 字符串，排除掉。
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
      return `${str}(${decodedStr})`
    } catch {
      return str
    }
  })
})
