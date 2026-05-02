'use client'

import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { ChevronRight } from 'lucide-react'

const TERMS = [
  {
    key: 'termsService',
    label: '서비스 이용약관',
    desc: '운영 가이드라인 및 사용자 행동 수칙에 동의합니다.',
    required: true,
  },
  {
    key: 'termsPrivacy',
    label: '개인정보 처리방침',
    desc: '정책에 기술된 데이터 처리 방식에 동의합니다.',
    required: true,
  },
  {
    key: 'termsMarketing',
    label: '마케팅 정보 수신 동의',
    desc: '생산성 팁, 새로운 기능 소식 및 정기 뉴스레터를 수신합니다.',
    required: false,
  },
] as const

export default function TermsAgreement() {
  const { register, setValue, control, formState: { errors } } = useFormContext()

  const termsService = useWatch({ control, name: 'termsService' })
  const termsPrivacy = useWatch({ control, name: 'termsPrivacy' })
  const termsMarketing = useWatch({ control, name: 'termsMarketing' })

  const allChecked = !!(termsService && termsPrivacy && termsMarketing)

  const handleAllChange = (checked: boolean) => {
    setValue('termsService', checked, { shouldValidate: true })
    setValue('termsPrivacy', checked, { shouldValidate: true })
    setValue('termsMarketing', checked)
  }

  return (
    <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-container">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => handleAllChange(e.target.checked)}
            className="w-5 h-5 rounded border-outline-variant accent-secondary"
          />
          <span className="text-base font-semibold text-on-surface">전체 동의</span>
        </label>
        <span className="text-xs text-outline">선택 &amp; 필수</span>
      </div>
      <div className="space-y-6">
        {TERMS.map(({ key, label, desc, required }) => (
          <div key={key} className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id={key}
                {...register(key)}
                className="mt-1 w-5 h-5 rounded border-outline-variant accent-secondary"
              />
              <div>
                <label htmlFor={key} className="block text-sm font-semibold text-on-surface cursor-pointer">
                  {label}{' '}
                  <span className={`text-xs font-normal ml-1 ${required ? 'text-error' : 'text-on-surface-variant'}`}>
                    ({required ? '필수' : '선택'})
                  </span>
                </label>
                <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
              </div>
            </div>
            <button type="button" className="flex items-center text-xs text-secondary hover:underline shrink-0">
              내용 보기 <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
      {(errors.termsService || errors.termsPrivacy) && (
        <p className="mt-3 text-xs text-error">필수 약관에 동의해주세요.</p>
      )}
    </div>
  )
}
