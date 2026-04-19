import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'

export default {
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },

      async authorize() {
        return null
      }
    }),
  ],
} satisfies NextAuthConfig