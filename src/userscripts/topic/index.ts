import { $commentTableRows } from '../globals'
import { handlingComments } from './comment'
import { paging } from './paging'

export function setupTopicScript() {
  {
    $commentTableRows.find('> td:nth-child(3) > strong > a').prop('target', '_blank')
  }

  handlingComments()
  paging()
}
