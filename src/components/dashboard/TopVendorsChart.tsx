import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { formatCurrencyWhole } from '@/utils/format'
import { ChartTooltip } from './ChartTooltip'

interface TopVendorsChartProps {
  data: { name: string; value: number; color?: string }[]
}

const fallbackColors = ['#26F0FF', '#A867FF', '#4FA4FF', '#FF5BCE', '#3BF0AD']

export function TopVendorsChart({ data }: TopVendorsChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-slate-500">No vendor data</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <defs>
            {data.map((entry, index) => {
              const base = entry.color || fallbackColors[index % fallbackColors.length]
              return (
                <linearGradient key={index} id={`vendorBar-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
                  <stop offset="35%" stopColor={base} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={base} stopOpacity={0.65} />
                </linearGradient>
              )
            })}
          </defs>
          <CartesianGrid stroke="var(--chart-grid, rgba(0,0,0,0.08))" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" stroke="var(--text-secondary)" />
          <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={90} />
          <Tooltip
            content={
              <ChartTooltip
                formatter={(val, name) => ({ label: name || 'Spend', value: formatCurrencyWhole(val as number) })}
              />
            }
          />
          <Bar
            dataKey="value"
            radius={[12, 12, 12, 12]}
            stroke="var(--chart-border)"
            strokeWidth={2}
            style={{ filter: data.length ? `drop-shadow(0 6px 12px ${(data[0].color || fallbackColors[0])}33)` : undefined }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#vendorBar-${index})`}
                style={{ filter: 'drop-shadow(0 0 10px rgba(79,164,255,0.35))' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
