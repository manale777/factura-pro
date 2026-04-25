'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'

const inputClass =
  'px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors text-gray-700 bg-white w-full'

export default function NuevoMovimiento({ productos }: { productos: any[] }) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    productoId: '',
    tipo: 'Entrada',
    cantidad: '1',
    nota: '',
    usuario: 'admin',
  })

  const productosConStock = productos.filter((p) => p.stock !== null)
  const productoSeleccionado = productosConStock.find((p) => p.id === form.productoId)

  function actualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function calcularStockResultante() {
    if (!productoSeleccionado) return null
    const cant = Number(form.cantidad)
    if (form.tipo === 'Entrada') return productoSeleccionado.stock + cant
    if (form.tipo === 'Salida') return productoSeleccionado.stock - cant
    return productoSeleccionado.stock + cant
  }

  function validar() {
    if (!form.productoId) return 'Selecciona un producto'
    if (!form.cantidad || Number(form.cantidad) <= 0) return 'La cantidad debe ser mayor a 0'
    if (form.tipo === 'Salida') {
      const stock = productoSeleccionado?.stock ?? 0
      if (Number(form.cantidad) > stock)
        return `Stock insuficiente. Disponible: ${stock} unidades`
    }
    return ''
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    const mensajeError = validar()
    if (mensajeError) { setError(mensajeError); return }

    setError('')
    setGuardando(true)

    try {
      const res = await fetch('/api/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          cantidad: Number(form.cantidad),
        }),
      })
      if (!res.ok) throw new Error('Error al registrar')

      setAbierto(false)
      setForm({ productoId: '', tipo: 'Entrada', cantidad: '1', nota: '', usuario: 'admin' })
      router.refresh()
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: 'var(--accent)' }}>
        <Plus size={15} />
        Registrar movimiento
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setAbierto(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md z-10">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">Registrar movimiento</h2>
              <button
                onClick={() => setAbierto(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={guardar} className="p-5 space-y-4">

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

              {/* Producto */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Producto *</label>
                <select
                  className={inputClass}
                  value={form.productoId}
                  onChange={(e) => actualizar('productoId', e.target.value)}>
                  <option value="">— Selecciona un producto —</option>
                  {productosConStock.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} — {p.descripcion} (stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo y cantidad */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Tipo *</label>
                  <select
                    className={inputClass}
                    value={form.tipo}
                    onChange={(e) => actualizar('tipo', e.target.value)}>
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                    <option value="Ajuste">Ajuste</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Cantidad *</label>
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    value={form.cantidad}
                    onChange={(e) => actualizar('cantidad', e.target.value)}
                  />
                </div>
              </div>

              {/* Preview stock resultante */}
              {productoSeleccionado && form.cantidad && (
                <div className={`rounded-lg px-3 py-2.5 text-xs flex items-center justify-between ${
                  (calcularStockResultante() ?? 0) < 0
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-blue-50 border border-blue-100'
                }`}>
                  <span className="text-gray-600">
                    Stock actual: <strong>{productoSeleccionado.stock}</strong>
                  </span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className={`font-semibold ${
                    (calcularStockResultante() ?? 0) < 0 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    Stock resultante: {calcularStockResultante()}
                  </span>
                </div>
              )}

              {/* Usuario */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Usuario</label>
                <input
                  className={inputClass}
                  value={form.usuario}
                  onChange={(e) => actualizar('usuario', e.target.value)}
                  placeholder="Nombre del responsable"
                />
              </div>

              {/* Nota */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Nota (opcional)</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={2}
                  value={form.nota}
                  onChange={(e) => actualizar('nota', e.target.value)}
                  placeholder="Motivo del movimiento..."
                />
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={guardando || (calcularStockResultante() ?? 0) < 0}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent)' }}>
                  {guardando ? 'Registrando...' : 'Registrar'}
                </button>
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}