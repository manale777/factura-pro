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

const CATEGORIAS = ['Servicio', 'Software', 'Hardware', 'Periférico', 'Otro']
const UNIDADES = ['unidad', 'hora', 'kg', 'litro', 'metro', 'caja', 'par']

export default function NuevoProductoForm() {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [esServicio, setEsServicio] = useState(false)
  const [form, setForm] = useState({
    codigo: '',
    descripcion: '',
    categoria: '',
    precio: '',
    iva: '13',
    stock: '',
    unidad: 'unidad',
  })

  function actualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function validar() {
    if (!form.codigo.trim()) return 'El código es obligatorio'
    if (!form.descripcion.trim()) return 'La descripción es obligatoria'
    if (!form.categoria) return 'Selecciona una categoría'
    if (!form.precio || Number(form.precio) <= 0) return 'El precio debe ser mayor a 0'
    return ''
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    const mensajeError = validar()
    if (mensajeError) { setError(mensajeError); return }

    setError('')
    setGuardando(true)

    try {
      const body = {
        codigo: form.codigo,
        descripcion: form.descripcion,
        categoria: form.categoria,
        precio: Number(form.precio),
        iva: Number(form.iva),
        stock: esServicio ? null : Number(form.stock),
        unidad: form.unidad,
      }

      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Error al guardar')
      }

      router.push('/productos')
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
        <Link href="/productos"
          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-xs text-gray-400">Productos / Nuevo</p>
          <h1 className="text-lg font-semibold text-gray-800">Nuevo producto</h1>
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

          {/* Identificación */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Identificación
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Código *">
                <input
                  className={inputClass}
                  placeholder="Ej. PRD-009"
                  value={form.codigo}
                  onChange={(e) => actualizar('codigo', e.target.value)}
                />
              </Campo>
              <Campo label="Categoría *">
                <select
                  className={inputClass}
                  value={form.categoria}
                  onChange={(e) => {
                    actualizar('categoria', e.target.value)
                    setEsServicio(e.target.value === 'Servicio')
                  }}>
                  <option value="">— Selecciona —</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Descripción *">
                <input
                  className={inputClass}
                  placeholder="Nombre o descripción del producto"
                  value={form.descripcion}
                  onChange={(e) => actualizar('descripcion', e.target.value)}
                />
              </Campo>
              <Campo label="Unidad de medida">
                <select
                  className={inputClass}
                  value={form.unidad}
                  onChange={(e) => actualizar('unidad', e.target.value)}>
                  {UNIDADES.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </Campo>
            </div>
          </div>

          {/* Precios */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Precios
            </p>
            <div className="grid grid-cols-3 gap-4">
              <Campo label="Precio unitario (Bs.) *">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={inputClass}
                  placeholder="0.00"
                  value={form.precio}
                  onChange={(e) => actualizar('precio', e.target.value)}
                />
              </Campo>
              <Campo label="IVA (%)">
                <select
                  className={inputClass}
                  value={form.iva}
                  onChange={(e) => actualizar('iva', e.target.value)}>
                  <option value="0">0% — Exento</option>
                  <option value="13">13% — Estándar</option>
                </select>
              </Campo>
              <Campo label="Precio con IVA">
                <input
                  className={inputClass}
                  readOnly
                  value={
                    form.precio
                      ? `Bs. ${(Number(form.precio) * (1 + Number(form.iva) / 100)).toFixed(2)}`
                      : '—'
                  }
                />
              </Campo>
            </div>
          </div>

          {/* Stock — solo si no es servicio */}
          {!esServicio && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Inventario
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Campo label="Stock inicial">
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => actualizar('stock', e.target.value)}
                  />
                </Campo>
              </div>
            </div>
          )}

          {esServicio && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-600">
              Los servicios no manejan stock de inventario.
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}>
              {guardando ? 'Guardando...' : 'Guardar producto'}
            </button>
            <Link href="/productos"
              className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
          </div>

        </div>
      </form>
    </div>
  )
}