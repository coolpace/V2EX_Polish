import { StorageKey } from '../constants'
import { formatTimestamp, getStorage, setStorage } from '../utils'
import { defaultValue } from './popup.var'

async function loadSettings() {
  const storage = await getStorage()
  const api = storage[StorageKey.API]

  const $patInput = $('#pat')

  $patInput.on('change', (ev) => {
    const value = (ev.target as HTMLInputElement).value

    if (value) {
      $patInput.addClass('has-value')
    } else {
      $patInput.removeClass('has-value')
    }
  })

  if (api) {
    if (api.pat) {
      $patInput.val(api.pat).addClass('has-value')
    } else {
      $('.details').prop('open', true)
    }
    $('#limit').val(api.limit ?? defaultValue)
    $('#reset').val(api.reset ? formatTimestamp(api.reset, { format: 'YMDHMS' }) : defaultValue)
    $('#remaining').val(api.remaining ?? defaultValue)
  }

  $('#token-form').on('submit', (ev) => {
    ev.preventDefault() // 阻止默认的表单提交行为

    const PAT = $patInput.val()

    if (typeof PAT === 'string') {
      void setStorage(StorageKey.API, { pat: PAT }).then(() => {
        const $submitBtn = $('.submit-btn')
        const submitText = $submitBtn.text()

        $submitBtn.text('保存成功').prop('disabled', true)

        setTimeout(() => {
          $submitBtn.text(submitText).prop('disabled', false)
        }, 1500)
      })
    }
  })
}

export async function handleTokenForm() {
  await loadSettings()
}
