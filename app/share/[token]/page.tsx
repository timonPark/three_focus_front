'use client'

import { use } from 'react'
import { useGetShare } from '@/hooks/useShare'
import ShareCard from '@/components/feature/share/ShareCard'
import VisualizationTimeline from '@/components/feature/visualization/VisualizationTimeline'
import Top3SummaryCard from '@/components/feature/visualization/Top3SummaryCard'
import { formatDateLabel } from '@/lib/utils'
import type { DailyScheduleItemResponse, ScheduleResponse } from '@/types/schedule'
import type { Top3Response } from '@/types/top3'
import type { TodoResponse } from '@/types/todo'

interface Props {
  params: Promise<{ token: string }>
}

function padTime(t: string): string {
  const [h, m] = t.split(':')
  return `${h.padStart(2, '0')}:${m ?? '00'}`
}

function toDaily(s: ScheduleResponse, title: string, isCompleted: boolean, orderIndex: number): DailyScheduleItemResponse {
  return {
    orderIndex,
    todoId: s.todoId,
    title,
    isCompleted,
    startTime: s.startTime ? padTime(s.startTime) : s.startTime,
    endTime: s.endTime ? padTime(s.endTime) : s.endTime,
  }
}

export default function PublicSharePage({ params }: Props) {
  const { token } = use(params)
  const { data, isLoading, isError } = useGetShare(token)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-on-surface mb-2">공유 링크를 찾을 수 없습니다</p>
          <p className="text-sm text-on-surface-variant">링크가 만료되었거나 잘못된 링크입니다.</p>
        </div>
      </div>
    )
  }

  const todos: TodoResponse[] = data.todos ?? []
  const rawSchedules: ScheduleResponse[] = data.schedules ?? []
  const hasTimeline = rawSchedules.length > 0

  // top3Data 없으면 todos.isTop3 / top3Order로 파생
  const top3Data: Top3Response[] = (data.top3Data ?? []).length > 0
    ? data.top3Data!
    : todos
        .filter((t) => t.isTop3)
        .map((t) => ({ id: t.id, todoId: t.id, date: data.date, order: t.top3Order ?? 0 }))

  const dailySchedules: DailyScheduleItemResponse[] = rawSchedules.map((s) => {
    const todo = todos.find((t) => t.id === s.todoId)
    const top3 = top3Data.find((t) => t.todoId === s.todoId)
    return toDaily(s, todo?.title ?? '', todo?.completed ?? false, top3?.order ?? 0)
  })

  // todos 없으면 dailySchedules 기준으로 pseudo-todos 구성 (타임라인 블록 렌더링용)
  const effectiveTodos: TodoResponse[] = todos.length > 0
    ? todos
    : dailySchedules.map((s) => ({
        id: s.todoId,
        title: s.title,
        completed: s.isCompleted,
        isTop3: top3Data.some((t) => t.todoId === s.todoId),
        top3Order: top3Data.find((t) => t.todoId === s.todoId)?.order,
        date: data.date,
      }))

  const sortedTop3 = [...top3Data].sort((a, b) => a.order - b.order)
  const dateLabel = formatDateLabel(new Date(data.date + 'T00:00:00'))

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest">ThreeFocus</span>
          <span className="text-sm text-on-surface-variant ml-auto">{dateLabel}</span>
        </div>

        {hasTimeline ? (
          <div className="space-y-6">
            {/* Top3 요약 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sortedTop3.map((t) => {
                const todo = effectiveTodos.find((td) => td.id === t.todoId)
                if (!todo) return null
                const schedule = dailySchedules.find((s) => s.todoId === t.todoId)
                const status = todo.completed ? 'completed' : 'pending'
                return (
                  <Top3SummaryCard
                    key={t.id}
                    todo={todo}
                    schedule={schedule}
                    order={t.order}
                    status={status}
                  />
                )
              })}
            </div>

            {/* 타임라인 */}
            <VisualizationTimeline
              schedules={dailySchedules}
              todos={effectiveTodos}
              top3Data={top3Data}
              isToday={false}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <ShareCard
              todos={effectiveTodos}
              date={data.date}
              includeDetails={data.includeDetails}
              includeStatus={data.includeStatus}
            />
          </div>
        )}

        <p className="mt-8 text-center text-xs text-on-surface-variant">
          ThreeFocus로 나만의 집중 과업을 관리해보세요.
        </p>
      </div>
    </div>
  )
}
