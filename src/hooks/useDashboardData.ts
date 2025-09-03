import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { DashboardStats, ChartData, MonthlyRevenueData } from '@/types'

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [projectStatusData, setProjectStatusData] = useState<ChartData[]>([])
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenueData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all counts in parallel
      const [customersData, projectsData, employeesData, vendorsData, purchaseOrdersData, invoicesData] = await Promise.all([
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('*'),
        supabase.from('employees').select('id', { count: 'exact', head: true }),
        supabase.from('vendors').select('id', { count: 'exact', head: true }),
        supabase.from('purchase_orders').select('*'),
        supabase.from('invoices').select('*')
      ])

      // Calculate revenue from invoices
      const totalRevenue = invoicesData.data?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0
      
      // Calculate monthly revenue (last 6 months)
      const now = new Date()
      const monthlyRevenue: MonthlyRevenueData[] = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const monthRevenue = invoicesData.data?.filter(invoice => {
          const invoiceDate = new Date(invoice.invoice_date)
          return invoiceDate.getMonth() === date.getMonth() && invoiceDate.getFullYear() === date.getFullYear()
        }).reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0
        
        monthlyRevenue.push({ month: monthName, revenue: monthRevenue })
      }

      // Calculate project status distribution
      const projectStatusCounts = projectsData.data?.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const projectStatusChartData: ChartData[] = Object.entries(projectStatusCounts).map(([status, count]) => ({
        name: status,
        value: count as number,
        color: status === 'Active' ? '#10b981' : status === 'Completed' ? '#3b82f6' : '#f59e0b'
      }))

      const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0
      const activePurchaseOrders = purchaseOrdersData.data?.filter(po => po.status !== 0).length || 0
      const pendingInvoices = invoicesData.data?.filter(invoice => invoice.status === 'Pending').length || 0

      setStats({
        totalCustomers: customersData.count || 0,
        totalProjects: projectsData.data?.length || 0,
        totalEmployees: employeesData.count || 0,
        totalVendors: vendorsData.count || 0,
        activePurchaseOrders,
        pendingInvoices,
        totalRevenue,
        monthlyRevenue: currentMonthRevenue
      })

      setProjectStatusData(projectStatusChartData)
      setMonthlyRevenueData(monthlyRevenue)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    stats,
    projectStatusData,
    monthlyRevenueData,
    loading,
    error,
    refresh: fetchDashboardData
  }
}