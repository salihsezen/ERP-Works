import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'indigo' | 'orange' | 'red' | 'emerald' | 'teal'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  teal: 'bg-teal-50 text-teal-600 border-teal-200'
}

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}