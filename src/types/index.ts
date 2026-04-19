export type EstadoFactura = 'Pagada' | 'Pendiente' | 'Vencida' | 'Borrador'

export interface Factura {
  id: string
  numero: string
  clienteNombre: string
  clienteNit: string
  emision: string
  vencimiento: string
  subtotal: number
  totalIva: number
  total: number
  estado: EstadoFactura
}

export interface Cliente {
  id: string
  nombre: string
  nit: string
  telefono: string
  email: string
  ciudad: string
  totalFacturas: number
  saldoPendiente: number
}

export interface Producto {
  id: string
  codigo: string
  descripcion: string
  categoria: string
  precio: number
  iva: number
  stock: number | null
}

export interface EstadisticasMes {
  mes: string
  facturado: number
  cobrado: number
}

export interface ItemFactura {
  id: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  descuento: number
  subtotal: number
  iva: number
  total: number
}

export interface FacturaDetalle extends Factura {
  items: ItemFactura[]
  notas?: string
}

export type TipoMovimiento = 'Entrada' | 'Salida' | 'Ajuste'

export interface MovimientoInventario {
  id: string
  productoId: string
  productoNombre: string
  tipo: TipoMovimiento
  cantidad: number
  stockAnterior: number
  stockActual: number
  fecha: string
  usuario: string
}