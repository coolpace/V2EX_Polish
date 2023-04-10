import { StorageKey } from '../constants'
import { getOptions } from '../contents/helpers'

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log(changes, `Storage namespace "${namespace}" changed.`)
})

const saveOptions = async () => {
  const $save = $('#save')
  const originText = $save.text()

  await chrome.storage.sync.set({
    [StorageKey.Options]: {
      openInNewTab: $('#openInNewTab').prop('checked'),
    },
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
})()
