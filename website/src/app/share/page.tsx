'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { Button, Flex } from '@radix-ui/themes'

import { isNumeric } from '~/utils'

import { TopicLinkInput } from './components/TopicLinkInput'

export default function SharePage() {
  const router = useRouter()

  const [searchValue, setSearchValue] = useState<string>()

  const handleSearchTopic = () => {
    let topicId: string | undefined

    if (searchValue) {
      if (searchValue.startsWith('http')) {
        topicId = searchValue.split('/').pop()
      } else if (isNumeric(searchValue)) {
        topicId = searchValue
      }

      if (topicId && isNumeric(topicId)) {
        router.push(`/share/${topicId}`)
      }
    }
  }

  return (
    <div>
      <Flex gap="3" justify="center" wrap="wrap">
        <div className="w-[300px]">
          <TopicLinkInput
            value={searchValue}
            onChange={setSearchValue}
            onSearh={handleSearchTopic}
          />
        </div>

        <Button
          highContrast
          variant="classic"
          onClick={() => {
            handleSearchTopic()
          }}
        >
          获取主题分享图片
        </Button>
      </Flex>
    </div>
  )
}
