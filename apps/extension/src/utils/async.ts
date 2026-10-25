export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 创建一个串行任务队列。
 *
 * 任务按加入顺序依次执行；单个任务失败不会阻塞后续任务。
 */
export function createSerialQueue() {
  let tail: Promise<unknown> = Promise.resolve()

  return function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = tail.then(task)

    tail = result.then(
      () => undefined,
      () => undefined,
    )

    return result
  }
}
