import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { ChartTooltip } from './ChartTooltip'

interface PendingInvoicesChartProps {
  data: { label: string; pending: number; dueSoon: number }[]
}

export function PendingInvoicesChart({ data }: PendingInvoicesChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-56 text-slate-500">No invoice due data</div>
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pendingBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
              <stop offset="35%" stopColor="#A867FF" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#26F0FF" stopOpacity={0.65} />
            </linearGradient>
            <linearGradient id="dueSoonBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
              <stop offset="35%" stopColor="#FF5BCE" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#4FA4FF" stopOpacity={0.65} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--chart-grid, rgba(0,0,0,0.08))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={12} />
          <YAxis stroke="var(--text-secondary)" fontSize={12} />
          <Tooltip
            content={
              <ChartTooltip
                formatter={(val, name) => ({ label: name || '', value: `${val}` })}
              />
            }
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
            iconType="circle"
          />
          <Bar
            dataKey="pending"
            fill="url(#pendingBar)"
            radius={[10, 10, 10, 10]}
            barSize={14}
            stroke="var(--chart-border)"
            strokeWidth={2}
            style={{ filter: 'drop-shadow(0 6px 12px #A867FF33)' }}
          />
          <Bar
            dataKey="dueSoon"
            fill="url(#dueSoonBar)"
            radius={[10, 10, 10, 10]}
            barSize={14}
            stroke="var(--chart-border)"
            strokeWidth={2}
            style={{ filter: 'drop-shadow(0 6px 12px #FF5BCE33)' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
