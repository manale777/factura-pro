'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, X, Check } from 'lucide-react'

const inputClass =
  'px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors text-gray-700 bg-white w-full'

const CIUDADES = [
  'La Paz', 'El Alto', 'Cochabamba', 'Santa Cruz',
  'Oruro', 'Potosí', 'Sucre', 'Trinidad', 'Cobija',
]

export default function EditarClienteForm({ cliente }: { cliente: any }) {
  const router = useRouter()
  const [editando, setEditando] = useState(false)
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
      if (!res.ok) throw new Error('Error al guardar')
      setEditando(false)
      router.refresh()
    } catch {
      alert('Error al guardar los cambios')
    } finally {
      setGuardando(false)
    }
  }

  if (!editando) {
    return (
      <button
        onClick={() => setEditando(true)}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
        <Pencil size={13} />
        Editar
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-blue-200 p-4 space-y-3 mt-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Editar datos</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Nombre</label>
          <input className={inputClass} value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">NIT</label>
          <input className={inputClass} value={form.nit} onChange={(e) => actualizar('nit', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Teléfono</label>
          <input className={inputClass} value={form.telefono} onChange={(e) => actualizar('telefono', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Email</label>
          <input className={inputClass} value={form.email} onChange={(e) => actualizar('email', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Ciudad</label>
          <select className={inputClass} value={form.ciudad} onChange={(e) => actualizar('ciudad', e.target.value)}>
            <option value="">— Selecciona —</option>
            {CIUDADES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Dirección</label>
          <input className={inputClass} value={form.direccion} onChange={(e) => actualizar('direccion', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={guardar}
          disabled={guardando}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Check size={13} />
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button
          onClick={() => setEditando(false)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">
          <X size={13} />
          Cancelar
        </button>
      </div>
    </div>
  )
}