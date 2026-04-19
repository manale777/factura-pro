import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { EstadoFactura } from '@prisma/client'

export async function GET() {
    try {
        const ahora = new Date()
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

        const [facturasMes, pendientes, vencidas, clientes]: [
            { total: number; estado: EstadoFactura }[],
            number,
            any,
            number
        ] = await Promise.all([
            prisma.factura.findMany({
                where: { emision: { gte: inicioMes } },
                select: { total: true, estado: true },
            }),
            prisma.factura.count({ where: { estado: 'Pendiente' } }),
            prisma.factura.aggregate({
                where: { estado: 'Vencida' },
                _sum: { total: true },
            }),
            prisma.cliente.count(),
        ])

        const ingresosMes = facturasMes
            .filter((f) => f.estado === 'Pagada')
            .reduce((acc, f) => acc + f.total, 0 as number)

        return NextResponse.json({
            ingresosMes,
            facturasEmitidas: facturasMes.length,
            pendientesPago: pendientes,
            carteraVencida: vencidas._sum.total ?? 0,
            totalClientes: clientes,
        })
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener dashboard' }, { status: 500 })
    }
}