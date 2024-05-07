/* eslint-disable @next/next/no-img-element */

import { donationList } from '~/components/support/SupportTable'

export function SupportText() {
  const total = donationList.reduce((total, donation) => total + Number(donation.money), 0)

  return (
    <div className="flex items-center gap-2">
      <p>
        迄今为止，我们已收到 <strong>{donationList.length}</strong> 笔赞赏，共计{' '}
        <strong>{total}</strong> 元。对于你们的大方支持，我们感慨万分！
      </p>

      <img alt="支付宝支付码" className="hidden w-6 md:inline-block" src="/pixel-mona-heart.gif" />
    </div>
  )
}
