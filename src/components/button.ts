export function createButton(props: {
  children: string
  className?: string
  type?: 'button' | 'submit'
  tag?: 'button' | 'a'
}): JQuery {
  const { children, className = '', type = 'button', tag = 'button' } = props

  const $button = $(`<${tag} class="normal button ${className}">${children}</${tag}>`)

  if (tag === 'button') {
    $button.prop('type', type)
  }

  return $button
}
