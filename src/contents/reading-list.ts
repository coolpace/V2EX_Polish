import { createToast } from '../components/toast'

const title = $('head meta[property="og:title"]').prop('content')
const desc = $('head meta[property="og:description"]').prop('content')

if (!(typeof title === 'string' || typeof desc === 'string')) {
  const message = '无法识别将该主题的元数据'
  createToast({ message })
  throw new Error(message)
}
