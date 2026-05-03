import { CheckCircle, Clock } from 'lucide-react'
import type { TodoResponse } from '@/types/todo'
import type { DailyScheduleItemResponse } from '@/types/schedule'

export type TaskStatus = 'completed' | 'active' | 'pending'

interface Props {
  todo: TodoResponse
  schedule?: DailyScheduleItemResponse
  order: number
  status: TaskStatus
}

export default function Top3SummaryCard({ todo, schedule, order, status }: Props) {
  return (
    <div
      className={`p-3 rounded-lg transition-all
        ${status === 'completed' ? 'bg-surface-bright border-l-4 border-secondary shadow-sm' : ''}
        ${status === 'active' ? 'bg-white border-l-4 border-primary-fixed-dim shadow-md ring-2 ring-secondary/20' : ''}
        ${status === 'pending' ? 'bg-surface-bright border-l-4 border-outline-variant opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold uppercase tracking-wide
            ${status === 'completed' ? 'text-secondary' : ''}
            ${status === 'active' ? 'text-on-primary-container' : ''}
            ${status === 'pending' ? 'text-outline' : ''}`}
        >
          핵심 과업 {String(order).padStart(2, '0')}
        </span>
        {status === 'completed' && <CheckCircle size={16} className="text-secondary fill-secondary" />}
        {status === 'active' && <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />}
      </div>
      <h3 className="text-base font-semibold text-on-surface mt-1 leading-snug">{todo.title}</h3>
      {schedule && (
        <div className="flex items-center gap-1.5 mt-2 text-on-surface-variant">
          <Clock size={12} />
          <span className="text-xs">{schedule.startTime}{schedule.endTime ? ` - ${schedule.endTime}` : ''}</span>
        </div>
      )}
    </div>
  )
}
