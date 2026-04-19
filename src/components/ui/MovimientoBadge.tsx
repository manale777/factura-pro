import type { TipoMovimiento } from '@/types'

const estilos: Record<TipoMovimiento, string> = {
  Entrada: 'bg-green-100 text-green-800',
  Salida:  'bg-red-100   text-red-800',
  Ajuste:  'bg-amber-100 text-amber-800',
}

export default function MovimientoBadge({ tipo }: { tipo: TipoMovimiento }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${estilos[tipo]}`}>
      {tipo}
    </span>
  )
}