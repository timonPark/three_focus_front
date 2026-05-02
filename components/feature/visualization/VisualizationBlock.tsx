import type { TaskStatus } from './Top3SummaryCard'

interface Props {
  title: string
  order: number
  startTime: string
  endTime: string
  status: TaskStatus
}

export default function VisualizationBlock({ title, order, startTime, endTime, status }: Props) {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const durationMinutes = eh * 60 + em - (sh * 60 + sm)
  const heightPx = Math.max(56, (durationMinutes / 60) * 64)

  return (
    <div
      style={{ height: `${heightPx}px` }}
      className={`absolute top-0 left-2 right-2 p-3 rounded-lg z-10
        ${status === 'completed' ? 'bg-secondary-fixed/80 border border-secondary/20 text-on-secondary-fixed' : ''}
        ${status === 'active' ? 'bg-white border-2 border-secondary shadow-xl text-on-surface' : ''}
        ${status === 'pending' ? 'bg-surface-container-high border border-outline-variant text-on-surface opacity-80' : ''}`}
    >
      <div
        className={`text-xs font-semibold uppercase tracking-wide mb-0.5
          ${status === 'completed' ? 'opacity-70' : ''}
          ${status === 'active' ? 'text-secondary' : ''}
          ${status === 'pending' ? 'text-on-surface-variant' : ''}`}
      >
        핵심 과업 {String(order).padStart(2, '0')}
      </div>
      <div className="text-sm font-semibold leading-snug line-clamp-2">{title}</div>
      {status === 'active' && (
        <div className="text-xs text-secondary font-semibold uppercase mt-1">현재 진행 중</div>
      )}
    </div>
  )
}
