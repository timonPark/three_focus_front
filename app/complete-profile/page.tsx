'use client'

import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import GenderRadioGroup from '@/components/feature/auth/GenderRadioGroup'
import TermsAgreement from '@/components/feature/auth/TermsAgreement'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { setAuthCookie } from '@/lib/actions/auth'

const schema = z.object({
  phone: z.string().min(1, '전화번호를 입력해주세요'),
  birthday: z.string().min(1, '생년월일을 입력해주세요'),
  gender: z.enum(['MALE', 'FEMALE'], { message: '성별을 선택해주세요' }),
  termsService: z.boolean().refine((v) => v === true, '서비스 이용약관에 동의해주세요'),
  termsPrivacy: z.boolean().refine((v) => v === true, '개인정보 처리방침에 동의해주세요'),
  termsMarketing: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function CompleteProfilePage() {
  const router = useRouter()
  const accessToken = useAuthStore((s) => s.accessToken)
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login')
    }
  }, [accessToken, router])

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { termsMarketing: false },
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = methods

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authService.completeProfile({
        phone: data.phone,
        birthday: data.birthday,
        gender: data.gender,
        termAgreements: [
          { termType: 'SERVICE_TERMS', agreed: data.termsService },
          { termType: 'PRIVACY_POLICY', agreed: data.termsPrivacy },
          { termType: 'MARKETING', agreed: data.termsMarketing ?? false },
        ],
      })
      setAuth(result.accessToken, result.refreshToken, result.user ?? null)
      await setAuthCookie(result.accessToken)
      router.replace('/home')
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? '프로필 완성에 실패했습니다. 다시 시도해주세요.'
      setError('root', { message: msg })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-on-surface">프로필 완성</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            서비스를 시작하기 위해 추가 정보와 약관 동의가 필요합니다.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="전화번호"
                  type="tel"
                  placeholder="010-0000-0000"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>
              <div>
                <Input
                  label="생년월일"
                  type="date"
                  error={errors.birthday?.message}
                  {...register('birthday')}
                />
              </div>
              <div className="md:col-span-2">
                <GenderRadioGroup register={register} name="gender" error={errors.gender?.message} />
              </div>
            </div>

            <TermsAgreement />

            {errors.root && (
              <p className="text-sm text-error text-center">{errors.root.message}</p>
            )}

            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              className="w-full gap-2"
            >
              시작하기
              <ArrowRight size={18} />
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
