'use client'

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

export default function NuevoClientePage() {
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

      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-5">

        {/* Datos fiscales */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            Datos fiscales
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Razón social / Nombre completo">
              <input className={inputClass} placeholder="Ej. Comercial López S.R.L." />
            </Campo>
            <Campo label="NIT / Cédula de identidad">
              <input className={inputClass} placeholder="Ej. 7890123" />
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
              <input className={inputClass} placeholder="+591 7XXXXXXX" />
            </Campo>
            <Campo label="Correo electrónico">
              <input type="email" className={inputClass} placeholder="correo@empresa.com" />
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
              <select className={inputClass}>
                <option value="">— Selecciona —</option>
                {['La Paz', 'El Alto', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Sucre', 'Trinidad', 'Cobija'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Dirección">
              <input className={inputClass} placeholder="Av. / Calle, número" />
            </Campo>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            className="px-5 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--accent)' }}>
            Guardar cliente
          </button>
          <Link href="/clientes"
            className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            Cancelar
          </Link>
        </div>

      </div>
    </div>
  )
}