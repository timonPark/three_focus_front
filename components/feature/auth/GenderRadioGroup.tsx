import { UseFormRegister } from 'react-hook-form'

const GENDER_OPTIONS = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
] as const

interface GenderRadioGroupProps {
  register: UseFormRegister<any>
  name: string
  error?: string
}

export default function GenderRadioGroup({ register, name, error }: GenderRadioGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-on-surface">성별</span>
      <div className="flex gap-3">
        {GENDER_OPTIONS.map(({ value, label }) => (
          <label key={value} className="flex-1 cursor-pointer">
            <input type="radio" value={value} {...register(name)} className="peer hidden" />
            <div className="p-3 text-center rounded-lg bg-surface-container-low border border-transparent text-sm text-on-surface transition-all peer-checked:bg-secondary-container peer-checked:text-on-secondary-container peer-checked:border-secondary">
              {label}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}
