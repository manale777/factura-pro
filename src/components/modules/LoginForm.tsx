'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email o contraseña incorrectos')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800 mb-1">Iniciar sesión</h1>
      <p className="text-xs text-gray-400 mb-5">Ingresa tus credenciales para continuar</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Correo electrónico</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-blue-400 transition-colors">
            <Mail size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@facturapro.bo"
              required
              className="text-sm outline-none w-full text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Contraseña</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-blue-400 transition-colors">
            <Lock size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type={mostrarPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="text-sm outline-none w-full text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
              {mostrarPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={cargando}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
          style={{ backgroundColor: 'var(--accent)' }}>
          {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

      </form>

      {/* Credenciales de prueba */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2">Credenciales de prueba:</p>
        <div className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-500 space-y-1">
          <p><span className="font-medium">Email:</span> admin@facturapro.bo</p>
          <p><span className="font-medium">Contraseña:</span> admin123</p>
        </div>
      </div>
    </div>
  )
}