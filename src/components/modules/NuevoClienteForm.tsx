'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const inputClass =
  'px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors text-gray-700 bg-white w-full'

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  )
}

const CIUDADES = [
  'La Paz', 'El Alto', 'Cochabamba', 'Santa Cruz',
  'Oruro', 'Potosí', 'Sucre', 'Trinidad', 'Cobija',
]

export default function NuevoClienteForm() {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    nit: '',
    telefono: '',
    email: '',
    ciudad: '',
    direccion: '',
  })

  function actualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function validar() {
    if (!form.nombre.trim()) return 'El nombre es obligatorio'
    if (!form.nit.trim()) return 'El NIT o CI es obligatorio'
    return ''
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    const mensajeError = validar()
    if (mensajeError) { setError(mensajeError); return }

    setError('')
    setGuardando(true)

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Error al guardar')
      }

      const cliente = await res.json()
      router.push(`/clientes/${cliente.id}`)
    } catch (e: any) {
      setError(e.message ?? 'Ocurrió un error. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">

      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <Link href="/clientes"
          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-xs text-gray-400">Clientes / Nuevo</p>
          <h1 className="text-lg font-semibold text-gray-800">Nuevo cliente</h1>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={guardar}>
        <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-5">

          {/* Datos fiscales */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Datos fiscales
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Razón social / Nombre completo *">
                <input
                  className={inputClass}
                  placeholder="Ej. Comercial López S.R.L."
                  value={form.nombre}
                  onChange={(e) => actualizar('nombre', e.target.value)}
                />
              </Campo>
              <Campo label="NIT / Cédula de identidad *">
                <input
                  className={inputClass}
                  placeholder="Ej. 7890123"
                  value={form.nit}
                  onChange={(e) => actualizar('nit', e.target.value)}
                />
              </Campo>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Contacto
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Teléfono">
                <input
                  className={inputClass}
                  placeholder="+591 7XXXXXXX"
                  value={form.telefono}
                  onChange={(e) => actualizar('telefono', e.target.value)}
                />
              </Campo>
              <Campo label="Correo electrónico">
                <input
                  type="email"
                  className={inputClass}
                  placeholder="correo@empresa.com"
                  value={form.email}
                  onChange={(e) => actualizar('email', e.target.value)}
                />
              </Campo>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Ubicación
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Ciudad">
                <select
                  className={inputClass}
                  value={form.ciudad}
                  onChange={(e) => actualizar('ciudad', e.target.value)}>
                  <option value="">— Selecciona —</option>
                  {CIUDADES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Dirección">
                <input
                  className={inputClass}
                  placeholder="Av. / Calle, número"
                  value={form.direccion}
                  onChange={(e) => actualizar('direccion', e.target.value)}
                />
              </Campo>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}>
              {guardando ? 'Guardando...' : 'Guardar cliente'}
            </button>
            <Link href="/clientes"
              className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
          </div>

        </div>
      </form>
    </div>
  )
}