import { $commentTableRows } from '../globals'
import { nestedComments, popular, replaceHeart, setControls } from './comment'
import { paging } from './paging'

export function setupTopicScript() {
  $commentTableRows.find('> td:nth-child(3) > strong > a').prop('target', '_blank')

  replaceHeart()
  setControls()
  popular()
  nestedComments()
  paging()
}
