import { prisma } from '@/lib/prisma'
import { CrearClienteSchema, toClienteResumenDTO } from '@/lib/dtos'
import { okResponse, errorResponse, validationError } from '@/lib/api-response'

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        _count: { select: { facturas: true } },
        facturas: { select: { total: true, estado: true } },
      },
    })
    return okResponse(clientes.map(toClienteResumenDTO))
  } catch {
    return errorResponse('Error al obtener clientes')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validado = CrearClienteSchema.safeParse(body)
    if (!validado.success) return validationError(validado.error)

    const cliente = await prisma.cliente.create({ data: validado.data })
    return okResponse(cliente, 201)
  } catch (e: any) {
    if (e.code === 'P2002') return errorResponse('Ya existe un cliente con ese NIT', 409)
    return errorResponse('Error al crear cliente')
  }
}