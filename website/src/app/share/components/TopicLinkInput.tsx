import { TextField } from '@radix-ui/themes'
import { SearchIcon } from 'lucide-react'

export interface TopicLinkInputProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  onSearh?: (value: string) => void
}

export function TopicLinkInput(props: TopicLinkInputProps) {
  const { value = '', onChange, disabled, onSearh } = props

  return (
    <TextField.Root>
      <TextField.Slot>
        <SearchIcon height="16" width="16" />
      </TextField.Slot>

      <TextField.Input
        disabled={disabled}
        placeholder="输入 V2EX 主题链接或主题 ID"
        value={value}
        variant="soft"
        onChange={(ev) => {
          onChange?.(ev.target.value)
        }}
        onKeyUp={(ev) => {
          if (ev.key === 'Enter') {
            onSearh?.(ev.currentTarget.value)
          }
        }}
      />
    </TextField.Root>
  )
}
