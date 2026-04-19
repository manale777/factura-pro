import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import EstadoBadge from '@/components/ui/EstadoBadge'
import BotonPDF from '@/components/modules/BotonPDF'

async function getFactura(id: string) {
  const res = await fetch(`http://localhost:3000/api/facturas/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function FacturaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const factura = await getFactura(id)
  if (!factura) notFound()

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/facturas"
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs text-gray-400">Facturas / Detalle</p>
            <h1 className="text-lg font-semibold text-gray-800">{factura.numero}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EstadoBadge estado={factura.estado} />
          <BotonPDF facturaId={factura.id} numero={factura.numero} />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Emisor</p>
            <p className="font-semibold text-gray-800">Mi Empresa Bolivia S.R.L.</p>
            <p className="text-sm text-gray-500">NIT: 1234567890</p>
            <p className="text-sm text-gray-500">La Paz, Bolivia</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Cliente</p>
            <p className="font-semibold text-gray-800">{factura.cliente?.nombre}</p>
            <p className="text-sm text-gray-500">NIT: {factura.cliente?.nit}</p>
            <p className="text-sm text-gray-500">{factura.cliente?.ciudad}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
          {[
            { label: 'Número', value: factura.numero },
            { label: 'Fecha de emisión', value: new Date(factura.emision).toLocaleDateString('es-BO') },
            { label: 'Vencimiento', value: new Date(factura.vencimiento).toLocaleDateString('es-BO') },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-medium text-gray-700">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            Detalle de productos / servicios
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Descripción', 'Cant.', 'Precio unit.', 'Desc.', 'Subtotal', 'IVA', 'Total'].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {factura.items?.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-3 py-2.5 text-gray-700">{item.descripcion}</td>
                  <td className="px-3 py-2.5 text-gray-500">{item.cantidad}</td>
                  <td className="px-3 py-2.5 text-gray-500">${item.precioUnitario.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-gray-500">{item.descuento}%</td>
                  <td className="px-3 py-2.5 text-gray-600">${item.subtotal.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-gray-600">${item.iva.toFixed(2)}</td>
                  <td className="px-3 py-2.5 font-medium text-gray-800">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span>${factura.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>IVA (13%)</span><span>${factura.totalIva.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-800 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>${factura.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}