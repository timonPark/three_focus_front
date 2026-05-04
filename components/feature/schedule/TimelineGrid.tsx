import TimelineSlot from './TimelineSlot'
import ScheduledBlock from './ScheduledBlock'
import CurrentTimeIndicator from './CurrentTimeIndicator'
import type { DailyScheduleItemResponse } from '@/types/schedule'
import type { TodoResponse } from '@/types/todo'
import { parseTimeString, addMinutesToTime } from '@/lib/utils'

const HOURS = Array.from({ length: 18 }, (_, i) => `${String(i + 5).padStart(2, '0')}:00`)

interface Props {
  schedules: DailyScheduleItemResponse[]
  todos: TodoResponse[]
  onRemoveSchedule: (todoId: number) => void
  onUpdateSchedule: (todoId: number, startTime: string, newEndTime: string) => void
}

export default function TimelineGrid({ schedules, todos, onRemoveSchedule, onUpdateSchedule }: Props) {
  const handleUpdateDuration = (schedule: DailyScheduleItemResponse, newMinutes: number) => {
    const startTime = parseTimeString(schedule.startTime)
    const newEndTime = addMinutesToTime(startTime, newMinutes)
    onUpdateSchedule(schedule.todoId, startTime, newEndTime)
  }
  return (
    <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant overflow-hidden">
      <h2 className="text-xl font-semibold text-on-surface mb-4">오늘의 타임라인</h2>
      <div className="h-[600px] overflow-y-auto pr-2 scrollbar-hide relative">
        {HOURS.map((hour) => {
          const schedule = schedules.find((s) => {
            if (!s.startTime) return false
            const timeStr = parseTimeString(s.startTime)
            return timeStr.slice(0, 2) === hour.slice(0, 2)
          })
          const todo = schedule ? todos.find((t) => t.id === schedule.todoId) : undefined

          return (
            <TimelineSlot key={hour} hour={hour} hasBlock={!!schedule}>
              {schedule && todo && (
                <ScheduledBlock
                  todo={todo}
                  schedule={schedule}
                  onRemove={() => onRemoveSchedule(schedule.todoId)}
                  onUpdateDuration={(newMinutes) => handleUpdateDuration(schedule, newMinutes)}
                />
              )}
            </TimelineSlot>
          )
        })}
        <CurrentTimeIndicator />
      </div>
    </div>
  )
}
