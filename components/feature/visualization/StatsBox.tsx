interface Props {
  completedCount: number
  totalCount: number
}

export default function StatsBox({ completedCount, totalCount }: Props) {
  const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="bg-primary-container p-6 rounded-xl h-40 flex flex-col justify-end relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 right-4 w-28 h-28 rounded-full border-4 border-white/10" />
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full border-4 border-white/10" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border-4 border-white/5" />
      </div>
      <div className="relative z-10">
        <div className="text-4xl font-bold text-white leading-tight">{rate}%</div>
        <div className="text-sm text-on-primary-container mt-1">일일 달성률</div>
        <div className="text-xs text-on-primary-container/60 mt-0.5">
          {completedCount} / {totalCount} 완료
        </div>
      </div>
    </div>
  )
}
