import { donationList } from '~/components/support/SupportTable'

export function SupportText() {
  const total = donationList.reduce((total, donation) => total + Number(donation.money), 0)

  return (
    <p>
      迄今为止，我们已收到 <strong>{donationList.length}</strong> 笔赞赏，共计{' '}
      <strong>{total}</strong> 元。对于你们的大方支持，我们感慨万分！
    </p>
  )
}
