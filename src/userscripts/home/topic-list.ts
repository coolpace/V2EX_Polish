import { $topicList, V2EX } from '../globals'

export function handlingTopicList() {
  const PAT = localStorage.getItem('v2p_pat')

  if (!PAT) {
    // TODO 提示用户设置 PAT
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
          const PAT = localStorage.getItem('v2p_pat')

          fetch(`${V2EX.API}/topics/${topicId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${PAT!}` },
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
}
