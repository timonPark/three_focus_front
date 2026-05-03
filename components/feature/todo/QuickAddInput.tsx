'use client'

import { useRef } from 'react'
import { Plus } from 'lucide-react'

interface QuickAddInputProps {
  onAdd: (title: string) => void
  disabled?: boolean
}

export default function QuickAddInput({ onAdd, disabled }: QuickAddInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
    const value = inputRef.current?.value.trim()
    if (!value) return
    onAdd(value)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="relative group">
      <input
        ref={inputRef}
        type="text"
        placeholder="새로운 할 일 추가... (Enter)"
        disabled={disabled}
        onKeyDown={handleKeyDown}
        className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.05)] border border-transparent text-sm outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-on-surface-variant disabled:opacity-50"
      />
      <Plus
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors"
      />
    </div>
  )
}
