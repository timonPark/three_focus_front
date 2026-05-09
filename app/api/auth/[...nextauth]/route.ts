import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === 'google' && account.id_token) {
        try {
          const res = await fetch(
            `${process.env.API_URL}/api/auth/google`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken: account.id_token }),
            }
          )
          if (res.ok) {
            const data = await res.json()
            token.accessToken = data.accessToken
            token.refreshToken = data.refreshToken
            token.isProfileComplete = data.isProfileComplete
            if (data.user) {
              token.backendUser = data.user
            } else {
              // 백엔드가 user를 반환하지 않을 때 JWT payload + Google 프로필로 구성
              const payload = JSON.parse(
                Buffer.from(data.accessToken.split('.')[1], 'base64url').toString()
              )
              token.backendUser = {
                id: Number(payload.sub),
                name: (profile as any)?.name ?? token.name ?? '',
                email: (profile as any)?.email ?? token.email ?? '',
              }
            }
          }
        } catch {
          // 백엔드 연결 실패 시 클라이언트에서 처리
        }
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.isProfileComplete = token.isProfileComplete
      session.backendUser = token.backendUser
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
