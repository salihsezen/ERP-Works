import React from 'react'

interface ChartTooltipProps {
  label?: string
  payload?: any[]
  formatter?: (value: number | string, name?: string) => { label: string; value: string }
  suffix?: string
  align?: 'default' | 'shift-up'
  allowedLabels?: string[]
}

export const ChartTooltip = ({ label, payload, formatter, suffix, align = 'default', allowedLabels }: ChartTooltipProps) => {
  if (!payload || payload.length === 0) return null

  const seen = new Set<string>()
  const filtered = allowedLabels
    ? payload.filter((item) => allowedLabels.includes(item.name))
    : payload

  const items = filtered
    .map((item, idx) => {
      const formatted = formatter
        ? formatter(item.value as number, item.name)
        : { label: item.name, value: item.value }
      if (!formatted) return null
      const key = (formatted.label || item.name || `k${idx}`) as string
      if (seen.has(key)) return null
      seen.add(key)
      return (
        <div key={key} className="text-sm text-white/90 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: item.color || '#fff' }} />
          <span>{formatted.label || item.name}</span>
          <span className="font-semibold">{formatted.value}{suffix ? ` ${suffix}` : ''}</span>
        </div>
      )
    })
    .filter(Boolean)

  return (
    <div
      className="px-3 py-2 rounded-lg border border-white/10 text-white backdrop-blur-sm"
      style={{
        background: 'rgba(15, 15, 25, 0.55)',
        pointerEvents: 'none',
        transform: align === 'shift-up' ? 'translateY(-10px)' : undefined
      }}
    >
      {label && <div className="text-xs text-white/70 mb-1">{label}</div>}
      <div className="space-y-1">{items}</div>
    </div>
  )
}
