import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type TableName = keyof Database['public']['Tables']
type TableRow<K extends TableName> = Database['public']['Tables'][K]['Row']
type TableInsert<K extends TableName> = Database['public']['Tables'][K]['Insert']

// Generic hook for database operations
export function useDatabase<K extends TableName>(tableName: K) {
  const [data, setData] = useState<TableRow<K>[]>([])
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
      
      setData((result as unknown as TableRow<K>[]) || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const create = async (item: Omit<TableInsert<K>, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error: createError } = await supabase
        .from(tableName)
        .insert([{ ...(item as TableInsert<K>), updated_at: new Date().toISOString() } as any])
        .select()
      
      if (createError) {
        throw createError
      }
      
      await fetchData() // Refresh data
      return result[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Create operation failed')
    }
  }

  const update = async (id: number, updates: Partial<TableInsert<K>>) => {
    try {
      const { data: result, error: updateError } = await supabase
        .from(tableName)
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq('id', id as any)
        .select()
      
      if (updateError) {
        throw updateError
      }
      
      await fetchData() // Refresh data
      return result[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Update operation failed')
    }
  }

  const remove = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id as any)
      
      if (deleteError) {
        throw deleteError
      }
      
      await fetchData() // Refresh data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Delete operation failed')
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
export const useCustomers = () => useDatabase('customers')
export const useEmployees = () => useDatabase('employees')
export const useProjects = () => useDatabase('projects')
export const useVendors = () => useDatabase('vendors')
export const usePurchaseOrders = () => useDatabase('purchase_orders')
export const useInvoices = () => useDatabase('invoices')
