import {
  DollarSign, FileCheck, Clock, AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import EstadoBadge from '@/components/ui/EstadoBadge'
import type { EstadoFactura } from '@prisma/client'

// Consumo de estadisticas desde base
import { facturas, estadisticasMeses } from '@/lib/data'

import { FacturaDashboard, getDashboardData } from '@/lib/dashboardData'

import DashboardChart from '@/components/dashboard/DashboardChart'

// ─── Tarjeta de estadística ───────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string
  value: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ─── Tooltip personalizado para la gráfica ────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default async function Dashboard() {
  const { resumen, facturas } = await getDashboardData()  
  const recientes = facturas.slice(0, 5)

  return (
    <div className="space-y-5">

      {/* Breadcrumb */}
      <p className="text-xs text-gray-400">Inicio / Dashboard</p>
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Ingresos del mes"    value="$48,320" icon={DollarSign}    color="bg-blue-50 text-blue-500" />
        <StatCard label="Facturas emitidas"   value="134"     icon={FileCheck}     color="bg-green-50 text-green-500" />
        <StatCard label="Pendientes de pago"  value="12"      icon={Clock}         color="bg-amber-50 text-amber-500" />
        <StatCard label="Cartera vencida"     value="$3,210"  icon={AlertTriangle} color="bg-red-50 text-red-500" />
      </div>

      {/* Gráfica + tabla */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Gráfica de barras */}
        <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Ingresos últimos 6 meses
          </p>
          <DashboardChart data={estadisticasMeses} />
        </div>

        {/* Estado de facturas */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-4">Estado de facturas</p>
          <div className="space-y-3">
            {[
              { label: 'Pagadas',    pct: 60, color: 'bg-blue-400' },
              { label: 'Cobradas',   pct: 25, color: 'bg-emerald-400' },
              { label: 'Pendientes', pct: 10, color: 'bg-amber-400' },
              { label: 'Vencidas',   pct: 5,  color: 'bg-red-400' },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total facturado</span>
              <span className="font-medium text-gray-700">$48,320</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total cobrado</span>
              <span className="font-medium text-emerald-600">$41,110</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Por cobrar</span>
              <span className="font-medium text-amber-600">$7,210</span>
            </div>
          </div>
        </div>
      </div>

      {/* Facturas recientes */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Facturas recientes</p>
          <Link href="/facturas"
            className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['#', 'Cliente', 'Emisión', 'Vencimiento', 'Total', 'Estado'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recientes.map((f) => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-blue-600 text-xs">{f.numero}</td>
                  <td className="px-4 py-3 text-gray-700">{f.cliente.nombre}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{f.emision.toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{f.vencimiento.toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">${f.total.toLocaleString()}</td>
                  <td className="px-4 py-3"><EstadoBadge estado={f.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}