'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import { useTop3 } from '@/hooks/useTop3'
import { useCreateShare } from '@/hooks/useShare'
import ShareCard from '@/components/feature/share/ShareCard'
import ShareOptions from '@/components/feature/share/ShareOptions'
import ShareActions from '@/components/feature/share/ShareActions'
import { toDateString, formatDateLabel } from '@/lib/utils'

interface ShareOptions {
  includeDetails: boolean
  includeStatus: boolean
  isPrivate: boolean
}

export default function SharePage() {
  const [date, setDate] = useState(new Date())
  const [options, setOptions] = useState<ShareOptions>({
    includeDetails: false,
    includeStatus: true,
    isPrivate: false,
  })
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const dateStr = toDateString(date)
  const { data: todos = [], isLoading: todosLoading } = useTodos(dateStr)
  const { data: top3Data = [], isLoading: top3Loading } = useTop3(dateStr)
  const createShare = useCreateShare()

  const top3Todos = top3Data
    .sort((a, b) => a.order - b.order)
    .flatMap((t) => {
      const todo = todos.find((td) => td.id === t.todoId)
      return todo ? [todo] : []
    })

  const isLoading = todosLoading || top3Loading

  const handleOptionChange = (key: keyof ShareOptions, value: boolean) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
    setShareUrl(null)
  }

  const handleCreateShare = async () => {
    const result = await createShare.mutateAsync({
      date: dateStr,
      ...options,
    })
    const frontendUrl = `${window.location.origin}/share/${result.shareToken}`
    setShareUrl(frontendUrl)
    await navigator.clipboard.writeText(frontendUrl)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-semibold text-on-surface">공유하기</h1>
        <p className="text-base text-on-surface-variant mt-1">오늘의 집중 과업을 공유하세요.</p>
      </section>

      {/* Date Picker */}
      <div className="flex items-center gap-2 mb-6 w-fit bg-surface-container-low p-1 rounded-xl border border-outline-variant">
        <button
          onClick={() => { setDate((d) => new Date(d.getTime() - 86400000)); setShareUrl(null) }}
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
          onClick={() => { setDate((d) => new Date(d.getTime() + 86400000)); setShareUrl(null) }}
          className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
        >
          <ChevronRight size={18} className="text-on-surface-variant" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : top3Todos.length === 0 ? (
        <div className="text-center py-24 text-on-surface-variant">
          <p className="text-sm">이 날짜에 선택된 핵심 과업이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Preview */}
          <div>
            <h2 className="text-sm font-semibold text-on-surface-variant mb-3 uppercase tracking-wide">미리보기</h2>
            <div className="flex justify-center">
              <div ref={cardRef}>
                <ShareCard
                  todos={top3Todos}
                  date={dateStr}
                  includeDetails={options.includeDetails}
                  includeStatus={options.includeStatus}
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <h2 className="text-sm font-semibold text-on-surface-variant mb-3 uppercase tracking-wide">옵션</h2>
            <ShareOptions
              options={options}
              onChange={handleOptionChange}
            />
          </div>

          {/* Actions */}
          <ShareActions
            shareUrl={shareUrl}
            cardRef={cardRef}
            onCreateShare={handleCreateShare}
            isCreating={createShare.isPending}
          />
        </div>
      )}
    </div>
  )
}
