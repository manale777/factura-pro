import { prisma } from '@/lib/prisma'
import { CrearMovimientoSchema, toMovimientoDTO } from '@/lib/dtos'
import { okResponse, errorResponse, validationError, notFoundError } from '@/lib/api-response'

export async function GET() {
  try {
    const movimientos = await prisma.movimientoInventario.findMany({
      orderBy: { fecha: 'desc' },
      include: { producto: { select: { id: true, codigo: true, descripcion: true } } },
    })
    return okResponse(movimientos.map(toMovimientoDTO))
  } catch {
    return errorResponse('Error al obtener movimientos')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validado = CrearMovimientoSchema.safeParse(body)
    if (!validado.success) return validationError(validado.error)

    const { productoId, tipo, cantidad, nota, usuario } = validado.data

    const producto = await prisma.producto.findUnique({ where: { id: productoId } })
    if (!producto) return notFoundError('Producto')
    if (producto.stock === null) return errorResponse('Este producto es un servicio y no maneja stock', 400)

    const stockAnterior = producto.stock
    const stockActual =
      tipo === 'Entrada' ? stockAnterior + cantidad
      : tipo === 'Salida'  ? stockAnterior - cantidad
      : stockAnterior + cantidad

    if (stockActual < 0) return errorResponse(`Stock insuficiente. Disponible: ${stockAnterior}`, 400)

    const [movimiento] = await prisma.$transaction([
      prisma.movimientoInventario.create({
        data: { productoId, tipo, cantidad, stockAnterior, stockActual, nota, usuario },
        include: { producto: { select: { id: true, codigo: true, descripcion: true } } },
      }),
      prisma.producto.update({ where: { id: productoId }, data: { stock: stockActual } }),
    ])

    return okResponse(toMovimientoDTO(movimiento), 201)
  } catch {
    return errorResponse('Error al registrar movimiento')
  }
}