import type { User } from './auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    isProfileComplete?: boolean
    backendUser?: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    isProfileComplete?: boolean
    backendUser?: User
  }
}
