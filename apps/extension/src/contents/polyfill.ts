{
  if (!window.requestIdleCallback) {
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

  if (!window.cancelIdleCallback) {
    window.cancelIdleCallback = function (id) {
      clearTimeout(id)
    }
  }
}
