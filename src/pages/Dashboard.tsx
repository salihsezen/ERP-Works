import { useDashboardData } from '@/hooks/useDashboardData'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ProjectStatusChart } from '@/components/dashboard/ProjectStatusChart'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import {
  Users,
  FolderOpen,
  Building2,
  UserCheck,
  ShoppingCart,
  FileText,
  TrendingUp,
  DollarSign
} from 'lucide-react'

export function Dashboard() {
  const { stats, projectStatusData, monthlyRevenueData, loading, error } = useDashboardData()

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers.toString()}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Projects"
          value={stats.totalProjects.toString()}
          icon={FolderOpen}
          color="green"
        />
        <StatsCard
          title="Vendors"
          value={stats.totalVendors.toString()}
          icon={Building2}
          color="purple"
        />
        <StatsCard
          title="Employees"
          value={stats.totalEmployees.toString()}
          icon={UserCheck}
          color="indigo"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Purchase Orders"
          value={stats.activePurchaseOrders.toString()}
          icon={ShoppingCart}
          color="orange"
        />
        <StatsCard
          title="Pending Invoices"
          value={stats.pendingInvoices.toString()}
          icon={FileText}
          color="red"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          color="emerald"
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={TrendingUp}
          color="teal"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Project Status Distribution
          </h3>
          <ProjectStatusChart data={projectStatusData} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Monthly Revenue Trend
          </h3>
          <RevenueChart data={monthlyRevenueData} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          System Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="font-medium text-slate-900">Customer Management</p>
            <p>Total {stats.totalCustomers} customers registered</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="font-medium text-slate-900">Project Tracking</p>
            <p>{stats.totalProjects} active projects running</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="font-medium text-slate-900">Financial Status</p>
            <p>{formatCurrency(stats.totalRevenue)} total revenue</p>
          </div>
        </div>
      </div>
    </div>
  )
}