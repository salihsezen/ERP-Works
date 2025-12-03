import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import type { MonthlyRevenueData } from '@/types'
import { formatCurrencyWhole } from '@/utils/format'
import { ChartTooltip } from './ChartTooltip'

interface RevenueChartProps {
  data: MonthlyRevenueData[]
}

// Veriye sanal "revenue70" alanını ekleyen yardımcı fonksiyon
const prepareChartData = (data: MonthlyRevenueData[]) => {
  return data.map(item => ({
    ...item,
    revenue70: item.revenue * 0.7,
  }))
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        No revenue data found
      </div>
    )
  }

  const chartData = prepareChartData(data)

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, left: 5, right: 5, bottom: 5 }}>
          
          <defs>
            {/* GRADIENT: NetSales (Mavi -> Mor) */}
            <linearGradient id="colorSalesArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#26F0FF" stopOpacity={0.6} /> 
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4} />
            </linearGradient>

            {/* Çizgi glow gradient'i */}
            <linearGradient id="revGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#26F0FF" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#26F0FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#26F0FF" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="var(--chart-grid, rgba(0,0,0,0.08))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
          <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(v) => formatCurrencyWhole(v)} />

          <Tooltip
            content={
              <ChartTooltip
                allowedLabels={['Revenue', 'Cost']}
                formatter={(value: number, name: string) => {
                  if (name === 'revenue') {
                    return { label: 'Revenue', value: formatCurrencyWhole(value) }
                  } else if (name === 'revenue70') {
                    return { label: 'Cost', value: formatCurrencyWhole(value) }
                  }
                  return { label: name, value: formatCurrencyWhole(value) }
                }}
              />
            }
          />
          
          {/* NetSales Area (arka planda) */}
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue Area"
            stroke="none"
            fill="url(#colorSalesArea)"
            fillOpacity={1}
          />

          {/* --- LINES --- */}

          {/* Cost = Revenue * 0.7 çizgisi */}
          <Line
            type="monotone"
            dataKey="revenue70"
            name="Cost"
            stroke="#ef4444"
            strokeWidth={2.25}
            strokeDasharray="6 6"
            dot={false}
          />

          {/* NetSales Ana Çizgi */}
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#26F0FF"
            strokeWidth={3.5}
            dot={{
              r: 4,
              fill: '#26F0FF',
              stroke: '#0ea5e9',
              strokeWidth: 2,
              filter: 'drop-shadow(0 0 8px rgba(38,240,255,0.7))',
            }}
            activeDot={{
              r: 6,
              fill: '#FF5BCE',
              strokeWidth: 0,
              filter: 'drop-shadow(0 0 10px rgba(255,91,206,0.9))',
            }}
          />

          {/* NetSales Glow */}
          <Line
            type="monotone"
            dataKey="revenue"
            name="Glow"
            stroke="url(#revGlow)"
            strokeWidth={14}
            strokeOpacity={0.35}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
