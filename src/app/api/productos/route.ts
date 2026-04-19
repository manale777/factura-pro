import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { codigo: 'asc' },
    })
    return NextResponse.json(productos)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const producto = await prisma.producto.create({ data: body })
    return NextResponse.json(producto, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}