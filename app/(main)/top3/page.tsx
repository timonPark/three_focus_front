'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import { useTop3, useSetTop3 } from '@/hooks/useTop3'
import Top3Card from '@/components/feature/top3/Top3Card'
import Top3ProgressBar from '@/components/feature/top3/Top3ProgressBar'
import { toDateString } from '@/lib/utils'

const today = toDateString()

export default function Top3Page() {
  const router = useRouter()
  const { data: todos = [], isLoading: todosLoading } = useTodos(today)
  const { data: top3Data, isLoading: top3Loading } = useTop3(today)
  const setTop3 = useSetTop3()

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // 기존 top3 데이터로 초기화
  useEffect(() => {
    if (top3Data && top3Data.length > 0) {
      const sorted = [...top3Data].sort((a, b) => a.order - b.order)
      setSelectedIds(sorted.map((t) => t.todoId))
    }
  }, [top3Data])

  const pendingTodos = todos.filter((t) => !t.completed)

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const handleProceed = async () => {
    await setTop3.mutateAsync({ todoIds: selectedIds, date: today })
    router.push('/schedule')
  }

  const isLoading = todosLoading || top3Loading

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
      {/* 헤더 */}
      <header className="mb-8 text-center lg:text-left">
        <h1 className="text-3xl font-semibold text-on-surface mb-2">핵심 3가지 선택</h1>
        <p className="text-base text-on-surface-variant max-w-2xl">
          소음을 잠재우세요. 어떤 3가지 과업이 오늘 가장 큰 변화를 만들까요? 신중하게 선택하세요.
        </p>
      </header>

      {/* 진행 상황 바 */}
      <Top3ProgressBar
        count={selectedIds.length}
        onProceed={handleProceed}
        isPending={setTop3.isPending}
      />

      {/* 로딩 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingTodos.map((todo) => {
            const selectedIndex = selectedIds.indexOf(todo.id)
            const selected = selectedIndex !== -1
            return (
              <Top3Card
                key={todo.id}
                todo={todo}
                selected={selected}
                order={selected ? selectedIndex + 1 : undefined}
                onToggle={handleToggle}
              />
            )
          })}

          {/* 새로운 할 일 추가 플레이스홀더 */}
          <div
            onClick={() => router.push('/home')}
            className="bg-surface-container-low p-6 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-surface-container-lowest hover:border-secondary transition-all min-h-[220px]"
          >
            <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <Plus size={28} />
            </div>
            <div>
              <p className="text-base font-semibold text-on-surface-variant">새로운 할 일 추가</p>
              <p className="text-xs text-on-primary-container mt-1">머릿속의 생각을 기록하세요</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
