interface CreateToastProps {
  /** 纯文本内容。用户数据必须通过此字段传入。 */
  message?: string
  /** 可信的 HTML 内容，仅用于需要交互的提示。 */
  html?: string
  duration?: number
}

interface ToastControl {
  clear: () => void
}

export function createToast(props: CreateToastProps): ToastControl {
  const { message = '', html, duration = 3000 } = props

  const $existToast = $('.v2p-toast')

  if ($existToast.length > 0) {
    $existToast.remove()
  }

  const $toast = $('<div class="v2p-toast" role="status" aria-live="polite"></div>').hide()

  if (html) {
    $toast.html(html)
  }
  else {
    $toast.text(message)
  }

  $('body').append($toast)

  $toast.fadeIn('fast')

  const timer = duration === 0
    ? null
    : setTimeout(() => {
        $toast.fadeOut('fast', () => {
          $toast.remove()
        })
      }, duration)

  return {
    clear() {
      if (timer !== null) {
        clearTimeout(timer)
      }

      $toast.remove()
    },
  }
}
