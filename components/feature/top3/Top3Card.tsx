import { Star, Timer } from 'lucide-react'
import type { TodoResponse } from '@/types/todo'
import { formatMinutes } from '@/lib/utils'

interface Top3CardProps {
  todo: TodoResponse
  selected: boolean
  order?: number
  onToggle: (id: number) => void
}

export default function Top3Card({ todo, selected, order, onToggle }: Top3CardProps) {
  return (
    <div
      onClick={() => onToggle(todo.id)}
      className={`relative bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.05)] flex flex-col cursor-pointer transition-all hover:shadow-md min-h-[220px]
        ${selected ? 'border-2 border-secondary' : 'border border-outline-variant hover:border-secondary/40'}`}
    >
      {/* 별 아이콘 */}
      <div
        className={`absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center transition-all
          ${selected ? 'bg-secondary text-on-secondary' : 'border border-outline-variant text-on-surface-variant group-hover:border-secondary group-hover:text-secondary'}`}
      >
        <Star size={16} fill={selected ? 'currentColor' : 'none'} />
      </div>

      <div className="flex flex-col flex-1">
        {/* 상태 배지 */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold
              ${selected ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}
          >
            {selected ? `핵심 ${order}` : '미선택'}
          </span>
        </div>

        {/* 제목 */}
        <h2 className="text-base font-semibold text-on-surface mb-2 leading-snug">{todo.title}</h2>

        {/* 메모 */}
        {todo.memo && (
          <p className="text-xs text-on-surface-variant flex-1 line-clamp-2">{todo.memo}</p>
        )}

        {/* 예상 시간 */}
        {todo.estimatedMinutes && (
          <div className="mt-6 flex items-center gap-1.5 text-on-primary-container">
            <Timer size={14} />
            <span className="text-xs font-semibold">{formatMinutes(todo.estimatedMinutes)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
