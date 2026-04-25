import { prisma } from '@/lib/prisma'
import { CrearProductoSchema, toProductoDTO } from '@/lib/dtos'
import { okResponse, errorResponse, validationError } from '@/lib/api-response'

export async function GET() {
  try {
    const productos = await prisma.producto.findMany({ orderBy: { codigo: 'asc' } })
    return okResponse(productos.map(toProductoDTO))
  } catch {
    return errorResponse('Error al obtener productos')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validado = CrearProductoSchema.safeParse(body)
    if (!validado.success) return validationError(validado.error)

    const producto = await prisma.producto.create({ data: validado.data })
    return okResponse(toProductoDTO(producto), 201)
  } catch (e: any) {
    if (e.code === 'P2002') return errorResponse('Ya existe un producto con ese código', 409)
    return errorResponse('Error al crear producto')
  }
}