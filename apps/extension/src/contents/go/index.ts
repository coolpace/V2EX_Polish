import { applyTopicListFilter } from '../topic-filter/apply-topic-list-filter'

if (window.location.pathname.endsWith('/go/flamewar')) {
  $('#node_sidebar').addClass('v2p-node-sidebar-flamewar')
}

applyTopicListFilter('node')
