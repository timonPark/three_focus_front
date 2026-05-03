import { X } from 'lucide-react'
import type { TodoResponse } from '@/types/todo'
import type { DailyScheduleItemResponse } from '@/types/schedule'
import { addMinutesToTime } from '@/lib/utils'

interface Props {
  todo: TodoResponse
  schedule: DailyScheduleItemResponse
  onRemove: () => void
}

export default function ScheduledBlock({ todo, schedule, onRemove }: Props) {
  const startTime = schedule.startTime ?? '00:00'
  const endTime = schedule.endTime ?? addMinutesToTime(startTime, todo.estimatedMinutes ?? 60)

  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const durationMinutes = eh * 60 + em - (sh * 60 + sm)
  const heightPx = Math.max(56, (durationMinutes / 60) * 64)

  return (
    <div
      style={{ height: `${heightPx}px` }}
      className="absolute top-0 left-2 right-2 bg-secondary/10 border-l-4 border-secondary rounded-r-lg p-3 z-10 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-xs font-semibold text-secondary leading-snug line-clamp-2">{todo.title}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="shrink-0 text-on-surface-variant hover:text-error transition-colors"
        >
          <X size={12} />
        </button>
      </div>
      <span className="text-xs text-on-surface-variant">
        {startTime} - {endTime}
      </span>
    </div>
  )
}
