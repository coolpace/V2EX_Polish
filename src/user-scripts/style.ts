const style = ``

export function injectGlobalStyle() {
  $(`<style type='text/css'>${style}</style>`).appendTo('head')
}
