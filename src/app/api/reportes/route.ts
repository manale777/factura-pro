import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET() {
    try {

        type TopCliente = Prisma.ClienteGetPayload<{
            include: {
                _count: { select: { facturas: true } }
                facturas: { select: { total: true, estado: true } }
            }
        }>

        type ItemConProducto = Prisma.ItemFacturaGetPayload<{
            include: { producto: { select: { categoria: true } } }
        }>

        const ahora = new Date()

        // Últimos 6 meses
        const meses = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(ahora.getFullYear(), ahora.getMonth() - (5 - i), 1)
            return {
                nombre: d.toLocaleString('es-BO', { month: 'short' }),
                inicio: new Date(d.getFullYear(), d.getMonth(), 1),
                fin: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
            }
        })

        // Estadísticas por mes
        const estadisticasMeses = await Promise.all(
            meses.map(async ({ nombre, inicio, fin }) => {
                const [facturado, cobrado] = await Promise.all([
                    prisma.factura.aggregate({
                        where: { emision: { gte: inicio, lte: fin } },
                        _sum: { total: true },
                    }),
                    prisma.factura.aggregate({
                        where: { emision: { gte: inicio, lte: fin }, estado: 'Pagada' },
                        _sum: { total: true },
                    }),
                ])
                return {
                    mes: nombre,
                    facturado: facturado._sum.total ?? 0,
                    cobrado: cobrado._sum.total ?? 0,
                }
            })
        )

        // KPIs del mes actual
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
        const [facturadoMes, cobradoMes, totalFacturas, totalClientes] = await Promise.all([
            prisma.factura.aggregate({
                where: { emision: { gte: inicioMes } },
                _sum: { total: true },
            }),
            prisma.factura.aggregate({
                where: { emision: { gte: inicioMes }, estado: 'Pagada' },
                _sum: { total: true },
            }),
            prisma.factura.count({ where: { emision: { gte: inicioMes } } }),
            prisma.cliente.count(),
        ])

        const facturadoMesVal = facturadoMes._sum.total ?? 0
        const cobradoMesVal = cobradoMes._sum.total ?? 0
        const tasaCobro = facturadoMesVal > 0
            ? Math.round((cobradoMesVal / facturadoMesVal) * 100)
            : 0

        // Top clientes
        const topClientes: TopCliente[] = await prisma.cliente.findMany({
            include: {
                _count: { select: { facturas: true } },
                facturas: { select: { total: true, estado: true } },
            },
            orderBy: { facturas: { _count: 'desc' } },
            take: 5,
        })

        const topClientesData = topClientes.map((c) => ({
            nombre: c.nombre,
            facturas: c._count.facturas,
            pendiente: c.facturas
                .filter((f) => f.estado === 'Pendiente' || f.estado === 'Vencida')
                .reduce((acc, f) => acc + f.total, 0),
        }))

        // Ventas por categoría
        const items: ItemConProducto[] = await prisma.itemFactura.findMany({
            include: { producto: { select: { categoria: true } } },
        })

        const porCategoria: Record<string, number> = {}
        items.forEach((item) => {
            const cat = item.producto?.categoria ?? 'Otro'
            porCategoria[cat] = (porCategoria[cat] ?? 0) + item.total
        })

        const totalVentas = Object.values(porCategoria).reduce((a, b) => a + b, 0)
        const ventasPorCategoria = Object.entries(porCategoria).map(([nombre, valor]) => ({
            nombre,
            valor: totalVentas > 0 ? Math.round((valor / totalVentas) * 100) : 0,
        })).sort((a, b) => b.valor - a.valor)

        // Estado de facturas
        const [pagadas, pendientes, vencidas, borradores] = await Promise.all([
            prisma.factura.count({ where: { estado: 'Pagada' } }),
            prisma.factura.count({ where: { estado: 'Pendiente' } }),
            prisma.factura.count({ where: { estado: 'Vencida' } }),
            prisma.factura.count({ where: { estado: 'Borrador' } }),
        ])

        return NextResponse.json({
            kpis: {
                facturadoMes: facturadoMesVal,
                cobradoMes: cobradoMesVal,
                totalFacturas,
                totalClientes,
                tasaCobro,
            },
            estadisticasMeses,
            topClientes: topClientesData,
            ventasPorCategoria,
            estadoFacturas: [
                { estado: 'Pagadas', cantidad: pagadas },
                { estado: 'Pendientes', cantidad: pendientes },
                { estado: 'Vencidas', cantidad: vencidas },
                { estado: 'Borradores', cantidad: borradores },
            ],
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error al obtener reportes' }, { status: 500 })
    }
}