import { $commentTableRows } from '../globals'
import { handlingComments } from './comment'
import { handlingContent } from './content'
import { handlingPaging } from './paging'

export function setupTopicScript() {
  {
    $commentTableRows.find('> td:nth-child(3) > strong > a').prop('target', '_blank')
  }

  handlingContent()
  handlingComments()
  handlingPaging()
}
