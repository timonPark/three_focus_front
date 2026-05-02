'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Input from '@/components/common/Input'
import PasswordInput from '@/components/common/PasswordInput'
import Button from '@/components/common/Button'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { setAuthCookie } from '@/lib/actions/auth'

const schema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authService.login(data)
      setAuth(result.accessToken, result.refreshToken, result.user)
      await setAuthCookie(result.accessToken)
      router.push('/home')
    } catch {
      setError('root', { message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/google-callback' })
  }

  return (
    <div className="w-full max-w-[1200px] grid lg:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(15,23,42,0.05)] overflow-hidden">
      {/* 브랜드 사이드 */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary-container relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-semibold tracking-tight text-white">ThreeFocus</h2>
          <p className="text-base text-on-primary-container opacity-80 mt-1">생산적인 평온함</p>
        </div>
        <div className="relative z-10 mb-6">
          <h3 className="text-2xl font-semibold text-white mb-3">
            매일 가장 중요한 세 가지 과업을 확인하고 실행하세요.
          </h3>
          <p className="text-lg text-on-primary-container opacity-70">
            본질주의 철학을 통해 인지적 부하를 줄이고 당신의 시간을 되찾으세요.
          </p>
        </div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-secondary-fixed rounded-full opacity-10 blur-3xl" />
      </div>

      {/* 폼 영역 */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 bg-surface-container-lowest">
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl font-semibold text-on-surface">로그인</h1>
          <p className="text-sm text-on-surface-variant mt-1">집중의 시간을 찾기 위해 로그인하세요.</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full py-3 px-4 border border-outline-variant rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors mb-6 gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          구글로 시작하기
        </button>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-outline-variant" />
          <span className="mx-4 text-xs font-medium text-outline uppercase tracking-widest">또는 이메일로 로그인</span>
          <div className="flex-grow border-t border-outline-variant" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="이메일 주소"
            type="email"
            placeholder="name@company.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-on-surface">비밀번호</span>
              <button type="button" className="text-xs text-secondary hover:underline">
                비밀번호 찾기
              </button>
            </div>
            <PasswordInput
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          {errors.root && (
            <p className="text-sm text-error text-center">{errors.root.message}</p>
          )}

          <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2">
            로그인
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-on-surface-variant">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-secondary font-semibold hover:underline ml-1">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
