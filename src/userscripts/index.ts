import { setupHomeScript } from './home'
import { addGlobalStyle } from './style'
import { setupTopicScript } from './topic'

{
  $('#Top .site-nav .tools > .top').addClass('effect-btn')
}

addGlobalStyle()
setupHomeScript()
setupTopicScript()
