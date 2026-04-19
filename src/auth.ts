import NextAuth from 'next-auth'
import authConfig from './auth.config'

import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password)
          return null

        const usuario =
          await prisma.usuario.findUnique({
            where: {
              email: credentials.email as string
            }
          })

        if (!usuario) return null

        const ok = await bcrypt.compare(
          credentials.password as string,
          usuario.password
        )

        if (!ok) return null

        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email,
          role: usuario.rol
        }
      }
    })
  ]
})