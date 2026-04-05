import { $body } from '../contents/globals'

interface CreateToastProps {
  message: string
  duration?: number
}

interface ToastControl {
  clear: () => void
}

export function createToast(props: CreateToastProps): ToastControl {
  const { message, duration = 3000 } = props

  const $existTosat = $('.v2p-toast')

  if ($existTosat.length > 0) {
    $existTosat.remove()
  }

  const $toast = $(`<div class="v2p-toast">${message}</div>`).hide()

  $body.append($toast)

  $toast.fadeIn('fast')

  if (duration !== 0) {
    setTimeout(() => {
      $toast.fadeOut('fast', () => {
        $toast.remove()
      })
    }, duration)
  }

  return {
    clear() {
      $toast.remove()
    },
  }
}
