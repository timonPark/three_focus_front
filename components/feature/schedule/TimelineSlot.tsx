'use client'

import { useDroppable } from '@dnd-kit/core'

interface Props {
  hour: string
  hasBlock: boolean
  children?: React.ReactNode
}

export default function TimelineSlot({ hour, hasBlock, children }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: `slot-${hour}` })

  return (
    <div
      ref={setNodeRef}
      className={`h-16 flex border-b border-outline-variant/40 transition-colors
        ${isOver ? 'bg-secondary/5' : ''}`}
    >
      <span className="w-16 shrink-0 text-right pr-4 text-xs font-semibold text-on-surface-variant pt-2">
        {hour}
      </span>
      <div className="flex-1 relative">
        {isOver && !hasBlock && (
          <div className="absolute inset-1 border-2 border-dashed border-secondary/50 rounded-lg flex items-center justify-center z-10">
            <span className="text-xs text-secondary font-bold uppercase tracking-wide">여기에 드롭</span>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
