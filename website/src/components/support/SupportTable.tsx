import { Table } from '@radix-ui/themes'

interface DonationData {
  from?: string
  money: string
  time: string
  message?: string
  channel: '微信赞赏' | '微信转账'
}

export const donationList: DonationData[] = [
  {
    from: '猎户星座',
    money: '6',
    time: '2024/05/11',
    message: '赞！！！',
    channel: '微信赞赏',
  },
  {
    from: '*强',
    money: '6',
    time: '2024/05/07',
    message: 'v2插件👍',
    channel: '微信转账',
  },
  {
    from: '余*',
    money: '66',
    time: '2024/02/28',
    message: '好看好用',
    channel: '微信转账',
  },
  {
    from: 'Zhitao',
    money: '9',
    time: '2024/02/02',
    message: '感谢大佬开发好用的插件',
    channel: '微信赞赏',
  },
  {
    from: 'Zryan',
    money: '6',
    time: '2024/01/10',
    message: '非常优秀的插件！',
    channel: '微信赞赏',
  },
  { from: 'BurgerTown', money: '6', time: '2024/01/09', channel: '微信赞赏' },
  { from: '匿名', money: '6', time: '2024/01/09', message: '🤙🤙', channel: '微信赞赏' },
  { from: '自言姿语', money: '9', time: '2024/01/09', message: '感谢大佬', channel: '微信赞赏' },
  {
    from: '匿名',
    money: '6',
    time: '2024/01/09',
    message: '来自 V2EX Polish',
    channel: '微信赞赏',
  },
  {
    from: 'Will',
    money: '6',
    time: '2024/01/09',
    message: 'v2p 的 UI/UX 设计很用心',
    channel: '微信赞赏',
  },
  { from: '🎃Jnan', money: '66', time: '2024/01/08', message: '你好棒呀！', channel: '微信赞赏' },
  { from: '喜多🍒', money: '22', time: '2023/10/07', message: '感谢你的插件', channel: '微信赞赏' },
  { from: '💿', money: '18', time: '2023/10/04', channel: '微信赞赏' },
  {
    from: 'Xavier',
    money: '6',
    time: '2023/09/26',
    message: '非常不错的插件',
    channel: '微信赞赏',
  },
  { from: '咸鱼', money: '9', time: '2023/09/26', channel: '微信赞赏' },
  { from: '😐', money: '6', time: '2023/05/30', message: 'whilegreathair', channel: '微信赞赏' },
  { from: '小人物', money: '10', time: '2023/05/30', channel: '微信赞赏' },
  {
    from: '喜多🍒',
    money: '22',
    time: '2023/05/28',
    message: '插件非常棒，请你喝杯奶茶',
    channel: '微信赞赏',
  },
  {
    from: '卷胖毛',
    money: '11',
    time: '2023/05/26',
    message: '喝杯奶茶继续加油！',
    channel: '微信赞赏',
  },
  {
    from: '匿名',
    money: '22',
    time: '2023/05/26',
    message: '在国内的环境下，能做独立产品的开发者实在太少了，点个赞',
    channel: '微信赞赏',
  },
  { from: '刘昆', money: '6', time: '2023/05/25', message: 'Polish 挺方便的', channel: '微信赞赏' },
  {
    from: '宇宙的尽头是什么',
    money: '2',
    time: '2023/05/25',
    message: '希望插件越来越好',
    channel: '微信赞赏',
  },
  { from: '陈洁', money: '22', time: '2023/05/25', message: '请你喝奶茶', channel: '微信赞赏' },
  {
    from: '摄影铁手男',
    money: '11',
    time: '2023/05/25',
    message: '非常好用的 v2 插件，感谢',
    channel: '微信赞赏',
  },
]

export function SupportTable() {
  return (
    <Table.Root className="not-prose" variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>来自</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="whitespace-nowrap">金额（元）</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>留言</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>时间</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>方式</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {donationList.map((donation) => (
          <Table.Row key={donation.from}>
            <Table.RowHeaderCell>{donation.from}</Table.RowHeaderCell>
            <Table.Cell className="font-bold" justify="center">
              {donation.money}
            </Table.Cell>
            <Table.Cell>{donation.message || '-'}</Table.Cell>
            <Table.Cell className="whitespace-nowrap opacity-70">{donation.time}</Table.Cell>
            <Table.Cell className="whitespace-nowrap opacity-70">{donation.channel}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
