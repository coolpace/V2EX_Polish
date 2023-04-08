import { StorageKey } from '../constants'
import { getOptions } from '../contents/helpers'
import { type Options } from './option.type'

const defaultOptions: Options = {
  openInNewTab: false,
}

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

void getOptions().then((options) => {
  $('#openInNewTab').prop('checked', options.openInNewTab ?? defaultOptions.openInNewTab)
})
