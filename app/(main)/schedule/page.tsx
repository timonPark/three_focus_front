'use client'

import { useRouter } from 'next/navigation'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Stars } from 'lucide-react'
import { useTop3 } from '@/hooks/useTop3'
import { useTodos } from '@/hooks/useTodos'
import { useSchedules, useUpsertSchedule, useDeleteSchedule } from '@/hooks/useSchedule'
import DraggableTaskCard from '@/components/feature/schedule/DraggableTaskCard'
import TimelineGrid from '@/components/feature/schedule/TimelineGrid'
import { toDateString, addMinutesToTime } from '@/lib/utils'

const today = toDateString()

export default function SchedulePage() {
  const router = useRouter()
  const { data: top3Data = [], isLoading: top3Loading } = useTop3(today)
  const { data: todos = [], isLoading: todosLoading } = useTodos(today)
  const { data: schedules = [], isLoading: schedulesLoading } = useSchedules(today)
  const upsertSchedule = useUpsertSchedule(today)
  const deleteSchedule = useDeleteSchedule(today)

  const isLoading = top3Loading || todosLoading || schedulesLoading

  const top3Todos = top3Data
    .sort((a, b) => a.order - b.order)
    .flatMap((t) => {
      const todo = todos.find((td) => td.id === t.todoId)
      return todo ? [{ todo, order: t.order }] : []
    })

  const scheduleMap = new Map(schedules.map((s) => [s.todoId, s]))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const todoId = Number(String(active.id).replace('task-', ''))
    const hour = String(over.id).replace('slot-', '')
    const todo = top3Todos.find((t) => t.todo.id === todoId)?.todo

    upsertSchedule.mutate({
      todoId,
      date: today,
      startTime: hour,
      endTime: addMinutesToTime(hour, todo?.estimatedMinutes ?? 60),
    })
  }

  const handleUpdateSchedule = (todoId: number, startTime: string, newEndTime: string) => {
    upsertSchedule.mutate({
      todoId,
      date: today,
      startTime,
      endTime: newEndTime,
    })
  }

  const handleReset = () => {
    schedules.forEach((s) => deleteSchedule.mutate(s.todoId))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-on-surface mb-1">시간 배치</h1>
          <p className="text-base text-on-surface-variant">핵심 3가지 과업을 원하는 시간대에 배치하세요.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={schedules.length === 0}
            className="px-6 py-2 rounded-xl border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            초기화
          </button>
          <button
            onClick={() => router.push('/visualization')}
            className="px-8 py-2 rounded-xl bg-primary-container text-on-primary-container text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            하루 일정 확정
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Task Cards */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-xl font-semibold text-on-surface flex items-center gap-2">
                <Stars size={20} className="text-secondary" />
                핵심 3가지
              </h2>
              {top3Todos.map(({ todo, order }) => (
                <DraggableTaskCard
                  key={todo.id}
                  todo={todo}
                  schedule={scheduleMap.get(todo.id)}
                  order={order}
                />
              ))}
              {top3Todos.length === 0 && (
                <div className="p-6 rounded-xl border border-dashed border-outline-variant text-center text-on-surface-variant text-sm">
                  <p>핵심 3가지가 선택되지 않았습니다.</p>
                  <button
                    onClick={() => router.push('/top3')}
                    className="mt-3 text-secondary font-semibold hover:underline"
                  >
                    선택하러 가기 →
                  </button>
                </div>
              )}
            </div>

            {/* Right: Timeline */}
            <div className="lg:col-span-8">
              <TimelineGrid
                schedules={schedules}
                todos={todos}
                onRemoveSchedule={(todoId) => deleteSchedule.mutate(todoId)}
                onUpdateSchedule={handleUpdateSchedule}
              />
            </div>
          </div>
        </DndContext>
      )}
    </div>
  )
}
