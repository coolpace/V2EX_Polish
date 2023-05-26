// 由于 Firefox 目前尚不支持 :has()，所以需要使用此脚步主动加入深色模式的 class。
// 预计在 2023 年上半年，Firefox 将支持 :has()。
if (document.querySelector('#Wrapper').classList.contains('Night')) {
  document.body.classList.add('v2p-theme-dark')
}
