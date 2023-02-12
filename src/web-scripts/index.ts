import { nestedComments } from './nested-comments'
import { popular } from './popular'
import { replaceHeart, replaceReply } from './replace-element'
import { addStyle } from './style'

{
  $('#Top .site-nav .tools > .top').addClass('effect-btn')
  $('#Main .tab').addClass('effect-btn')
  $('#Main .topic_buttons a.tb').addClass('effect-btn')
  $('#Main .topic-link').attr('target', '_blank')
}

addStyle()

replaceHeart()
replaceReply()

popular()
nestedComments()
