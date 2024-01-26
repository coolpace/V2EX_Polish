/* eslint-disable @next/next/no-img-element */

export function SupportOptions() {
  return (
    <div className="not-prose mx-auto flex max-w-[600px] flex-col items-center gap-3 overflow-hidden md:h-[400px] md:flex-row">
      <div>
        <img alt="微信赞赏码" src="https://i.imgur.com/AHmfQyK.jpg" />
      </div>

      <div className="flex h-full flex-row justify-around gap-3 overflow-hidden md:flex-1 md:flex-col">
        <div className="flex aspect-square flex-1 items-center justify-center overflow-hidden rounded-lg bg-[rgb(7_193_96_/_10%)] md:flex-none">
          <img alt="微信支付码" src="https://i.imgur.com/KNMd8iL.png" />
        </div>

        <div className="flex aspect-square flex-1 items-center justify-center overflow-hidden rounded-lg bg-[rgb(22_119_255_/_10%)] md:flex-none">
          <img alt="支付宝支付码" src="https://i.imgur.com/dxVZmc9.png" />
        </div>
      </div>
    </div>
  )
}
