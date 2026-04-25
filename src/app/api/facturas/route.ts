import { prisma } from '@/lib/prisma'
import { CrearFacturaSchema, toFacturaResumenDTO } from '@/lib/dtos'
import { okResponse, errorResponse, validationError } from '@/lib/api-response'

export async function GET() {
  try {
    const facturas = await prisma.factura.findMany({
      orderBy: { emision: 'desc' },
      include: {
        cliente: { select: { id: true, nombre: true, nit: true } },
        items: true,
      },
    })
    return okResponse(facturas.map(toFacturaResumenDTO))
  } catch {
    return errorResponse('Error al obtener facturas')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validado = CrearFacturaSchema.safeParse(body)
    if (!validado.success) return validationError(validado.error)

    const { items, clienteId, vencimiento, subtotal, totalIva, total, notas, estado } = validado.data

    const count = await prisma.factura.count()
    const numero = `FAC-${String(count + 1).padStart(4, '0')}`

    const factura = await prisma.factura.create({
      data: {
        numero,
        clienteId,
        vencimiento:  new Date(vencimiento),
        subtotal,
        totalIva,
        total,
        notas,
        estado,
        items: {
          create: items.map((item) => ({
            productoId:     item.productoId ?? null,
            descripcion:    item.descripcion,
            cantidad:       item.cantidad,
            precioUnitario: item.precioUnitario,
            descuento:      item.descuento,
            subtotal:       item.subtotal,
            iva:            item.iva,
            total:          item.total,
          })),
        },
      },
      include: {
        items: true,
        cliente: { select: { id: true, nombre: true, nit: true } },
      },
    })

    return okResponse(toFacturaResumenDTO(factura), 201)
  } catch {
    return errorResponse('Error al crear factura')
  }
}