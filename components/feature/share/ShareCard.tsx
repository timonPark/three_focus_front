import { CheckCircle, Circle } from 'lucide-react'
import type { TodoResponse } from '@/types/todo'
import { formatDateLabel } from '@/lib/utils'

interface Props {
  todos: TodoResponse[]
  date: string
  includeDetails: boolean
  includeStatus: boolean
}

export default function ShareCard({ todos, date, includeDetails, includeStatus }: Props) {
  const dateLabel = formatDateLabel(new Date(date + 'T00:00:00'))
  const completedCount = todos.filter((t) => t.completed).length

  return (
    <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-xl border border-outline-variant">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest">ThreeFocus</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface">{dateLabel}</h2>
        {includeStatus && (
          <p className="text-sm text-on-surface-variant mt-0.5">
            {completedCount}/{todos.length} 완료
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-outline-variant mb-5" />

      {/* Todo List */}
      <div className="space-y-4">
        {todos.map((todo, index) => (
          <div key={todo.id} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {includeStatus ? (
                todo.completed
                  ? <CheckCircle size={18} className="text-secondary fill-secondary" />
                  : <Circle size={18} className="text-outline" />
              ) : (
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-secondary/10 text-secondary text-[10px] font-bold">
                  {index + 1}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold leading-snug ${includeStatus && todo.completed ? 'line-through text-outline' : 'text-on-surface'}`}>
                {todo.title}
              </p>
              {includeDetails && todo.memo && (
                <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{todo.memo}</p>
              )}
              {includeDetails && todo.estimatedMinutes && (
                <span className="inline-block mt-1 text-[10px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                  {todo.estimatedMinutes < 60
                    ? `${todo.estimatedMinutes}분`
                    : `${Math.floor(todo.estimatedMinutes / 60)}시간${todo.estimatedMinutes % 60 ? ` ${todo.estimatedMinutes % 60}분` : ''}`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-outline-variant flex items-center justify-between">
        <span className="text-[10px] text-outline">three-focus.app</span>
        <div className="flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${i < completedCount ? 'bg-secondary' : 'bg-outline-variant'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
