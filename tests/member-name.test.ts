// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'

import { getCurrentMemberName } from '../apps/extension/src/contents/member-name'

describe('getCurrentMemberName', () => {
  it('从顶部导航读取当前登录用户名', () => {
    document.body.innerHTML = `
      <div id="Top">
        <div class="tools">
          <a href="/notifications">提醒</a>
          <a href="/member/alice"> alice </a>
        </div>
      </div>
    `

    expect(getCurrentMemberName()).toBe('alice')
  })

  it('未登录或缺少用户链接时返回空值', () => {
    document.body.innerHTML = `
      <div id="Top">
        <div class="tools"><a href="/signin">登录</a></div>
      </div>
    `

    expect(getCurrentMemberName()).toBeUndefined()
  })
})
