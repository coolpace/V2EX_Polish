'use client'

import { useEffect, useState } from 'react'

import { Skeleton, Table } from '@radix-ui/themes'

// 获取数字的小数位数
function decimalPlaces(num: number) {
  const str = num.toString()

  if (str.includes('.')) {
    return str.split('.')[1].length
  }

  return 0
}

function addDecimals(a: number, b: number) {
  const factor = Math.pow(10, Math.max(decimalPlaces(a), decimalPlaces(b)))

  return (a * factor + b * factor) / factor
}

interface DonationData {
  /** 捐赠者名称，不填则表示匿名 */
  from?: string
  /** 金额，单位：元 */
  money: string
  /** 时间，格式：YYYY/MM/DD */
  time: string
  /** 留言，不填则表示没有留言 */
  message?: string
  /** 捐赠方式 */
  channel: '微信赞赏' | '微信转账' | '支付宝转账'
}

// 骨架屏行组件
function SkeletonRow() {
  return (
    <Table.Row>
      <Table.RowHeaderCell>
        <Skeleton height="16px" width="64px" />
      </Table.RowHeaderCell>
      <Table.Cell justify="center">
        <Skeleton height="16px" width="48px" />
      </Table.Cell>
      <Table.Cell>
        <Skeleton height="16px" width="96px" />
      </Table.Cell>
      <Table.Cell>
        <Skeleton height="16px" width="80px" />
      </Table.Cell>
      <Table.Cell>
        <Skeleton height="16px" width="64px" />
      </Table.Cell>
    </Table.Row>
  )
}

export function SupportTable() {
  const [donationList, setDonationList] = useState<DonationData[]>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/donation')
      .then((res) => res.json() as Promise<DonationData[]>)
      .then((data) => {
        setDonationList(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const total = donationList?.reduce(
    (total, donation) => addDecimals(total, Number(donation.money)),
    0,
  )

  return (
    <div>
      {isLoading
        ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span>迄今为止，我们已收到</span>
                <Skeleton height="16px" width="32px" />
                <span>笔赞赏，共计</span>
                <Skeleton height="16px" width="48px" />
                <span>元。对于你们的大方支持，我们感慨万分！</span>
              </div>

              { }
              <img
                alt="支付宝支付码"
                className="hidden w-6 md:inline-block"
                src="/pixel-mona-heart.gif"
              />
            </div>
          )
        : (
            donationList
            && donationList.length > 0 && (
              <div className="flex items-center gap-2">
                <p>
                  迄今为止，我们已收到
                  {' '}
                  <strong>{donationList.length}</strong>
                  {' '}
                  笔赞赏，共计
                  {' '}
                  <strong>{total}</strong>
                  {' '}
                  元。对于你们的大方支持，我们感慨万分！
                </p>

                { }
                <img
                  alt="支付宝支付码"
                  className="hidden w-6 md:inline-block"
                  src="/pixel-mona-heart.gif"
                />
              </div>
            )
          )}

      <Table.Root className="not-prose" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>来自</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="whitespace-nowrap">
              金额（元）
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>留言</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>时间</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>方式</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {isLoading
            ? Array.from({ length: 5 }).map((_, idx) => <SkeletonRow key={idx} />) // 显示骨架屏行
            : donationList?.map((donation, idx) => (
                <Table.Row key={idx}>
                  <Table.RowHeaderCell>
                    {donation.from ?? <span className="text-main-500">匿名</span>}
                  </Table.RowHeaderCell>
                  <Table.Cell className="font-bold" justify="center">
                    {donation.money}
                  </Table.Cell>
                  <Table.Cell>{donation.message ?? '-'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-main-500">
                    {donation.time}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-main-500">
                    {donation.channel}
                  </Table.Cell>
                </Table.Row>
              ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
