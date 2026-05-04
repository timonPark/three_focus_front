import { X, Plus, Minus } from 'lucide-react'
import type { TodoResponse } from '@/types/todo'
import type { DailyScheduleItemResponse } from '@/types/schedule'
import { addMinutesToTime, parseTimeString, formatMinutes } from '@/lib/utils'

interface Props {
  todo: TodoResponse
  schedule: DailyScheduleItemResponse
  onRemove: () => void
  onUpdateDuration: (newMinutes: number) => void
}

export default function ScheduledBlock({ todo, schedule, onRemove, onUpdateDuration }: Props) {
  const startTime = parseTimeString(schedule.startTime)
  const endTime = schedule.endTime ? parseTimeString(schedule.endTime) : addMinutesToTime(startTime, todo.estimatedMinutes ?? 60)

  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const durationMinutes = eh * 60 + em - (sh * 60 + sm)
  const heightPx = Math.max(56, (durationMinutes / 60) * 64)

  return (
    <div
      style={{ height: `${heightPx}px` }}
      className="absolute top-0 left-2 right-2 bg-secondary/10 border-l-4 border-secondary rounded-r-lg p-3 z-10 flex flex-col justify-between group"
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
      {/* Controls */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-surface-container-highest rounded-md shadow-sm border border-outline-variant overflow-hidden z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); onUpdateDuration(Math.max(30, durationMinutes - 30)) }}
          disabled={durationMinutes <= 30}
          className="p-1 text-on-surface-variant hover:text-secondary hover:bg-surface-container disabled:opacity-30 transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="text-[10px] font-semibold text-on-surface-variant px-1 text-center min-w-[36px]">
          {formatMinutes(durationMinutes)}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onUpdateDuration(Math.min(1440, durationMinutes + 30)) }}
          className="p-1 text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}
