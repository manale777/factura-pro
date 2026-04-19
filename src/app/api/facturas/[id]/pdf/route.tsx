import { NextResponse } from 'next/server'
import { DocumentProps, renderToBuffer } from '@react-pdf/renderer'
import { prisma } from '@/lib/prisma'
import FacturaPDF from '@/components/pdf/FacturaPDF'
import { createElement, ReactElement } from 'react'
import { Factura } from '@prisma/client'

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

    if (!factura) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
    }

    const buffer = await renderToBuffer(
      //createElement(FacturaPDF, { factura }) as ReactElement<DocumentProps>
      <FacturaPDF factura={factura} />
    )

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${factura.numero}.pdf"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al generar PDF' }, { status: 500 })
  }
}