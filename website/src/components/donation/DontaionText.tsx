import { donationList } from '~/components/donation/DonationTable'

export function DontaionText() {
  const total = donationList.reduce((total, donation) => total + Number(donation.money), 0)

  return (
    <p>
      迄今为止，我们已收到 {donationList.length} 笔赞赏，共计 {total}{' '}
      元。对于你们的大方支持，我们感慨万分！
    </p>
  )
}
