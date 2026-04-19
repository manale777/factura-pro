import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const movimientos = await prisma.movimientoInventario.findMany({
      orderBy: { fecha: 'desc' },
      include: { producto: { select: { descripcion: true, codigo: true } } },
    })
    return NextResponse.json(movimientos)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener movimientos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productoId, tipo, cantidad, nota, usuario } = body

    const producto = await prisma.producto.findUnique({ where: { id: productoId } })
    if (!producto) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

    const stockAnterior = producto.stock ?? 0
    const stockActual =
      tipo === 'Entrada' ? stockAnterior + cantidad
      : tipo === 'Salida' ? stockAnterior - cantidad
      : stockAnterior + cantidad

    // Actualizar stock del producto y registrar movimiento en una transacción
    const [movimiento] = await prisma.$transaction([
      prisma.movimientoInventario.create({
        data: { productoId, tipo, cantidad, stockAnterior, stockActual, nota, usuario },
      }),
      prisma.producto.update({
        where: { id: productoId },
        data: { stock: stockActual },
      }),
    ])

    return NextResponse.json(movimiento, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar movimiento' }, { status: 500 })
  }
}