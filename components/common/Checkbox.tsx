import { InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const inputId = id ?? label

    return (
      <label
        htmlFor={inputId}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`w-4 h-4 rounded-sm border-2 border-outline accent-secondary cursor-pointer ${className}`}
          {...props}
        />
        {label && (
          <span className="text-sm text-on-surface">{label}</span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
