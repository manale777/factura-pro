import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    if (!factura) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
    return NextResponse.json(factura)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener factura' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const factura = await prisma.factura.update({
      where: { id },
      data: { estado: body.estado },
    })
    return NextResponse.json(factura)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar factura' }, { status: 500 })
  }
}