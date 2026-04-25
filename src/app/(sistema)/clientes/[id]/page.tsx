import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, FileText } from 'lucide-react'
//import { clientes, facturas } from '@/lib/data'
import EstadoBadge from '@/components/ui/EstadoBadge'
import EditarClienteForm from '@/components/modules/EditarClienteForm'

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  type ClienteConFacturas = Prisma.ClienteGetPayload<{
    include: { facturas: true }
  }>
  const cliente: ClienteConFacturas | null = await prisma.cliente.findUnique({
    where: { id },
    include: { facturas: true },
  })

  if (!cliente) notFound()

  const totalFacturas = cliente.facturas.length

  const saldoPendiente = cliente.facturas
    .filter((f) => f.estado === 'Pendiente')
    .reduce((acc, f) => acc + f.total, 0)

  return (
    <div className="space-y-4 max-w-4xl">

      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <Link href="/clientes"
          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-xs text-gray-400">Clientes / Detalle</p>
          <h1 className="text-lg font-semibold text-gray-800">{cliente.nombre}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/clientes"
          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Clientes / Detalle</p>
          <h1 className="text-lg font-semibold text-gray-800">{cliente.nombre}</h1>
        </div>
        <EditarClienteForm cliente={cliente} />
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* Info del cliente */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">

            {/* Avatar */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-3"
                style={{ backgroundColor: 'var(--accent)' }}>
                {cliente.nombre.slice(0, 2).toUpperCase()}
              </div>
              <p className="font-semibold text-gray-800">{cliente.nombre}</p>
              <p className="text-xs text-gray-400 mt-0.5">NIT: {cliente.nit}</p>
            </div>

            {/* Datos de contacto */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">{cliente.telefono}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">{cliente.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">{cliente.ciudad}</span>
              </div>
            </div>
          </div>

          {/* Resumen financiero */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Resumen
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total facturas</span>
                <span className="font-medium text-gray-800">{totalFacturas}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Saldo pendiente</span>
                <span className={`font-medium ${saldoPendiente > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  ${saldoPendiente.toLocaleString()}
                </span>
              </div>
            </div>
            <Link href="/facturas/nueva"
              className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--accent)' }}>
              <FileText size={13} />
              Nueva factura
            </Link>
          </div>
        </div>

        {/* Facturas del cliente */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">Historial de facturas</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['#', 'Emisión', 'Vencimiento', 'Total', 'Estado'].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cliente.facturas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                      Sin facturas registradas
                    </td>
                  </tr>
                ) : (
                  cliente.facturas.map((f) => (
                    <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--accent)' }}>
                        <Link href={`/facturas/${f.id}`}>{f.numero}</Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{f.emision?.toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{f.vencimiento?.toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        ${f.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <EstadoBadge estado={f.estado} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}