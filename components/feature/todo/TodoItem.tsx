'use client'

import { useState, useRef, useEffect } from 'react'
import { Pencil, Trash2, Clock } from 'lucide-react'
import type { TodoResponse } from '@/types/todo'
import { formatMinutes } from '@/lib/utils'

const TOP3_LABEL = ['핵심 1', '핵심 2', '핵심 3']

interface TodoItemProps {
  todo: TodoResponse
  onToggle: (id: number, completed: boolean) => void
  onEdit: (id: number, title: string) => void
  onDelete: (id: number) => void
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const saveEdit = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== todo.title) onEdit(todo.id, trimmed)
    setEditing(false)
  }

  const borderClass = todo.completed
    ? 'border-outline-variant'
    : todo.isTop3
    ? 'border-secondary'
    : 'border-surface-container-high'

  return (
    <div
      className={`group relative bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.05)] border-l-4 transition-all hover:shadow-md ${borderClass} ${
        todo.completed ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* 체크박스 */}
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
            todo.completed
              ? 'bg-secondary border-secondary'
              : 'border-outline-variant hover:border-secondary'
          }`}
        >
          {todo.completed && (
            <svg className="w-3.5 h-3.5 text-on-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {editing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit()
                  if (e.key === 'Escape') { setEditValue(todo.title); setEditing(false) }
                }}
                className="flex-1 text-base font-semibold text-primary bg-transparent border-b border-secondary outline-none"
              />
            ) : (
              <h3
                className={`text-base font-semibold text-primary ${todo.completed ? 'line-through text-on-surface-variant' : ''}`}
              >
                {todo.title}
              </h3>
            )}
            {todo.isTop3 && todo.top3Order != null && (
              <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-xs font-semibold rounded-full shrink-0">
                {TOP3_LABEL[todo.top3Order - 1]}
              </span>
            )}
          </div>
          {todo.estimatedMinutes && (
            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              <Clock size={12} />
              <span>{formatMinutes(todo.estimatedMinutes)}</span>
            </div>
          )}
        </div>

        {/* 액션 버튼 (hover 시 노출) */}
        {!todo.completed && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-md"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-md"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
