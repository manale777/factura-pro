'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Eye } from 'lucide-react'
import EstadoBadge from '@/components/ui/EstadoBadge'

const ESTADOS = ['Todas', 'Pagada', 'Pendiente', 'Vencida', 'Borrador'] as const

export default function FacturasClient({ facturas }: { facturas: any[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('Todas')

  const filtradas = facturas.filter((f) => {
    const coincideBusqueda =
      f.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.cliente?.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === 'Todas' || f.estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Inicio / Facturas</p>
          <h1 className="text-lg font-semibold text-gray-800 mt-0.5">Facturas</h1>
        </div>
        <Link href="/facturas/nueva"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Plus size={15} />
          Nueva factura
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 flex-1 min-w-48">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex gap-1">
          {ESTADOS.map((e) => (
            <button key={e} onClick={() => setFiltroEstado(e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtroEstado === e ? 'text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
              style={filtroEstado === e ? { backgroundColor: 'var(--accent)' } : {}}>
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['#', 'Cliente', 'NIT', 'Emisión', 'Vencimiento', 'Subtotal', 'IVA', 'Total', 'Estado', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-400">
                    No se encontraron facturas
                  </td>
                </tr>
              ) : (
                filtradas.map((f: any) => (
                  <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-xs" style={{ color: 'var(--accent)' }}>{f.numero}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{f.cliente?.nombre}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{f.cliente?.nit}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(f.emision).toLocaleDateString('es-BO')}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(f.vencimiento).toLocaleDateString('es-BO')}</td>
                    <td className="px-4 py-3 text-gray-600">${f.subtotal.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">${f.totalIva.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">${f.total.toLocaleString()}</td>
                    <td className="px-4 py-3"><EstadoBadge estado={f.estado} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/facturas/${f.id}`}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                        <Eye size={14} /> Ver
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">
            Mostrando {filtradas.length} de {facturas.length} facturas
          </p>
        </div>
      </div>
    </div>
  )
}