'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Check } from 'lucide-react'

const inputClass =
  'px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors text-gray-700 bg-white w-full'

const CIUDADES = [
  'La Paz', 'El Alto', 'Cochabamba', 'Santa Cruz',
  'Oruro', 'Potosí', 'Sucre', 'Trinidad', 'Cobija',
]

export default function EditarClienteModal({
  cliente,
  onClose,
}: {
  cliente: any
  onClose: () => void
}) {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)

  const [form, setForm] = useState({
    nombre: cliente.nombre,
    nit: cliente.nit,
    telefono: cliente.telefono ?? '',
    email: cliente.email ?? '',
    ciudad: cliente.ciudad ?? '',
    direccion: cliente.direccion ?? '',
  })

  function actualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function guardar() {
    setGuardando(true)
    try {
      const res = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      router.refresh()
      onClose()
    } catch {
      alert('Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  // 🔥 Cerrar con ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay oscuro */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 animate-scaleIn">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Editar cliente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Nombre</label>
            <input className={inputClass} value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">NIT</label>
            <input className={inputClass} value={form.nit} onChange={(e) => actualizar('nit', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">Teléfono</label>
            <input className={inputClass} value={form.telefono} onChange={(e) => actualizar('telefono', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <input className={inputClass} value={form.email} onChange={(e) => actualizar('email', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">Ciudad</label>
            <select className={inputClass} value={form.ciudad} onChange={(e) => actualizar('ciudad', e.target.value)}>
              <option value="">— Selecciona —</option>
              {CIUDADES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Dirección</label>
            <input className={inputClass} value={form.direccion} onChange={(e) => actualizar('direccion', e.target.value)} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 mt-4 border-t">
          <button
            onClick={guardar}
            disabled={guardando}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}>
            <Check size={13} />
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">
            <X size={13} />
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}