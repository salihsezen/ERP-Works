import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type {
  Customer,
  Employee,
  Project,
  Vendor,
  PurchaseOrder,
  Invoice
} from '@/lib/supabase'

// Generic hook for database operations
export function useDatabase<T>(tableName: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: result, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
      
      if (fetchError) {
        throw fetchError
      }
      
      setData(result || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const create = async (item: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error: createError } = await supabase
        .from(tableName)
        .insert([{ ...item, updated_at: new Date().toISOString() }])
        .select()
      
      if (createError) {
        throw createError
      }
      
      await fetchData() // Refresh data
      return result[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Oluşturma hatası')
    }
  }

  const update = async (id: number, updates: Partial<T>) => {
    try {
      const { data: result, error: updateError } = await supabase
        .from(tableName)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
      
      if (updateError) {
        throw updateError
      }
      
      await fetchData() // Refresh data
      return result[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Güncelleme hatası')
    }
  }

  const remove = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
      
      if (deleteError) {
        throw deleteError
      }
      
      await fetchData() // Refresh data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Silme hatası')
    }
  }

  useEffect(() => {
    fetchData()
  }, [tableName])

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    create,
    update,
    remove
  }
}

// Specific hooks for each table
export const useCustomers = () => useDatabase<Customer>('customers')
export const useEmployees = () => useDatabase<Employee>('employees')
export const useProjects = () => useDatabase<Project>('projects')
export const useVendors = () => useDatabase<Vendor>('vendors')
export const usePurchaseOrders = () => useDatabase<PurchaseOrder>('purchase_orders')
export const useInvoices = () => useDatabase<Invoice>('invoices')