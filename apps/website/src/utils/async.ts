/**
 * 以固定并发上限执行异步任务，逐个收集成功/失败结果。
 *
 * 与 `Promise.all` 不同，单个任务失败不会中断其余任务，返回值可直接统计失败数量。
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T, index: number) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = []
  let cursor = 0

  const run = async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1

      const item = items[index]

      if (item === undefined) {
        continue
      }

      try {
        results[index] = { status: 'fulfilled', value: await task(item, index) }
      }
      catch (reason) {
        results[index] = { status: 'rejected', reason }
      }
    }
  }

  const concurrency = Math.min(Math.max(limit, 1), items.length)

  await Promise.all(Array.from({ length: concurrency }, run))

  return results
}
