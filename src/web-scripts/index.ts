import { addGlobalStyle } from './style'
import { nestedComments, paging, popular, replaceHeart, setControls } from './topic'

{
  $('#Top .site-nav .tools > .top').addClass('effect-btn')
  $('#Main .tab').addClass('effect-btn')
  $('#Main .topic_buttons a.tb').addClass('effect-btn')
  $('#Main .topic-link, .item_hot_topic_title > a, .item_node').prop('target', '_blank')
}

addGlobalStyle()

replaceHeart()
setControls()

popular()
nestedComments()
paging()
