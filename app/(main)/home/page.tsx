'use client'

import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos'
import TodoList from '@/components/feature/todo/TodoList'
import QuickAddInput from '@/components/feature/todo/QuickAddInput'
import { toDateString } from '@/lib/utils'

const today = toDateString()

export default function HomePage() {
  const router = useRouter()

  const { data: todos = [], isLoading } = useTodos(today)
  const createTodo = useCreateTodo()
  const updateTodo = useUpdateTodo(today)
  const deleteTodo = useDeleteTodo(today)

  const handleAdd = (title: string) => {
    createTodo.mutate({ title, date: today })
  }

  const handleToggle = (id: number, completed: boolean) => {
    updateTodo.mutate({ id, data: { completed } })
  }

  const handleEdit = (id: number, title: string) => {
    updateTodo.mutate({ id, data: { title } })
  }

  const handleDelete = (id: number) => {
    deleteTodo.mutate(id)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
      {/* 헤더 */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-primary">오늘의 집중</h1>
        <p className="text-sm text-on-surface-variant mt-1">오늘 가장 중요한 과업은 무엇인가요?</p>
      </header>

      {/* 빠른 추가 */}
      <section className="mb-6">
        <QuickAddInput onAdd={handleAdd} disabled={createTodo.isPending} />
      </section>

      {/* 핵심 3가지 선택 프롬프트 */}
      <section className="mb-8">
        <div className="p-5 bg-secondary-container/10 border border-secondary-container/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-secondary flex items-center gap-2">
              <Sparkles size={18} />
              당신의 &apos;핵심 3가지&apos; 정의하기
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              가장 영향력 있는 3가지 과업을 선택해 집중하세요.
            </p>
          </div>
          <button
            onClick={() => router.push('/top3')}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
          >
            핵심 3가지 선택
          </button>
        </div>
      </section>

      {/* 할 일 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
