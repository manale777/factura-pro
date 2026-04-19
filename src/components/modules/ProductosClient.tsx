'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Package } from 'lucide-react'

const categoriaColor: Record<string, string> = {
  Servicio:   'bg-blue-100 text-blue-700',
  Software:   'bg-purple-100 text-purple-700',
  Hardware:   'bg-gray-100 text-gray-700',
  Periférico: 'bg-amber-100 text-amber-700',
}

export default function ProductosClient({ productos }: { productos: any[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas')

  const categorias = ['Todas', ...Array.from(new Set(productos.map((p) => p.categoria)))]

  const filtrados = productos.filter((p) => {
    const coincide =
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase())
    const cat = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro
    return coincide && cat
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Inicio / Productos</p>
          <h1 className="text-lg font-semibold text-gray-800 mt-0.5">Productos y servicios</h1>
        </div>
        <Link href="/productos/nuevo"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Plus size={15} /> Nuevo producto
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 flex-1 min-w-48">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categorias.map((cat) => (
            <button key={cat} onClick={() => setCategoriaFiltro(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                categoriaFiltro === cat ? 'text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
              style={categoriaFiltro === cat ? { backgroundColor: 'var(--accent)' } : {}}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Código', 'Descripción', 'Categoría', 'Precio', 'IVA', 'Stock', 'Precio c/IVA', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const precioConIva = p.precio * (1 + p.iva / 100)
                const sinStock = p.stock !== null && p.stock === 0
                const stockBajo = p.stock !== null && p.stock > 0 && p.stock <= 5
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-gray-500">{p.codigo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package size={13} className="text-gray-400" />
                        </div>
                        <span className="text-gray-700">{p.descripcion}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoriaColor[p.categoria] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">${p.precio.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{p.iva}%</td>
                    <td className="px-4 py-3">
                      {p.stock === null ? (
                        <span className="text-xs text-gray-400">Servicio</span>
                      ) : sinStock ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Sin stock</span>
                      ) : stockBajo ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">{p.stock} unid.</span>
                      ) : (
                        <span className="text-gray-700">{p.stock} unid.</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">${precioConIva.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-colors">
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">
            Mostrando {filtrados.length} de {productos.length} productos
          </p>
        </div>
      </div>
    </div>
  )
}