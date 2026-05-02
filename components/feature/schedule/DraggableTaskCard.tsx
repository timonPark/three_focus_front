'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Timer } from 'lucide-react'
import type { TodoResponse } from '@/types/todo'
import type { ScheduleResponse } from '@/types/schedule'
import { formatMinutes, formatTimeRange } from '@/lib/utils'

interface Props {
  todo: TodoResponse
  schedule?: ScheduleResponse
  order: number
}

export default function DraggableTaskCard({ todo, schedule, order }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${todo.id}`,
    data: { todoId: todo.id, estimatedMinutes: todo.estimatedMinutes },
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-5 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-2 transition-all
        ${schedule ? 'border-2 border-secondary' : 'border border-outline-variant'}
        ${isDragging ? 'opacity-40 scale-95 z-50' : 'hover:shadow-md'}`}
    >
      <div className="flex justify-between items-start">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold
            ${schedule ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}
        >
          {schedule ? formatTimeRange(schedule.startTime, schedule.endTime) : '미배치'}
        </span>
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing text-on-surface-variant hover:text-secondary transition-colors p-1 -m-1"
        >
          <GripVertical size={16} />
        </div>
      </div>
      <h3 className="text-base font-semibold text-on-surface leading-snug">{todo.title}</h3>
      {todo.memo && <p className="text-xs text-on-surface-variant line-clamp-2">{todo.memo}</p>}
      {todo.estimatedMinutes && (
        <div className="flex items-center gap-1 text-on-primary-container mt-1">
          <Timer size={12} />
          <span className="text-xs font-semibold">{formatMinutes(todo.estimatedMinutes)}</span>
        </div>
      )}
    </div>
  )
}
