interface CreateToastProps {
  message: string
  duration?: number
}

export function createToast(props: CreateToastProps) {
  const { message, duration = 3000 } = props

  if ($('.v2p-toast').length > 0) {
    $('.v2p-toast').remove()
  }

  const $toast = $(`<div class="v2p-toast">${message}</div>`).hide()

  $(document.body).append($toast)

  $toast.fadeIn('fast')

  setTimeout(() => {
    $toast.fadeOut('fast', () => {
      $toast.remove()
    })
  }, duration)
}
