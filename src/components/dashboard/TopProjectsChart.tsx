import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { formatCurrencyWhole } from '@/utils/format'
import { ChartTooltip } from './ChartTooltip'

interface TopProjectsChartProps {
  data: { name: string; value: number; color?: string }[]
}

const palette = ['#4FA4FF', '#26F0FF', '#A867FF', '#FF5BCE', '#3BF0AD']

export function TopProjectsChart({ data }: TopProjectsChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-slate-500">No project revenue data</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 20, right: 10, top: 10, bottom: 5 }}>
          <defs>
            {data.map((entry, index) => {
              const base = entry.color || palette[index % palette.length]
              return (
                <linearGradient key={index} id={`projectBar-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
                  <stop offset="35%" stopColor={base} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={base} stopOpacity={0.7} />
                </linearGradient>
              )
            })}
          </defs>
          <CartesianGrid stroke="var(--chart-grid, rgba(0,0,0,0.08))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="var(--text-secondary)" />
          <YAxis stroke="var(--text-secondary)" />
          <Tooltip
            content={
              <ChartTooltip
                formatter={(val, name) => ({ label: name || 'Revenue', value: formatCurrencyWhole(val as number) })}
              />
            }
          />
          <Bar
            dataKey="value"
            radius={[12, 12, 12, 12]}
            stroke="var(--chart-border)"
            strokeWidth={2}
            style={{ filter: data.length ? `drop-shadow(0 6px 12px ${(data[0].color || palette[0])}33)` : undefined }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#projectBar-${index})`}
                style={{ filter: 'drop-shadow(0 0 10px rgba(255,91,206,0.35))' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
