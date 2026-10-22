import { describe, expect, it } from 'vitest'

import { createSerialQueue } from '../apps/extension/src/utils/async'

describe('createSerialQueue', () => {
  it('按加入顺序串行执行任务', async () => {
    const enqueue = createSerialQueue()
    const events: string[] = []

    const first = enqueue(async () => {
      events.push('first:start')
      await Promise.resolve()
      events.push('first:end')
    })

    const second = enqueue(async () => {
      events.push('second:start')
      await Promise.resolve()
      events.push('second:end')
    })

    await Promise.all([first, second])

    expect(events).toEqual([
      'first:start',
      'first:end',
      'second:start',
      'second:end',
    ])
  })

  it('单个任务失败不会阻塞后续任务', async () => {
    const enqueue = createSerialQueue()
    const events: string[] = []

    const failed = enqueue(async () => {
      events.push('failed')
      throw new Error('boom')
    })

    const next = enqueue(async () => {
      events.push('next')
    })

    await expect(failed).rejects.toThrow('boom')
    await expect(next).resolves.toBeUndefined()
    expect(events).toEqual(['failed', 'next'])
  })

  it('任务返回值会透传给调用方', async () => {
    const enqueue = createSerialQueue()

    await expect(enqueue(async () => 42)).resolves.toBe(42)
  })
})
