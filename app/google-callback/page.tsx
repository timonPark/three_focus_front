'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { setAuthCookie } from '@/lib/actions/auth'

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.replace('/login')
      return
    }

    if (session?.accessToken && session.backendUser) {
      setAuth(session.accessToken, session.refreshToken ?? '', session.backendUser)
      setAuthCookie(session.accessToken).then(() => {
        if (session.isProfileComplete === false) {
          router.replace('/complete-profile')
        } else {
          router.replace('/home')
        }
      })
    } else {
      // 백엔드 토큰 교환 실패 (409 동일 이메일 등)
      router.replace('/login?error=google-auth-failed')
    }
  }, [session, status, router, setAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-on-surface-variant">로그인 처리 중...</p>
      </div>
    </div>
  )
}
