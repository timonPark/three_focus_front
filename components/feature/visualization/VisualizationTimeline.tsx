import CurrentTimeIndicator from '../schedule/CurrentTimeIndicator'
import VisualizationBlock from './VisualizationBlock'
import type { TaskStatus } from './Top3SummaryCard'
import type { ScheduleResponse } from '@/types/schedule'
import type { TodoResponse } from '@/types/todo'
import type { Top3Response } from '@/types/top3'

const HOURS = Array.from({ length: 18 }, (_, i) => `${String(i + 5).padStart(2, '0')}:00`)

function getTaskStatus(todo: TodoResponse, schedule: ScheduleResponse, isToday: boolean): TaskStatus {
  if (todo.completed) return 'completed'
  if (!isToday) return 'pending'
  const now = new Date()
  const curr = now.getHours() * 60 + now.getMinutes()
  const [sh, sm] = schedule.startTime.split(':').map(Number)
  const [eh, em] = schedule.endTime.split(':').map(Number)
  if (curr >= sh * 60 + sm && curr < eh * 60 + em) return 'active'
  return 'pending'
}

function formatHourLabel(hour: string): string {
  const h = parseInt(hour)
  const period = h < 12 ? '오전' : '오후'
  const h12 = h % 12 || 12
  return `${period} ${h12}:00`
}

interface Props {
  schedules: ScheduleResponse[]
  todos: TodoResponse[]
  top3Data: Top3Response[]
  isToday: boolean
}

export default function VisualizationTimeline({ schedules, todos, top3Data, isToday }: Props) {
  const top3OrderMap = new Map(top3Data.map((t) => [t.todoId, t.order]))

  return (
    <div className="bg-surface-container-low rounded-xl border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-white/50">
        <h2 className="text-xl font-semibold text-on-surface">타임라인</h2>
      </div>
      <div className="relative h-[600px] overflow-y-auto scrollbar-hide p-6">
        {HOURS.map((hour) => {
          const schedule = schedules.find((s) => s.startTime.slice(0, 2) === hour.slice(0, 2))
          const todo = schedule ? todos.find((t) => t.id === schedule.todoId) : undefined
          const order = schedule ? (top3OrderMap.get(schedule.todoId) ?? 0) : 0
          const status = schedule && todo ? getTaskStatus(todo, schedule, isToday) : undefined

          return (
            <div key={hour} className="flex h-16 border-t border-slate-200 relative">
              <span className="w-20 shrink-0 text-xs font-semibold text-on-surface-variant pt-2">
                {formatHourLabel(hour)}
              </span>
              <div className="flex-1 relative">
                {schedule && todo && status && (
                  <VisualizationBlock
                    title={todo.title}
                    order={order}
                    startTime={schedule.startTime}
                    endTime={schedule.endTime}
                    status={status}
                  />
                )}
              </div>
            </div>
          )
        })}
        {isToday && <CurrentTimeIndicator offsetClass="left-20" />}
      </div>
    </div>
  )
}
