//import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith('/login')
    const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth')

    // Permitir rutas de auth siempre
    if (isApiAuth) return NextResponse.next()

    // Redirigir a login si no está autenticado
    if (!isLoggedIn && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // Redirigir al dashboard si ya está autenticado e intenta entrar al login
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    //matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
    matcher: [
        '/',
        '/clientes/:path*',
        '/facturas/:path*'
    ]
}