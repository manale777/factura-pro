import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        facturas: {
          orderBy: { emision: 'desc' },
          select: {
            id: true, numero: true, emision: true,
            vencimiento: true, total: true, estado: true,
          },
        },
      },
    })
    if (!cliente) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(cliente)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const cliente = await prisma.cliente.update({ where: { id }, data: body })
    return NextResponse.json(cliente)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar cliente' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.cliente.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 })
  }
}