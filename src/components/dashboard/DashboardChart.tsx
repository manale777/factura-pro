'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

type ChartData = {
  mes: string
  facturado: number
  cobrado: number
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: {
    name: string
    value: number
    color: string
  }[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-sm">
      <p className="font-medium text-gray-700 mb-1">
        {label}
      </p>

      {payload.map((p) => (
        <p
          key={p.name}
          style={{ color: p.color }}
        >
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function DashboardChart({
  data,
}: {
  data: ChartData[]
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        barSize={16}
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0f0f0"
        />

        <XAxis
          dataKey="mes"
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) =>
            `$${(v / 1000).toFixed(0)}k`
          }
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend wrapperStyle={{ fontSize: 12 }} />

        <Bar
          dataKey="facturado"
          name="Facturado"
          fill="#3d8ef8"
          radius={[4, 4, 0, 0]}
        />

        <Bar
          dataKey="cobrado"
          name="Cobrado"
          fill="#27c79c"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}