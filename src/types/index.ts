export interface DashboardStats {
  totalCustomers: number
  totalProjects: number
  totalEmployees: number
  totalVendors: number
  activePurchaseOrders: number
  pendingInvoices: number
  totalRevenue: number
  monthlyRevenue: number
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface MonthlyRevenueData {
  month: string
  revenue: number
}

export interface ProjectStatusData {
  status: string
  count: number
  percentage: number
}