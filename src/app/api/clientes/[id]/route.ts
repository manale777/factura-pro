import { prisma } from '@/lib/prisma'
import { ActualizarClienteSchema, toClienteDetalleDTO } from '@/lib/dtos'
import { okResponse, errorResponse, validationError, notFoundError } from '@/lib/api-response'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        _count: { select: { facturas: true } },
        facturas: {
          orderBy: { emision: 'desc' },
          select: { id: true, numero: true, emision: true, vencimiento: true, total: true, estado: true },
        },
      },
    })
    if (!cliente) return notFoundError('Cliente')
    return okResponse(toClienteDetalleDTO(cliente))
  } catch {
    return errorResponse('Error al obtener cliente')
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validado = ActualizarClienteSchema.safeParse(body)
    if (!validado.success) return validationError(validado.error)

    const cliente = await prisma.cliente.update({ where: { id }, data: validado.data })
    return okResponse(cliente)
  } catch (e: any) {
    if (e.code === 'P2025') return notFoundError('Cliente')
    return errorResponse('Error al actualizar cliente')
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.cliente.delete({ where: { id } })
    return okResponse({ ok: true })
  } catch (e: any) {
    if (e.code === 'P2025') return notFoundError('Cliente')
    return errorResponse('Error al eliminar cliente')
  }
}