if (!CSS.supports('selector(:has(*))')) {
  // 检测到浏览器不支持 :has() 选择器，使用后备方案能切换至深色模式。
  if (document.querySelector('#Wrapper')?.classList.contains('Night')) {
    document.body.classList.add('v2p-theme-dark')
  }
}
