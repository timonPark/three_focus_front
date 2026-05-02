import { ArrowRight } from 'lucide-react'

interface Top3ProgressBarProps {
  count: number
  onProceed: () => void
  isPending: boolean
}

export default function Top3ProgressBar({ count, onProceed, isPending }: Top3ProgressBarProps) {
  const canProceed = count === 3
  const percent = (count / 3) * 100

  return (
    <div className="sticky top-20 z-40 bg-surface-container-lowest/80 backdrop-blur-md p-5 rounded-xl shadow-sm border border-outline-variant mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex justify-between items-end">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest">
              선택 진행 상황
            </span>
            <span className="text-lg font-semibold text-secondary">{count}/3 선택됨</span>
          </div>
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <button
          onClick={onProceed}
          disabled={!canProceed || isPending}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold transition-all
            bg-primary-container text-white hover:opacity-90 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              시간 배치
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
