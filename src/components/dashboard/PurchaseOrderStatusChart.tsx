import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartTooltip } from './ChartTooltip'

interface PurchaseOrderStatusChartProps {
  data: { name: string; value: number; color?: string }[]
}

const defaultPalette = ['#26F0FF', '#3BF0AD', '#A867FF', '#FF5BCE']

export function PurchaseOrderStatusChart({ data }: PurchaseOrderStatusChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-slate-500">No PO data</div>
  }

  const pickColor = (entry: { color?: string }, index: number) =>
    entry.color || defaultPalette[index % defaultPalette.length]

  const RADIAN = Math.PI / 180
  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props
    const radius = innerRadius + (outerRadius - innerRadius) * 0.65
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const pct = Math.round(percent * 100)
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold"
        fill="var(--text-primary, #111827)"
        style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.35))' }}
      >
        <tspan x={x} dy="-0.15em">{name}</tspan>
        <tspan x={x} dy="1.1em">{pct}%</tspan>
      </text>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {data.map((entry, index) => (
              <linearGradient key={index} id={`poGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
                <stop offset="35%" stopColor={pickColor(entry, index)} stopOpacity={0.95} />
                <stop offset="100%" stopColor={pickColor(entry, index)} stopOpacity={0.65} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="82%"
            paddingAngle={8}
            cornerRadius={10}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="var(--chart-border)"
            strokeWidth={3}
            labelLine={false}
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#poGrad-${index})`}
                style={{ filter: `drop-shadow(0 0 10px ${pickColor(entry, index)}33)` }}
              />
            ))}
          </Pie>
          <Tooltip
            content={
              <ChartTooltip
                align="shift-up"
                formatter={(val, name) => ({ label: name || '', value: `${val} POs` })}
              />
            }
            wrapperStyle={{ pointerEvents: 'none' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
