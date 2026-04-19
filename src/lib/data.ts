import type { Cliente, Factura, Producto, EstadisticasMes } from '@/types'

export const clientes: Cliente[] = [
  { id: 'c1', nombre: 'Comercial López', nit: '7890123', telefono: '+591 72340012', email: 'lopez@comercial.bo', ciudad: 'La Paz', totalFacturas: 18, saldoPendiente: 0 },
  { id: 'c2', nombre: 'TechSol Bolivia', nit: '4561239', telefono: '+591 69871234', email: 'info@techsol.bo', ciudad: 'Cochabamba', totalFacturas: 9, saldoPendiente: 8750 },
  { id: 'c3', nombre: 'Distrib. Norte', nit: '3217654', telefono: '+591 78450011', email: 'dnorte@gmail.com', ciudad: 'El Alto', totalFacturas: 24, saldoPendiente: 1980 },
  { id: 'c4', nombre: 'Muebles Andino', nit: '9870011', telefono: '+591 71230098', email: 'ventas@andino.bo', ciudad: 'La Paz', totalFacturas: 6, saldoPendiente: 0 },
  { id: 'c5', nombre: 'Farma Sucre', nit: '6540987', telefono: '+591 67890023', email: 'farmasucre@salud.bo', ciudad: 'Sucre', totalFacturas: 11, saldoPendiente: 6000 },
]

export const facturas: Factura[] = [
  { id: 'f1', numero: 'FAC-0089', clienteNombre: 'Comercial López', clienteNit: '7890123', emision: '2026-04-18', vencimiento: '2026-05-02', subtotal: 3720, totalIva: 480, total: 4200, estado: 'Pagada' },
  { id: 'f2', numero: 'FAC-0088', clienteNombre: 'TechSol Bolivia', clienteNit: '4561239', emision: '2026-04-17', vencimiento: '2026-05-01', subtotal: 7543, totalIva: 981, total: 8750, estado: 'Pendiente' },
  { id: 'f3', numero: 'FAC-0087', clienteNombre: 'Distrib. Norte', clienteNit: '3217654', emision: '2026-04-15', vencimiento: '2026-04-29', subtotal: 1707, totalIva: 273, total: 1980, estado: 'Vencida' },
  { id: 'f4', numero: 'FAC-0086', clienteNombre: 'Muebles Andino', clienteNit: '9870011', emision: '2026-04-14', vencimiento: '2026-04-28', subtotal: 2931, totalIva: 469, total: 3400, estado: 'Pagada' },
  { id: 'f5', numero: 'FAC-0085', clienteNombre: 'Farma Sucre', clienteNit: '6540987', emision: '2026-04-12', vencimiento: '2026-04-26', subtotal: 5172, totalIva: 828, total: 6000, estado: 'Borrador' },
]

export const productos: Producto[] = [
  { id: 'p1', codigo: 'PRD-001', descripcion: 'Servicio de consultoría TI', categoria: 'Servicio', precio: 1500, iva: 13, stock: null },
  { id: 'p2', codigo: 'PRD-002', descripcion: 'Licencia software anual', categoria: 'Software', precio: 800, iva: 13, stock: null },
  { id: 'p3', codigo: 'PRD-003', descripcion: 'Laptop HP 15"', categoria: 'Hardware', precio: 950, iva: 13, stock: 12 },
  { id: 'p4', codigo: 'PRD-004', descripcion: 'Mouse inalámbrico', categoria: 'Periférico', precio: 45, iva: 13, stock: 80 },
  { id: 'p5', codigo: 'PRD-005', descripcion: 'Capacitación por hora', categoria: 'Servicio', precio: 120, iva: 13, stock: null },
  { id: 'p6', codigo: 'PRD-006', descripcion: 'Teclado mecánico', categoria: 'Periférico', precio: 75, iva: 13, stock: 5 },
  { id: 'p7', codigo: 'PRD-007', descripcion: 'Monitor 24" FHD', categoria: 'Hardware', precio: 320, iva: 13, stock: 0 },
  { id: 'p8', codigo: 'PRD-008', descripcion: 'Cable HDMI 2m', categoria: 'Periférico', precio: 12, iva: 13, stock: 14 },
]

export const estadisticasMeses: EstadisticasMes[] = [
  { mes: 'Nov', facturado: 31200, cobrado: 28000 },
  { mes: 'Dic', facturado: 39800, cobrado: 36000 },
  { mes: 'Ene', facturado: 35100, cobrado: 31000 },
  { mes: 'Feb', facturado: 27400, cobrado: 26000 },
  { mes: 'Mar', facturado: 44900, cobrado: 40500 },
  { mes: 'Abr', facturado: 48320, cobrado: 41110 },
]

import type { FacturaDetalle } from '@/types'

export const facturasDetalle: FacturaDetalle[] = [
  {
    id: 'f1', numero: 'FAC-0089', clienteNombre: 'Comercial López',
    clienteNit: '7890123', emision: '2026-04-18', vencimiento: '2026-05-02',
    subtotal: 3720, totalIva: 480, total: 4200, estado: 'Pagada',
    items: [
      { id: 'i1', descripcion: 'Consultoría TI', cantidad: 2, precioUnitario: 1500, descuento: 0, subtotal: 3000, iva: 390, total: 3390 },
      { id: 'i2', descripcion: 'Capacitación (6 hrs)', cantidad: 6, precioUnitario: 120, descuento: 0, subtotal: 720, iva: 93.6, total: 813.6 },
    ],
  },
  {
    id: 'f2', numero: 'FAC-0088', clienteNombre: 'TechSol Bolivia',
    clienteNit: '4561239', emision: '2026-04-17', vencimiento: '2026-05-01',
    subtotal: 7543, totalIva: 981, total: 8750, estado: 'Pendiente',
    items: [
      { id: 'i3', descripcion: 'Laptop HP 15"', cantidad: 5, precioUnitario: 950, descuento: 5, subtotal: 4512.5, iva: 586.6, total: 5099.1 },
      { id: 'i4', descripcion: 'Licencia software anual', cantidad: 3, precioUnitario: 800, descuento: 0, subtotal: 2400, iva: 312, total: 2712 },
      { id: 'i5', descripcion: 'Instalación y configuración', cantidad: 1, precioUnitario: 800, descuento: 0, subtotal: 800, iva: 104, total: 904 },
    ],
  },
  {
    id: 'f3', numero: 'FAC-0087', clienteNombre: 'Distrib. Norte',
    clienteNit: '3217654', emision: '2026-04-15', vencimiento: '2026-04-29',
    subtotal: 1707, totalIva: 273, total: 1980, estado: 'Vencida',
    items: [
      { id: 'i6', descripcion: 'Mouse inalámbrico', cantidad: 20, precioUnitario: 45, descuento: 0, subtotal: 900, iva: 117, total: 1017 },
      { id: 'i7', descripcion: 'Teclado mecánico', cantidad: 5, precioUnitario: 75, descuento: 0, subtotal: 375, iva: 48.75, total: 423.75 },
    ],
  },
  {
    id: 'f4', numero: 'FAC-0086', clienteNombre: 'Muebles Andino',
    clienteNit: '9870011', emision: '2026-04-14', vencimiento: '2026-04-28',
    subtotal: 2931, totalIva: 469, total: 3400, estado: 'Pagada',
    items: [
      { id: 'i9', descripcion: 'Laptop HP 15"', cantidad: 2, precioUnitario: 950, descuento: 0, subtotal: 1900, iva: 247, total: 2147 },
      { id: 'i10', descripcion: 'Monitor 24" FHD', cantidad: 2, precioUnitario: 320, descuento: 0, subtotal: 640, iva: 83.2, total: 723.2 },
    ],
  },
  {
    id: 'f5', numero: 'FAC-0085', clienteNombre: 'Farma Sucre',
    clienteNit: '6540987', emision: '2026-04-12', vencimiento: '2026-04-26',
    subtotal: 5172, totalIva: 828, total: 6000, estado: 'Borrador',
    items: [
      { id: 'i11', descripcion: 'Consultoría TI (3 hrs)', cantidad: 3, precioUnitario: 1500, descuento: 0, subtotal: 4500, iva: 585, total: 5085 },
      { id: 'i12', descripcion: 'Capacitación (5 hrs)', cantidad: 5, precioUnitario: 120, descuento: 0, subtotal: 600, iva: 78, total: 678 },
    ],
  },
]

import type { MovimientoInventario } from '@/types'

export const movimientos: MovimientoInventario[] = [
  { id: 'm1', productoId: 'p3', productoNombre: 'Laptop HP 15"', tipo: 'Entrada', cantidad: 10, stockAnterior: 2, stockActual: 12, fecha: '2026-04-16', usuario: 'jruiz' },
  { id: 'm2', productoId: 'p4', productoNombre: 'Mouse inalámbrico', tipo: 'Entrada', cantidad: 50, stockAnterior: 30, stockActual: 80, fecha: '2026-04-15', usuario: 'jruiz' },
  { id: 'm3', productoId: 'p6', productoNombre: 'Teclado mecánico', tipo: 'Salida', cantidad: 3, stockAnterior: 8, stockActual: 5, fecha: '2026-04-14', usuario: 'mlopez' },
  { id: 'm4', productoId: 'p7', productoNombre: 'Monitor 24" FHD', tipo: 'Salida', cantidad: 2, stockAnterior: 2, stockActual: 0, fecha: '2026-04-13', usuario: 'mlopez' },
  { id: 'm5', productoId: 'p8', productoNombre: 'Cable HDMI 2m', tipo: 'Ajuste', cantidad: 1, stockAnterior: 15, stockActual: 14, fecha: '2026-04-12', usuario: 'admin' },
]