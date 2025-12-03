import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Support both Vite runtime (import.meta.env) and Node scripts (process.env)
const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : undefined)

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : undefined)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env/.env.local and restart the dev server.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Convenience interfaces for app-level typing
export interface Customer {
  id: number
  name: string
  contact_person?: string
  address?: string
  email?: string
  phone?: string
  segment?: string
  status?: number
  created_at?: string
  updated_at?: string
}

export interface Employee {
  id: number
  first_name: string
  last_name: string
  email?: string
  department?: string
  phone?: string
  created_at?: string
  updated_at?: string
}

export interface Project {
  id: number
  project_number: string
  customer_name: string
  start_date: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface Vendor {
  id: number
  vendor_no: string
  vendor_name: string
  vendor_type?: number
  contact_person?: string
  contact_phone?: string
  contact_email?: string
  payment?: string
  status?: number
  created_at?: string
  updated_at?: string
}

export interface PurchaseOrder {
  id: number
  project_id: number
  vendor_id: number
  project_no?: string
  vendor_name?: string
  cost_type?: string
  amount: number
  currency?: string
  status?: number // 0: Cancelled, 1: Received, 2: Ordered, 3: In Review
  created_at?: string
  updated_at?: string
}

export interface Invoice {
  id: number
  invoice_no: string
  project_id: number
  project_no?: string
  amount: number
  currency?: string
  invoice_date: string
  status?: string
  due_date: string
  created_at?: string
  updated_at?: string
}

// Utility functions for status mapping
export const getPurchaseOrderStatusText = (status: number) => {
  switch (status) {
    case 0: return 'Cancelled'
    case 1: return 'Received'
    case 2: return 'Ordered'
    case 3: return 'In Review'
    default: return 'Unknown'
  }
}

export const getPurchaseOrderStatusColor = (status: number) => {
  switch (status) {
    case 0: return 'bg-red-100 text-red-800'
    case 1: return 'bg-green-100 text-green-800'
    case 2: return 'bg-blue-100 text-blue-800'
    case 3: return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const getCustomerStatusText = (status: number) => {
  return status === 1 ? 'Active' : 'Inactive'
}

export const getVendorStatusText = (status: number) => {
  return status === 1 ? 'Active' : 'Inactive'
}

export const getVendorTypeText = (type: number) => {
  return type === 1 ? 'Supplier' : 'Contractor'
}

// Phone number formatting utility
export const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')
  
  // North American formats
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phone // Return as-is if not matching expected format
}
