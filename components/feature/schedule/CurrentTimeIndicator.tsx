'use client'

import { useEffect, useState } from 'react'

const TIMELINE_START_HOUR = 5
const SLOT_HEIGHT = 64

export default function CurrentTimeIndicator() {
  const [top, setTop] = useState<number | null>(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours()
      const m = now.getMinutes()
      if (h >= TIMELINE_START_HOUR && h < 23) {
        setTop((h - TIMELINE_START_HOUR) * SLOT_HEIGHT + (m / 60) * SLOT_HEIGHT)
        setLabel(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      }
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  if (top === null) return null

  return (
    <div
      className="absolute left-16 right-0 flex items-center z-20 pointer-events-none"
      style={{ top: `${top}px` }}
    >
      <div className="w-2 h-2 rounded-full bg-error -ml-1 shrink-0" />
      <div className="flex-1 border-t-2 border-error" />
      <span className="ml-2 bg-error text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
        현재 {label}
      </span>
    </div>
  )
}
