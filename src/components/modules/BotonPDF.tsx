'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

export default function BotonPDF({ facturaId, numero }: { facturaId: string; numero: string }) {
  const [descargando, setDescargando] = useState(false)

  async function descargar() {
    setDescargando(true)
    try {
      const res = await fetch(`/api/facturas/${facturaId}/pdf`)
      if (!res.ok) throw new Error('Error al generar PDF')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${numero}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('No se pudo generar el PDF. Intenta de nuevo.')
    } finally {
      setDescargando(false)
    }
  }

  return (
    <button
      onClick={descargar}
      disabled={descargando}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50">
      <Download size={13} />
      {descargando ? 'Generando...' : 'Descargar PDF'}
    </button>
  )
}