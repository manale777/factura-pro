'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface LineaFactura {
  id: string
  productoId: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  descuento: number
}

function calcularLinea(linea: LineaFactura) {
  const subtotal = linea.cantidad * linea.precioUnitario * (1 - linea.descuento / 100)
  const iva = subtotal * 0.13
  const total = subtotal + iva
  return { subtotal, iva, total }
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors text-gray-700 bg-white'

export default function NuevaFacturaClient({
  clientes,
  productos,
}: {
  clientes: any[]
  productos: any[]
}) {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const [clienteId, setClienteId] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [notas, setNotas] = useState('')
  const [lineas, setLineas] = useState<LineaFactura[]>([
    { id: '1', productoId: '', descripcion: '', cantidad: 1, precioUnitario: 0, descuento: 0 },
  ])

  const clienteSeleccionado = clientes.find((c) => c.id === clienteId)

  // ─── Handlers ─────────────────────────────────────────────────────────────
  function agregarLinea() {
    setLineas((prev) => [
      ...prev,
      { id: Date.now().toString(), productoId: '', descripcion: '', cantidad: 1, precioUnitario: 0, descuento: 0 },
    ])
  }

  function eliminarLinea(id: string) {
    setLineas((prev) => prev.filter((l) => l.id !== id))
  }

  function actualizarLinea(id: string, campo: keyof LineaFactura, valor: string | number) {
    setLineas((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        if (campo === 'productoId') {
          const prod = productos.find((p) => p.id === valor)
          return { ...l, productoId: valor as string, descripcion: prod?.descripcion ?? '', precioUnitario: prod?.precio ?? 0 }
        }
        return { ...l, [campo]: valor }
      })
    )
  }

  // ─── Totales ───────────────────────────────────────────────────────────────
  const totales = lineas.reduce(
    (acc, linea) => {
      const { subtotal, iva, total } = calcularLinea(linea)
      return { subtotal: acc.subtotal + subtotal, iva: acc.iva + iva, total: acc.total + total }
    },
    { subtotal: 0, iva: 0, total: 0 }
  )

  // ─── Validar ───────────────────────────────────────────────────────────────
  function validar() {
    if (!clienteId) return 'Selecciona un cliente'
    if (!vencimiento) return 'Ingresa la fecha de vencimiento'
    if (lineas.some((l) => !l.descripcion || l.precioUnitario <= 0))
      return 'Completa todos los productos con descripción y precio'
    return ''
  }

  // ─── Guardar ───────────────────────────────────────────────────────────────
  async function guardar(estado: 'Borrador' | 'Pendiente') {
    const mensajeError = validar()
    if (mensajeError) { setError(mensajeError); return }

    setError('')
    setGuardando(true)

    try {
      const body = {
        clienteId,
        vencimiento,
        notas,
        subtotal: totales.subtotal,
        totalIva: totales.iva,
        total: totales.total,
        estado,
        items: lineas.map((l) => {
          const { subtotal, iva, total } = calcularLinea(l)
          return {
            productoId: l.productoId || null,
            descripcion: l.descripcion,
            cantidad: l.cantidad,
            precioUnitario: l.precioUnitario,
            descuento: l.descuento,
            subtotal,
            iva,
            total,
          }
        }),
      }

      const res = await fetch('/api/facturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Error al guardar')

      const factura = await res.json()
      router.push(`/facturas/${factura.id}`)
    } catch (e) {
      setError('Ocurrió un error al guardar la factura. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-4 max-w-5xl">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/facturas"
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs text-gray-400">Facturas / Nueva</p>
            <h1 className="text-lg font-semibold text-gray-800">Nueva factura</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => guardar('Borrador')}
            disabled={guardando}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50">
            {guardando ? 'Guardando...' : 'Guardar borrador'}
          </button>
          <button
            onClick={() => guardar('Pendiente')}
            disabled={guardando}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}>
            {guardando ? 'Emitiendo...' : 'Emitir factura'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Emisor y cliente */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Emisor</p>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Razón social">
              <input className={inputClass} defaultValue="Mi Empresa Bolivia S.R.L." />
            </Campo>
            <Campo label="NIT">
              <input className={inputClass} defaultValue="1234567890" />
            </Campo>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Cliente</p>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Seleccionar cliente">
              <select className={inputClass} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                <option value="">— Selecciona —</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </Campo>
            <Campo label="NIT / CI">
              <input className={inputClass} readOnly value={clienteSeleccionado?.nit ?? ''} placeholder="Auto" />
            </Campo>
            <Campo label="Ciudad">
              <input className={inputClass} readOnly value={clienteSeleccionado?.ciudad ?? ''} placeholder="Auto" />
            </Campo>
            <Campo label="Email">
              <input className={inputClass} readOnly value={clienteSeleccionado?.email ?? ''} placeholder="Auto" />
            </Campo>
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Fechas</p>
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Fecha de emisión">
            <input type="date" className={inputClass}
              defaultValue={new Date().toISOString().split('T')[0]} readOnly />
          </Campo>
          <Campo label="Fecha de vencimiento">
            <input type="date" className={inputClass}
              value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} />
          </Campo>
        </div>
      </div>

      {/* Líneas */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
          Productos / Servicios
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Producto', 'Descripción', 'Cant.', 'Precio unit.', 'Desc. %', 'Subtotal', 'IVA', 'Total', ''].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lineas.map((linea) => {
                const { subtotal, iva, total } = calcularLinea(linea)
                return (
                  <tr key={linea.id} className="border-t border-gray-100">
                    <td className="px-2 py-2">
                      <select className={`${inputClass} w-36`} value={linea.productoId}
                        onChange={(e) => actualizarLinea(linea.id, 'productoId', e.target.value)}>
                        <option value="">— Selecciona —</option>
                        {productos.map((p) => (
                          <option key={p.id} value={p.id}>{p.codigo} — {p.descripcion}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <input className={`${inputClass} w-44`} value={linea.descripcion}
                        onChange={(e) => actualizarLinea(linea.id, 'descripcion', e.target.value)}
                        placeholder="Descripción" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" min={1} className={`${inputClass} w-16 text-center`}
                        value={linea.cantidad}
                        onChange={(e) => actualizarLinea(linea.id, 'cantidad', Number(e.target.value))} />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" min={0} className={`${inputClass} w-24`}
                        value={linea.precioUnitario}
                        onChange={(e) => actualizarLinea(linea.id, 'precioUnitario', Number(e.target.value))} />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" min={0} max={100} className={`${inputClass} w-16 text-center`}
                        value={linea.descuento}
                        onChange={(e) => actualizarLinea(linea.id, 'descuento', Number(e.target.value))} />
                    </td>
                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">${subtotal.toFixed(2)}</td>
                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">${iva.toFixed(2)}</td>
                    <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">${total.toFixed(2)}</td>
                    <td className="px-2 py-2">
                      <button onClick={() => eliminarLinea(linea.id)}
                        disabled={lineas.length === 1}
                        className="p-1.5 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <button onClick={agregarLinea}
          className="mt-3 flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
          <Plus size={13} /> Agregar línea
        </button>

        {/* Totales */}
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span>${totales.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>IVA (13%)</span><span>${totales.iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-800 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>${totales.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Campo label="Notas u observaciones">
          <textarea className={`${inputClass} resize-none`} rows={3}
            value={notas} onChange={(e) => setNotas(e.target.value)}
            placeholder="Condiciones de pago, instrucciones especiales..." />
        </Campo>
      </div>

    </div>
  )
}