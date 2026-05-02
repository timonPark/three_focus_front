'use server'

import { cookies } from 'next/headers'

export async function setAuthCookie(accessToken: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}
