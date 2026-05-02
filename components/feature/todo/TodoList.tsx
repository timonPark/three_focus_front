import type { TodoResponse } from '@/types/todo'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: TodoResponse[]
  onToggle: (id: number, completed: boolean) => void
  onEdit: (id: number, title: string) => void
  onDelete: (id: number) => void
}

export default function TodoList({ todos, onToggle, onEdit, onDelete }: TodoListProps) {
  const pending = todos.filter((t) => !t.completed)
  const completed = todos.filter((t) => t.completed)

  return (
    <div className="space-y-8">
      {/* 진행 중 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            진행 중인 과업
          </h2>
          <span className="text-xs text-on-surface-variant">총 {pending.length}개</span>
        </div>
        {pending.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-8">
            오늘의 할 일을 추가해보세요.
          </p>
        ) : (
          pending.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </section>

      {/* 완료됨 */}
      {completed.length > 0 && (
        <section className="space-y-3 opacity-50">
          <div className="flex items-center px-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              완료됨
            </h2>
          </div>
          {completed.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </section>
      )}
    </div>
  )
}
