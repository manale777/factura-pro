export interface DashboardDTO {
  ingresosMes:      number
  facturasEmitidas: number
  pendientesPago:   number
  carteraVencida:   number
  totalClientes:    number
}

export interface ReportesDTO {
  kpis: {
    facturadoMes: number
    cobradoMes:   number
    totalFacturas: number
    totalClientes: number
    tasaCobro:    number
  }
  estadisticasMeses:  { mes: string; facturado: number; cobrado: number }[]
  topClientes:        { nombre: string; facturas: number; pendiente: number }[]
  ventasPorCategoria: { nombre: string; valor: number }[]
  estadoFacturas:     { estado: string; cantidad: number }[]
}