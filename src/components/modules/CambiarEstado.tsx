'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import type { EstadoFactura } from '@/types'

const ESTADOS: EstadoFactura[] = ['Borrador', 'Pendiente', 'Pagada', 'Vencida']

const estilos: Record<EstadoFactura, string> = {
  Pagada:    'bg-green-100 text-green-800 border-green-200',
  Pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
  Vencida:   'bg-red-100   text-red-800   border-red-200',
  Borrador:  'bg-gray-100  text-gray-600  border-gray-200',
}

export default function CambiarEstado({
  facturaId,
  estadoActual,
}: {
  facturaId: string
  estadoActual: EstadoFactura
}) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)

  async function cambiar(nuevoEstado: EstadoFactura) {
    if (nuevoEstado === estadoActual) { setAbierto(false); return }
    setGuardando(true)
    try {
      const res = await fetch(`/api/facturas/${facturaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      if (!res.ok) throw new Error()
      setAbierto(false)
      router.refresh()
    } catch {
      alert('Error al cambiar el estado')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto(!abierto)}
        disabled={guardando}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors disabled:opacity-50 ${estilos[estadoActual]}`}>
        {guardando ? 'Guardando...' : estadoActual}
        <ChevronDown size={12} />
      </button>

      {abierto && (
        <>
          {/* Overlay para cerrar al hacer clic afuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setAbierto(false)}
          />
          <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden w-36">
            {ESTADOS.map((e) => (
              <button
                key={e}
                onClick={() => cambiar(e)}
                className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-gray-50 flex items-center justify-between ${
                  e === estadoActual ? 'font-medium' : 'text-gray-600'
                }`}>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estilos[e]}`}>
                  {e}
                </span>
                {e === estadoActual && (
                  <span className="text-blue-500 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}