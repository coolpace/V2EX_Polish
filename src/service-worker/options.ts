import { StorageKey } from '../constants'
import type { Options } from '../types'

const saveBtn = document.querySelector('#save')

async function saveOptions() {
  const patInput = document.querySelector('#pat')

  if (patInput instanceof HTMLInputElement && patInput.value.length > 0) {
    const options: Options = {
      [StorageKey.OptPAT]: patInput.value,
    }
    await chrome.storage.sync.set({ options })
  }
}

if (saveBtn instanceof HTMLButtonElement) {
  saveBtn.addEventListener('click', () => {
    void saveOptions()
  })
}
