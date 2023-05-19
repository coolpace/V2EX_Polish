import { addToReadingList } from './helpers'

const url = $('head meta[property="og:url"]').prop('content')
const title = $('head meta[property="og:title"]').prop('content')
const content = $('head meta[property="og:description"]').prop('content')

void addToReadingList({ url, title, content })
