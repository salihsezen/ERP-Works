import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { ChartData } from '@/types'
import { ChartTooltip } from './ChartTooltip'

interface ProjectStatusChartProps {
  data: ChartData[]
}

const COLORS = {
  Active: 'var(--chart-active)',
  Planning: 'var(--chart-planning)',
  Completed: 'var(--chart-completed)',
  Default: '#8b5cf6'
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        No project data found
      </div>
    )
  }

  const pickColor = (name?: string) => {
    if (!name) return COLORS.Default
    if (name in COLORS) {
      return (COLORS as any)[name] as string
    }
    return COLORS.Default
  }

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
            <filter id="shadow" height="130%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(38,240,255,0.35)" />
            </filter>
            {data.map((entry, index) => (
              <linearGradient key={index} id={`projGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.25} />
                <stop offset="30%" stopColor={pickColor(entry.name)} stopOpacity={0.95} />
                <stop offset="100%" stopColor={pickColor(entry.name)} stopOpacity={0.65} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="82%"
            paddingAngle={6}
            dataKey="value"
            cornerRadius={12}
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
                fill={`url(#projGrad-${index})`} 
                style={{ filter: 'drop-shadow(0 0 10px rgba(168,103,255,0.25))' }}
              />
            ))}
          </Pie>
          <Tooltip
            content={
              <ChartTooltip
                align="shift-up"
                formatter={(value, name) => ({ label: name || '', value: `${value} POs` })}
              />
            }
            wrapperStyle={{ pointerEvents: 'none' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
