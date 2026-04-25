// Re-exporta los DTOs como tipos del frontend
export type {
  ClienteResumenDTO   as Cliente,
  ClienteDetalleDTO   as ClienteDetalle,
  ProductoDTO         as Producto,
  FacturaResumenDTO   as Factura,
  FacturaDetalleDTO   as FacturaDetalle,
  ItemFacturaDTO      as ItemFactura,
  MovimientoDTO       as Movimiento,
  DashboardDTO        as Dashboard,
  ReportesDTO         as Reportes,
  EstadoFactura,
  TipoMovimiento,
  CategoriaProducto,
} from '@/lib/dtos'