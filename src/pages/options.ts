import { StorageKey } from '../constants'
import { getOptions } from '../contents/helpers'

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log(changes, `Storage namespace "${namespace}" changed.`)
})

const saveOptions = () => {
  void chrome.storage.sync.set({
    [StorageKey.Options]: {
      openInNewTab: $('#openInNewTab').prop('checked'),
    },
  })
}

$('#options-form').on('submit', (ev) => {
  ev.preventDefault() // 阻止默认的表单提交行为
  saveOptions()
})

void (async function init() {
  const options = await getOptions()
  $('#openInNewTab').prop('checked', options.openInNewTab)
})()
