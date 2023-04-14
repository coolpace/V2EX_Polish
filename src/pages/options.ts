import { StorageKey } from '../constants'
import type { Options } from '../types'
import { getOptions } from '../utils'

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log(changes, `Storage namespace "${namespace}" changed.`)
})

const saveOptions = async () => {
  const $save = $('#save')
  const originText = $save.text()

  const currentOptions: Options = {
    openInNewTab: $('#openInNewTab').prop('checked'),
    autoCheckIn: {
      enabled: $('#autoCheckIn').prop('checked'),
    },
    nestedReply: {
      display: $('input[name="nestedReplyDisplay"]:checked').prop('value'),
    },
  }

  await chrome.storage.sync.set({
    [StorageKey.Options]: currentOptions,
  })

  $save.addClass('success').text('保存成功')

  setTimeout(() => {
    $save.removeClass('success').text(originText)
  }, 1500)
}

$('#options-form').on('submit', (ev) => {
  ev.preventDefault() // 阻止默认的表单提交行为
  void saveOptions()
})

void (async function init() {
  const options = await getOptions()
  $('#openInNewTab').prop('checked', options.openInNewTab)
  $('#autoCheckIn').prop('checked', options.autoCheckIn.enabled)
  $('#displayAlign').prop('checked', options.nestedReply.display === 'align')
  $('#displayIndent').prop('checked', options.nestedReply.display === 'indent')
})()
