import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const facturas = await prisma.factura.findMany({
      orderBy: { emision: 'desc' },
      include: {
        cliente: { select: { nombre: true, nit: true } },
        items: true,
      },
    })
    return NextResponse.json(facturas)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener facturas' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, clienteId, vencimiento, subtotal, totalIva, total, notas } = body

    // Generar número de factura
    const count = await prisma.factura.count()
    const numero = `FAC-${String(count + 1).padStart(4, '0')}`

    const factura = await prisma.factura.create({
      data: {
        numero,
        clienteId,
        vencimiento: new Date(vencimiento),
        subtotal,
        totalIva,
        total,
        notas,
        estado: 'Borrador',
        items: {
          create: items.map((item: any) => ({
            productoId: item.productoId || null,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            descuento: item.descuento,
            subtotal: item.subtotal,
            iva: item.iva,
            total: item.total,
          })),
        },
      },
      include: { items: true, cliente: true },
    })

    return NextResponse.json(factura, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear factura' }, { status: 500 })
  }
}