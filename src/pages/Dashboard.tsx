import { useDashboardData } from '@/hooks/useDashboardData'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ProjectStatusChart } from '@/components/dashboard/ProjectStatusChart'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { TopVendorsChart } from '@/components/dashboard/TopVendorsChart'
import { TopProjectsChart } from '@/components/dashboard/TopProjectsChart'
import { PendingInvoicesChart } from '@/components/dashboard/PendingInvoicesChart'
import { PurchaseOrderStatusChart } from '@/components/dashboard/PurchaseOrderStatusChart'
import { useNavigate } from 'react-router-dom'
import { formatCurrencyWhole } from '@/utils/format'
import {
  Users,
  FolderOpen,
  Building2,
  UserCheck,
  ShoppingCart,
  FileText,
  TrendingUp,
  DollarSign,
  Receipt,
  Boxes
} from 'lucide-react'

export function Dashboard() {
  const { stats, projectStatusData, monthlyRevenueData, loading, error } = useDashboardData()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center text-slate-600">
        No data found
      </div>
    )
  }

  const topVendorsData = [
    { name: 'ADHECO', value: 124500, color: '#26F0FF' },
    { name: 'FASTENAL', value: 98500, color: '#A867FF' },
    { name: 'R&R RIVET', value: 76400, color: '#4FA4FF' },
    { name: 'ACCURA', value: 55200, color: '#FF5BCE' },
    { name: 'KBC TOOLS', value: 43800, color: '#3BF0AD' }
  ]

  const topProjectsData = [
    { name: 'AP3941', value: 152000 },
    { name: 'HD4054', value: 131200 },
    { name: 'CT4750', value: 98250 },
    { name: 'RIVET-01', value: 74400 },
    { name: 'FAST-09', value: 52300 }
  ]

  const pendingInvoicesDueData = [
    { label: 'This Week', pending: 4, dueSoon: 2 },
    { label: 'Next Week', pending: 6, dueSoon: 3 },
    { label: 'Next 30d', pending: 10, dueSoon: 5 }
  ]

  const poStatusData = [
    { name: 'Ordered', value: Math.max(1, Math.round((stats.activePurchaseOrders || 1) * 0.4)), color: '#4FA4FF' },
    { name: 'Received', value: Math.max(1, Math.round((stats.activePurchaseOrders || 1) * 0.3)), color: '#3BF0AD' },
    { name: 'Under Review', value: Math.max(1, Math.round((stats.activePurchaseOrders || 1) * 0.2)), color: '#A867FF' },
    { name: 'Cancelled', value: Math.max(1, Math.round((stats.activePurchaseOrders || 1) * 0.1)), color: '#FF5BCE' }
  ]

  const overdueCount = stats.overdueInvoices || 0
  const averageInvoiceSize = formatCurrencyWhole(Math.round(stats.totalRevenue / Math.max(1, stats.pendingInvoices + 6)))
  const averageProjectBudget = formatCurrencyWhole(Math.round(stats.totalRevenue / Math.max(1, stats.totalProjects || 1)))
  const outstandingPO = formatCurrencyWhole(Math.round((stats.activePurchaseOrders || 0) * 12500))

  return (
    <div className="space-y-6">
      {/* Primary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Customers" value={stats.totalCustomers.toString()} icon={Users} color="blue" onClick={() => navigate('/customers')} />
        <StatsCard title="Active Projects" value={stats.totalProjects.toString()} icon={FolderOpen} color="green" onClick={() => navigate('/projects?status=Active')} />
        <StatsCard title="Vendors" value={stats.totalVendors.toString()} icon={Building2} color="purple" onClick={() => navigate('/vendors')} />
        <StatsCard title="Employees" value={stats.totalEmployees.toString()} icon={UserCheck} color="indigo" onClick={() => navigate('/employees')} />
      </div>

      {/* KPI glow cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard title="Active POs" value={stats.activePurchaseOrders.toString()} icon={ShoppingCart} color="orange" onClick={() => navigate('/purchase-orders?status=active')} />
        <StatsCard title="Pending Invoices" value={stats.pendingInvoices.toString()} icon={FileText} color="yellow" onClick={() => navigate('/invoices?status=Pending')} />
        <StatsCard title="Overdue Invoices" value={overdueCount.toString()} icon={DollarSign} color="red" onClick={() => navigate('/invoices?status=Overdue')} />
        <StatsCard title="Total Revenue (MTD)" value={formatCurrencyWhole(stats.monthlyRevenue)} icon={TrendingUp} color="teal" />
        <StatsCard title="Avg Invoice Size" value={averageInvoiceSize} icon={Receipt} color="emerald" />
      </div>

      {/* Secondary KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard title="Total Revenue (All time)" value={formatCurrencyWhole(Math.round(stats.totalRevenue))} icon={DollarSign} color="emerald" />
        <StatsCard title="Avg Project Budget" value={averageProjectBudget} icon={FolderOpen} color="purple" />
        <StatsCard title="Outstanding PO Amt" value={outstandingPO} icon={Boxes} color="blue" />
        <StatsCard title="Top Vendor Spend" value={formatCurrencyWhole(Math.round(topVendorsData[0].value))} icon={Building2} color="indigo" />
        <StatsCard title="Top Project Rev" value={formatCurrencyWhole(Math.round(topProjectsData[0].value))} icon={TrendingUp} color="orange" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl p-4 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),rgba(255,255,255,0)),rgba(9,12,20,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Monthly Revenue Trend</h3>
          <RevenueChart data={monthlyRevenueData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-4 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),rgba(255,255,255,0)),rgba(9,12,20,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Project Status</h3>
            <ProjectStatusChart data={projectStatusData} />
          </div>
          <div className="rounded-2xl p-4 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),rgba(255,255,255,0)),rgba(9,12,20,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">PO Status Breakdown</h3>
            <PurchaseOrderStatusChart data={poStatusData} />
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-2xl p-4 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),rgba(255,255,255,0)),rgba(9,12,20,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Top Vendors by Spend</h3>
          <TopVendorsChart data={topVendorsData} />
        </div>
        <div className="rounded-2xl p-4 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),rgba(255,255,255,0)),rgba(9,12,20,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Top Projects by Revenue</h3>
          <TopProjectsChart data={topProjectsData} />
        </div>
        <div className="rounded-2xl p-4 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),rgba(255,255,255,0)),rgba(9,12,20,0.9)] border border-[rgba(255,255,255,0.08)] shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Pending Invoices by Due Date</h3>
          <PendingInvoicesChart data={pendingInvoicesDueData} />
        </div>
      </div>
    </div>
  )
}
