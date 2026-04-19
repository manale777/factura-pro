'use client'

import { useState } from 'react'
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import MovimientoBadge from '@/components/ui/MovimientoBadge'

export default function InventarioClient({
  productos, movimientos,
}: {
  productos: any[]; movimientos: any[]
}) {
  const [busqueda, setBusqueda] = useState('')

  const conStock = productos.filter((p) => p.stock !== null)
  const sinStock = conStock.filter((p) => p.stock === 0).length
  const stockBajo = conStock.filter((p) => p.stock > 0 && p.stock <= 5).length
  const totalUnidades = conStock.reduce((acc: number, p: any) => acc + (p.stock ?? 0), 0)

  const movFiltrados = movimientos.filter((m: any) =>
    m.producto?.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-gray-400">Inicio / Inventario</p>
        <h1 className="text-lg font-semibold text-gray-800 mt-0.5">Inventario</h1>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Unidades en stock', value: totalUnidades, icon: Package, color: 'bg-blue-50 text-blue-500' },
          { label: 'Productos con stock', value: conStock.length, icon: TrendingUp, color: 'bg-green-50 text-green-500' },
          { label: 'Stock bajo (≤5)', value: stockBajo, icon: AlertTriangle, color: 'bg-amber-50 text-amber-500' },
          { label: 'Sin stock', value: sinStock, icon: TrendingDown, color: 'bg-red-50 text-red-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">Stock actual</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Código', 'Producto', 'Stock', 'Estado'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {conStock.map((p: any) => {
                const sin = p.stock === 0
                const bajo = p.stock > 0 && p.stock <= 5
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400">{p.codigo}</td>
                    <td className="px-4 py-3 text-gray-700">{p.descripcion}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.stock}</td>
                    <td className="px-4 py-3">
                      {sin ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Sin stock</span>
                      ) : bajo ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Stock bajo</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Normal</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Movimientos recientes</p>
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400 text-gray-600 w-36"
            />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Producto', 'Tipo', 'Cant.', 'Antes', 'Después', 'Usuario'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movFiltrados.map((m: any) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{m.producto?.descripcion}</td>
                  <td className="px-4 py-3"><MovimientoBadge tipo={m.tipo} /></td>
                  <td className="px-4 py-3 font-medium text-gray-800">{m.cantidad}</td>
                  <td className="px-4 py-3 text-gray-500">{m.stockAnterior}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{m.stockActual}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{m.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}