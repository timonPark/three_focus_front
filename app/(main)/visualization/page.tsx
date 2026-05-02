'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Calendar, Share2 } from 'lucide-react'
import { useTop3 } from '@/hooks/useTop3'
import { useTodos } from '@/hooks/useTodos'
import { useSchedules } from '@/hooks/useSchedule'
import Top3SummaryCard from '@/components/feature/visualization/Top3SummaryCard'
import StatsBox from '@/components/feature/visualization/StatsBox'
import VisualizationTimeline from '@/components/feature/visualization/VisualizationTimeline'
import type { TaskStatus } from '@/components/feature/visualization/Top3SummaryCard'
import type { TodoResponse } from '@/types/todo'
import type { ScheduleResponse } from '@/types/schedule'
import { toDateString, formatDateLabel } from '@/lib/utils'

function getTaskStatus(todo: TodoResponse, schedule: ScheduleResponse | undefined, isToday: boolean): TaskStatus {
  if (todo.completed) return 'completed'
  if (!schedule || !isToday) return 'pending'
  const now = new Date()
  const curr = now.getHours() * 60 + now.getMinutes()
  const [sh, sm] = schedule.startTime.split(':').map(Number)
  const [eh, em] = schedule.endTime.split(':').map(Number)
  if (curr >= sh * 60 + sm && curr < eh * 60 + em) return 'active'
  return 'pending'
}

export default function VisualizationPage() {
  const router = useRouter()
  const [date, setDate] = useState(new Date())

  const dateStr = toDateString(date)
  const isToday = dateStr === toDateString()

  const { data: top3Data = [], isLoading: top3Loading } = useTop3(dateStr)
  const { data: todos = [], isLoading: todosLoading } = useTodos(dateStr)
  const { data: schedules = [], isLoading: schedulesLoading } = useSchedules(dateStr)

  const isLoading = top3Loading || todosLoading || schedulesLoading

  const top3Todos = top3Data
    .sort((a, b) => a.order - b.order)
    .flatMap((t) => {
      const todo = todos.find((td) => td.id === t.todoId)
      return todo ? [{ todo, order: t.order }] : []
    })

  const scheduleMap = new Map(schedules.map((s) => [s.todoId, s]))
  const completedCount = top3Todos.filter((t) => t.todo.completed).length

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-on-surface">일간 타임라인</h1>
          <p className="text-base text-on-surface-variant mt-1">세 가지 핵심 성취를 향한 여정을 확인하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Picker */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant">
            <button
              onClick={() => setDate((d) => new Date(d.getTime() - 86400000))}
              className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
            >
              <ChevronLeft size={18} className="text-on-surface-variant" />
            </button>
            <div className="flex items-center gap-2 px-3">
              <Calendar size={15} className="text-secondary" />
              <span className="text-sm font-semibold text-on-surface whitespace-nowrap">
                {formatDateLabel(date)}
              </span>
            </div>
            <button
              onClick={() => setDate((d) => new Date(d.getTime() + 86400000))}
              className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
            >
              <ChevronRight size={18} className="text-on-surface-variant" />
            </button>
          </div>
          <button
            onClick={() => router.push('/share')}
            className="p-2.5 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors text-on-surface-variant"
            title="공유"
          >
            <Share2 size={18} />
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Left: Summary + Stats */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-on-surface">핵심 3가지</h2>
                <span className="text-xs font-semibold bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full">
                  {top3Todos.length}가지 과업
                </span>
              </div>
              {top3Todos.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-on-surface-variant mb-3">선택된 핵심 과업이 없습니다.</p>
                  <button
                    onClick={() => router.push('/top3')}
                    className="text-sm text-secondary font-semibold hover:underline"
                  >
                    선택하러 가기 →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {top3Todos.map(({ todo, order }) => (
                    <Top3SummaryCard
                      key={todo.id}
                      todo={todo}
                      schedule={scheduleMap.get(todo.id)}
                      order={order}
                      status={getTaskStatus(todo, scheduleMap.get(todo.id), isToday)}
                    />
                  ))}
                </div>
              )}
            </div>
            <StatsBox completedCount={completedCount} totalCount={top3Todos.length} />
          </div>

          {/* Right: Timeline */}
          <div className="xl:col-span-8">
            <VisualizationTimeline
              schedules={schedules}
              todos={todos}
              top3Data={top3Data}
              isToday={isToday}
            />
          </div>
        </div>
      )}
    </div>
  )
}
