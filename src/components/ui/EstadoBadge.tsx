import type { EstadoFactura } from '@/types'

const estilos: Record<EstadoFactura, string> = {
  Pagada:   'bg-green-100 text-green-800',
  Pendiente:'bg-amber-100 text-amber-800',
  Vencida:  'bg-red-100   text-red-800',
  Borrador: 'bg-gray-100  text-gray-600',
}

export default function EstadoBadge({ estado }: { estado: EstadoFactura }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${estilos[estado]}`}>
      {estado}
    </span>
  )
}