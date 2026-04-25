import { prisma } from '@/lib/prisma'
import { CambiarEstadoSchema, toFacturaDetalleDTO } from '@/lib/dtos'
import { okResponse, errorResponse, validationError, notFoundError } from '@/lib/api-response'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const factura = await prisma.factura.findUnique({
      where: { id },
      include: {
        cliente: true,
        items: { include: { producto: true } },
      },
    })
    if (!factura) return notFoundError('Factura')
    return okResponse(toFacturaDetalleDTO(factura))
  } catch {
    return errorResponse('Error al obtener factura')
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validado = CambiarEstadoSchema.safeParse(body)
    if (!validado.success) return validationError(validado.error)

    const factura = await prisma.factura.update({
      where: { id },
      data: { estado: validado.data.estado },
      include: {
        cliente: { select: { id: true, nombre: true, nit: true } },
        items: true,
      },
    })
    return okResponse(toFacturaResumenDTO(factura))
  } catch (e: any) {
    if (e.code === 'P2025') return notFoundError('Factura')
    return errorResponse('Error al actualizar factura')
  }
}