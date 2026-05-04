interface Options {
  includeDetails: boolean
  includeStatus: boolean
  isPrivate: boolean
}

interface Props {
  options: Options
  onChange: (key: keyof Options, value: boolean) => void
}

const OPTION_LIST: { key: keyof Options; label: string; description: string }[] = [
  { key: 'includeDetails', label: '과업 상세 포함', description: '메모, 예상 소요 시간을 함께 표시합니다' },
  { key: 'includeStatus', label: '완료 상태 표시', description: '완료된 과업에 체크 표시를 합니다' },
  { key: 'isPrivate', label: '비공개 링크', description: '링크를 아는 사람만 볼 수 있습니다' },
]

export default function ShareOptions({ options, onChange }: Props) {
  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant divide-y divide-outline-variant">
      {OPTION_LIST.map(({ key, label, description }) => (
        <label key={key} className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-surface-container transition-colors">
          <div>
            <p className="text-sm font-semibold text-on-surface">{label}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
          </div>
          <div className="relative ml-4 flex-shrink-0">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-outline-variant rounded-full peer peer-checked:bg-secondary transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
        </label>
      ))}
    </div>
  )
}
