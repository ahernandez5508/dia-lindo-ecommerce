import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = nextUrl.pathname === '/admin/login'

      if (!isLoginPage && !isLoggedIn) {
        return false
      }
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
