import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'indigo' | 'orange' | 'red' | 'emerald' | 'teal' | 'yellow'
  onClick?: () => void
}

const bgGradients = {
  blue: 'from-[#1d4ed8] via-[#4fa4ff] to-[#1d4ed8]',
  green: 'from-[#16a34a] via-[#3bf0ad] to-[#0ea35c]',
  purple: 'from-[#6d28d9] via-[#a867ff] to-[#6d28d9]',
  indigo: 'from-[#312e81] via-[#6366f1] to-[#312e81]',
  orange: 'from-[#ea580c] via-[#f97316] to-[#ea580c]',
  red: 'from-[#b91c1c] via-[#ef4444] to-[#b91c1c]',
  emerald: 'from-[#065f46] via-[#34d399] to-[#065f46]',
  teal: 'from-[#0f766e] via-[#26f0ff] to-[#0f766e]',
  yellow: 'from-[#facc15] via-[#fbbf24] to-[#f59e0b]'
}

const iconGlow = {
  blue: 'shadow-[0_0_16px_rgba(79,164,255,0.6)] text-blue-100',
  green: 'shadow-[0_0_16px_rgba(59,240,173,0.6)] text-emerald-100',
  purple: 'shadow-[0_0_16px_rgba(168,103,255,0.6)] text-purple-100',
  indigo: 'shadow-[0_0_16px_rgba(99,102,241,0.6)] text-indigo-100',
  orange: 'shadow-[0_0_16px_rgba(249,115,22,0.6)] text-orange-100',
  red: 'shadow-[0_0_16px_rgba(239,68,68,0.6)] text-red-100',
  emerald: 'shadow-[0_0_16px_rgba(52,211,153,0.6)] text-emerald-100',
  teal: 'shadow-[0_0_16px_rgba(38,240,255,0.6)] text-teal-100',
  yellow: 'shadow-[0_0_16px_rgba(250,204,21,0.6)] text-amber-100'
}

export function StatsCard({ title, value, icon: Icon, color, onClick }: StatsCardProps) {
  return (
    <div
      className={`rounded-2xl p-4 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),rgba(255,255,255,0)),rgba(9,12,20,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:translate-y-[-2px] hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)] ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradients[color]} border border-white/10 ${iconGlow[color]} drop-shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
