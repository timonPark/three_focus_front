'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Input from '@/components/common/Input'
import PasswordInput from '@/components/common/PasswordInput'
import Button from '@/components/common/Button'
import GenderRadioGroup from '@/components/feature/auth/GenderRadioGroup'
import TermsAgreement from '@/components/feature/auth/TermsAgreement'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { setAuthCookie } from '@/lib/actions/auth'

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  termsService: z.boolean().refine((v) => v === true, '서비스 이용약관에 동의해주세요'),
  termsPrivacy: z.boolean().refine((v) => v === true, '개인정보 처리방침에 동의해주세요'),
  termsMarketing: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

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
      const result = await authService.signUp(data)
      setAuth(result.accessToken, result.refreshToken, result.user)
      await setAuthCookie(result.accessToken)
      router.push('/home')
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? '회원가입에 실패했습니다. 다시 시도해주세요.'
      setError('root', { message: msg })
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full max-w-6xl">
      {/* 브랜드 사이드바 */}
      <aside className="hidden lg:flex lg:w-1/3 xl:w-2/5 bg-primary-container relative overflow-hidden p-12 flex-col justify-between">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-secondary-fixed rounded-lg flex items-center justify-center">
              <span className="text-on-secondary-fixed font-bold text-lg">!</span>
            </div>
            <span className="text-white text-2xl font-semibold tracking-tight">ThreeFocus</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            당신의 핵심 3가지에 집중하세요.
          </h1>
          <p className="text-lg text-on-primary-container max-w-sm">
            고성능 실행을 위한 미니멀한 안식처. 본질을 식별하고 시간을 되찾으세요.
          </p>
        </div>
        <div className="relative z-10">
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <p className="text-xs font-medium text-secondary-fixed mb-2 uppercase tracking-wider">생산적인 평온함</p>
            <p className="text-sm text-on-primary-container">&ldquo;고성능과 평온함이 공존하는 환경을 경험하세요.&rdquo;</p>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-fixed rounded-full opacity-20 blur-[120px]" />
        <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-primary-fixed-dim rounded-full opacity-20 blur-[100px]" />
      </aside>

      {/* 폼 영역 */}
      <main className="flex-1 bg-surface flex flex-col items-center justify-start lg:justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-xl">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-on-surface mb-2">계정 생성</h2>
            <p className="text-sm text-on-surface-variant">명료함과 고성능 실행의 공간으로 들어오세요.</p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="이름"
                    placeholder="홍길동"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="이메일 주소"
                    type="email"
                    placeholder="example@threefocus.app"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
                <div className="md:col-span-2">
                  <PasswordInput
                    label="비밀번호"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>
                <div>
                  <Input
                    label="전화번호"
                    type="tel"
                    placeholder="010-0000-0000"
                    {...register('phone')}
                  />
                </div>
                <div>
                  <Input
                    label="생년월일"
                    type="date"
                    {...register('birthDate')}
                  />
                </div>
                <div className="md:col-span-2">
                  <GenderRadioGroup register={register} name="gender" />
                </div>
              </div>

              <div className="mt-8">
                <TermsAgreement />
              </div>

              {errors.root && (
                <p className="text-sm text-error text-center">{errors.root.message}</p>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full gap-2"
                >
                  가입 완료
                  <ArrowRight size={18} />
                </Button>
                <p className="text-center mt-6 text-sm text-on-surface-variant">
                  이미 계정이 있으신가요?{' '}
                  <Link href="/login" className="text-secondary font-semibold hover:underline">
                    로그인
                  </Link>
                </p>
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
    </div>
  )
}
