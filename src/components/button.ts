export function createButton(props: {
  children: string
  className?: string
  type?: 'button' | 'submit'
  tag?: 'button' | 'a'
  size?: 'small' | 'default' | 'large'
}): JQuery {
  const { children, className = '', type = 'button', tag = 'button', size = 'default' } = props

  const $button = $(`<${tag} class="normal button ${size === 'small' ? 'v2p-btn-small' : size === 'large' ? 'v2p-btn-large' : ''} ${className}">${children}</${tag}>`)

  if (tag === 'button') {
    $button.prop('type', type)
  }

  return $button
}
