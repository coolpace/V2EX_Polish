{
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!window.requestIdleCallback) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.requestIdleCallback = function (callback) {
      const start = Date.now()

      return setTimeout(function () {
        callback({
          didTimeout: false,
          timeRemaining: function () {
            return Math.max(0, 50 - (Date.now() - start))
          },
        })
      }, 1)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!window.cancelIdleCallback) {
    window.cancelIdleCallback = function (id) {
      clearTimeout(id)
    }
  }
}
