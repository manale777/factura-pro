import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { EstadoFactura } from '@prisma/client'
import type { Prisma } from '@prisma/client'

type ClienteConFacturas = Prisma.ClienteGetPayload<{
  include: {
    _count: { select: { facturas: true } }
    facturas: {
      select: {
        total: true
        estado: true
      }
    }
  }
}>

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        _count: { select: { facturas: true } },
        facturas: {
          select: { total: true, estado: true },
        },
      },
    })

    const data = clientes.map((c: ClienteConFacturas) => ({
      id: c.id,
      nombre: c.nombre,
      nit: c.nit,
      telefono: c.telefono,
      email: c.email,
      ciudad: c.ciudad,
      direccion: c.direccion,
      totalFacturas: c._count.facturas,
      saldoPendiente: c.facturas
        .filter((f: { total: number; estado: EstadoFactura }) => f.estado === 'Pendiente' || f.estado === 'Vencida')
        .reduce((acc: number, f: { total: number }) => acc + f.total, 0),
    }))

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cliente = await prisma.cliente.create({ data: body })
    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 })
  }
}