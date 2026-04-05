export type ButtonVariant = 'super' | 'special'

export function createButton(props: {
  children: string
  className?: string
  type?: 'button' | 'submit'
  tag?: 'button' | 'a'
  size?: 'small' | 'default' | 'large'
  variant?: ButtonVariant
}): JQuery {
  const {
    children,
    className = '',
    type = 'button',
    tag = 'button',
    size = 'default',
    variant = 'normal',
  } = props

  const sizeClass = size === 'small' ? 'v2p-btn-small' : size === 'large' ? 'v2p-btn-large' : ''

  const $button = $(
    `<${tag} class="normal button ${variant} ${sizeClass} ${className}">${children}</${tag}>`,
  )

  if (tag === 'button') {
    $button.prop('type', type)
  }

  return $button
}
