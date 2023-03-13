// chrome.runtime.openOptionsPage()

import { StorageKey } from '../constants'
import type { API, StorageData } from '../types'

const saveBtn = document.querySelector('#save')

window.addEventListener('load', () => {
  chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
    const patInput = document.querySelector('#pat')
    const limit = document.querySelector('#limit')
    const reset = document.querySelector('#reset')
    const remaining = document.querySelector('#remaining')

    const api = result[StorageKey.API]

    if (
      patInput instanceof HTMLInputElement &&
      limit instanceof HTMLInputElement &&
      reset instanceof HTMLInputElement &&
      remaining instanceof HTMLInputElement &&
      api
    ) {
      console.log(api)
      patInput.value = api.pat ?? ''
      console.log(patInput.value, 123)
      limit.value = String(api.limit)
      reset.value = String(api.reset)
      remaining.value = String(api.remaining)
    }
  })

  chrome.storage.sync.get(StorageKey.LegacyAPI, (result: StorageData) => {
    const limitv1 = document.querySelector('#limitv1')
    const resetv1 = document.querySelector('#resetv1')
    const remainingv1 = document.querySelector('#remainingv1')

    const apiv1 = result[StorageKey.LegacyAPI]

    if (
      limitv1 instanceof HTMLInputElement &&
      resetv1 instanceof HTMLInputElement &&
      remainingv1 instanceof HTMLInputElement &&
      apiv1
    ) {
      limitv1.value = String(apiv1.limit)
      resetv1.value = String(apiv1.reset)
      remainingv1.value = String(apiv1.remaining)
    }
  })

  async function saveOptions() {
    const patInput = document.querySelector('#pat')

    if (patInput instanceof HTMLInputElement && patInput.value.length > 0) {
      const api: API = {
        pat: patInput.value,
      }
      await chrome.storage.sync.set({ [StorageKey.API]: api })
    }
  }

  if (saveBtn instanceof HTMLButtonElement) {
    saveBtn.addEventListener('click', () => {
      void saveOptions()
    })
  }
})
