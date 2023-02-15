import { nestedComments } from './nested-comments'
import { paging } from './paging'
import { popular } from './popular'
import { replaceHeart, setControls } from './replace-element'
import { addStyle } from './style'

{
  $('#Top .site-nav .tools > .top').addClass('effect-btn')
  $('#Main .tab').addClass('effect-btn')
  $('#Main .topic_buttons a.tb').addClass('effect-btn')
  $('#Main .topic-link, .item_hot_topic_title > a, .item_node').attr('target', '_blank')
}

addStyle()

replaceHeart()
setControls()

popular()
nestedComments()
paging()
