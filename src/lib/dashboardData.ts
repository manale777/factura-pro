import { prisma } from '@/lib/prisma'
import type { EstadoFactura } from '@prisma/client'

export type FacturaDashboard = {
  id: string
  numero: string
  cliente: {
    nombre: string
  }
  emision: Date
  vencimiento: Date
  total: number
  estado: EstadoFactura
}

export async function getDashboardData(): Promise<{
  resumen: any
  facturas: FacturaDashboard[]
}> {
  const ahora = new Date()
  const inicioMes = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    1
  )

  const [facturasMes, pendientes, vencidas, clientes, facturas] =
    await Promise.all([
      prisma.factura.findMany({
        where: {
          emision: { gte: inicioMes }
        }
      }),

      prisma.factura.count({
        where: {
          estado: 'Pendiente'
        }
      }),

      prisma.factura.aggregate({
        where: {
          estado: 'Vencida'
        },
        _sum: {
          total: true
        }
      }),

      prisma.cliente.count(),

      prisma.factura.findMany({
        take: 5,
        orderBy: {
          emision: 'desc'
        },
        include: {
          cliente: {
            select: {
              nombre: true
            }
          }
        }
      }),
    ])

  return {
    resumen: {
      pendientes,
      clientes
    },
    facturas
  }
}