'use client'

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts'
import {
  TrendingUp, DollarSign, FileText, Users,
} from 'lucide-react'
import { estadisticasMeses, facturas, clientes } from '@/lib/data'

// ─── Colores para el pie chart ────────────────────────────────────────────────
const COLORES_CATEGORIA = ['#3d8ef8', '#27c79c', '#f59e0b', '#ef4444', '#8b5cf6']

// ─── Datos derivados ──────────────────────────────────────────────────────────
const ventasPorCategoria = [
  { nombre: 'Servicios',   valor: 45 },
  { nombre: 'Hardware',    valor: 28 },
  { nombre: 'Software',    valor: 17 },
  { nombre: 'Periféricos', valor: 10 },
]

const topClientes = clientes
  .map((c) => ({
    nombre: c.nombre.split(' ').slice(0, 2).join(' '),
    facturas: c.totalFacturas,
    pendiente: c.saldoPendiente,
  }))
  .sort((a, b) => b.facturas - a.facturas)
  .slice(0, 5)

const estadoFacturas = [
  { estado: 'Pagadas',    cantidad: facturas.filter((f) => f.estado === 'Pagada').length },
  { estado: 'Pendientes', cantidad: facturas.filter((f) => f.estado === 'Pendiente').length },
  { estado: 'Vencidas',   cantidad: facturas.filter((f) => f.estado === 'Vencida').length },
  { estado: 'Borradores', cantidad: facturas.filter((f) => f.estado === 'Borrador').length },
]

// ─── Tooltip personalizado ────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 100
            ? `$${p.value.toLocaleString()}`
            : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── Tarjeta de KPI ───────────────────────────────────────────────────────────
function KpiCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string
  value: string
  sub: string
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
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xs text-green-500 mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function ReportesPage() {
  return (
    <div className="space-y-5">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Inicio / Reportes</p>
          <h1 className="text-lg font-semibold text-gray-800 mt-0.5">Reportes y estadísticas</h1>
        </div>
        <div className="flex gap-2">
          <select className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-gray-500 bg-white">
            <option>Abril 2026</option>
            <option>Marzo 2026</option>
            <option>Febrero 2026</option>
          </select>
          <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            Exportar PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Facturado en abril"  value="$48,320" sub="↑ 7.6% vs marzo" icon={DollarSign}  color="bg-blue-50 text-blue-500" />
        <KpiCard label="Cobrado en abril"    value="$41,110" sub="85.1% de cobro"   icon={TrendingUp}  color="bg-green-50 text-green-500" />
        <KpiCard label="Facturas emitidas"   value="134"     sub="↑ 12 este mes"    icon={FileText}    color="bg-amber-50 text-amber-500" />
        <KpiCard label="Clientes activos"    value="5"       sub="2 con saldo"      icon={Users}       color="bg-purple-50 text-purple-500" />
      </div>

      {/* Gráfica de líneas — tendencia */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-sm font-medium text-gray-700 mb-1">
          Tendencia de facturación vs cobro
        </p>
        <p className="text-xs text-gray-400 mb-4">Últimos 6 meses</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={estadisticasMeses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line dataKey="facturado" name="Facturado" stroke="#3d8ef8" strokeWidth={2}
              dot={{ r: 4, fill: '#3d8ef8' }} activeDot={{ r: 6 }} />
            <Line dataKey="cobrado" name="Cobrado" stroke="#27c79c" strokeWidth={2}
              dot={{ r: 4, fill: '#27c79c' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Fila: pie chart + barras de estado */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Ventas por categoría */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Ventas por categoría</p>
          <p className="text-xs text-gray-400 mb-4">Distribución del mes actual</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={ventasPorCategoria}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="valor">
                  {ventasPorCategoria.map((_, i) => (
                    <Cell key={i} fill={COLORES_CATEGORIA[i % COLORES_CATEGORIA.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5 flex-1">
              {ventasPorCategoria.map((cat, i) => (
                <div key={cat.nombre}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORES_CATEGORIA[i] }}
                      />
                      {cat.nombre}
                    </div>
                    <span className="font-medium">{cat.valor}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cat.valor}%`,
                        backgroundColor: COLORES_CATEGORIA[i],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estado de facturas */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Estado de facturas</p>
          <p className="text-xs text-gray-400 mb-4">Mes actual</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={estadoFacturas} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="estado" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cantidad" name="Facturas" radius={[4, 4, 0, 0]}>
                {estadoFacturas.map((entry, i) => {
                  const colores = ['#27c79c', '#f59e0b', '#ef4444', '#9ca3af']
                  return <Cell key={i} fill={colores[i]} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Top clientes */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Top clientes por actividad</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['#', 'Cliente', 'Facturas emitidas', 'Saldo pendiente', 'Actividad'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topClientes.map((c, i) => {
                const maxFacturas = topClientes[0].facturas
                const pct = Math.round((c.facturas / maxFacturas) * 100)
                return (
                  <tr key={c.nombre} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                          style={{ backgroundColor: COLORES_CATEGORIA[i % COLORES_CATEGORIA.length] }}>
                          {c.nombre.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-gray-700 font-medium">{c.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.facturas}</td>
                    <td className="px-4 py-3">
                      <span className={c.pendiente > 0 ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}>
                        ${c.pendiente.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: COLORES_CATEGORIA[i % COLORES_CATEGORIA.length],
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}