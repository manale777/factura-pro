'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Eye, MapPin, Phone } from 'lucide-react'

export default function ClientesClient({ clientes }: { clientes: any[] }) {
  const [busqueda, setBusqueda] = useState('')

  const filtrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.nit.includes(busqueda) ||
    c.ciudad?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Inicio / Clientes</p>
          <h1 className="text-lg font-semibold text-gray-800 mt-0.5">Clientes</h1>
        </div>
        <Link href="/clientes/nuevo"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Plus size={15} /> Nuevo cliente
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 max-w-sm">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, NIT o ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtrados.map((c) => (
          <div key={c.id}
            className="bg-white rounded-lg border border-gray-200 p-4 space-y-3 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent)' }}>
                  {c.nombre.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.nombre}</p>
                  <p className="text-xs text-gray-400">NIT: {c.nit}</p>
                </div>
              </div>
              <Link href={`/clientes/${c.id}`}
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                <Eye size={15} />
              </Link>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              {c.ciudad && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={12} className="text-gray-400" />{c.ciudad}
                </div>
              )}
              {c.telefono && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={12} className="text-gray-400" />{c.telefono}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-base font-semibold text-gray-800">{c.totalFacturas}</p>
                <p className="text-xs text-gray-400">Facturas</p>
              </div>
              <div className={`rounded-lg p-2 text-center ${c.saldoPendiente > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
                <p className={`text-base font-semibold ${c.saldoPendiente > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  ${c.saldoPendiente.toLocaleString()}
                </p>
                <p className={`text-xs ${c.saldoPendiente > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                  Pendiente
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}