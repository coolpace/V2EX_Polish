'use client'

import { useEffect } from 'react'

import splitbee from '@splitbee/web'

export function Initial() {
  useEffect(() => {
    splitbee.init()
  }, [])

  return null
}
