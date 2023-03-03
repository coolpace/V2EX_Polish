import { StorageKey, V2EX } from '../../constants'
import type { Options } from '../../types'
import { $topicList } from '../globals'

interface Result {
  options?: Options
}

export function handlingTopicList() {
  chrome.storage.sync.get(StorageKey.Options, (result: Result) => {
    const PAT = result.options?.[StorageKey.OptPAT]

    if (!PAT) {
      return
    }

    $topicList.each((_, topicItem) => {
      const $topicItem = $(topicItem)

      const $topicPreview = $(`<div class="v2p-topic-index">预览</div>`)
        .on('click', () => {
          const linkPath = $topicItem.find('.topic-link').attr('href')
          const match = linkPath?.match(/\/(\d+)#/)

          if (match) {
            const topicId = match[1]

            fetch(`${V2EX.API}/topics/${topicId}`, {
              method: 'GET',
              headers: { Authorization: `Bearer ${PAT}` },
            })
              .then((res) => {
                console.log(res)
              })
              .catch((err) => {
                console.error(err)
              })
          }
        })
        .insertAfter($topicItem.find('.count_livid'))
    })
  })
}
