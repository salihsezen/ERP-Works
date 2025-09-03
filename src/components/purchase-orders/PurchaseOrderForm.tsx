import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { PurchaseOrder, Project, Vendor } from '@/lib/supabase'

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder | null
  onSubmit: (data: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

export function PurchaseOrderForm({ purchaseOrder, onSubmit, onCancel }: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState({
    project_id: purchaseOrder?.project_id || 0,
    vendor_id: purchaseOrder?.vendor_id || 0,
    project_no: purchaseOrder?.project_no || '',
    vendor_name: purchaseOrder?.vendor_name || '',
    cost_type: purchaseOrder?.cost_type || '',
    amount: purchaseOrder?.amount || 0,
    currency: purchaseOrder?.currency || 'TRY',
    status: purchaseOrder?.status ?? 3
  })

  const [projects, setProjects] = useState<Project[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResult, vendorsResult] = await Promise.all([
          supabase.from('projects').select('*').order('project_number'),
          supabase.from('vendors').select('*').eq('status', 1).order('vendor_name')
        ])

        if (projectsResult.data) setProjects(projectsResult.data)
        if (vendorsResult.data) setVendors(vendorsResult.data)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.project_id) {
      newErrors.project_id = 'Project selection is required'
    }
    
    if (!formData.vendor_id) {
      newErrors.vendor_id = 'Vendor selection is required'
    }
    
    if (!formData.cost_type.trim()) {
      newErrors.cost_type = 'Cost type is required'
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validate()) {
      // Auto-fill denormalized fields
      const selectedProject = projects.find(p => p.id === formData.project_id)
      const selectedVendor = vendors.find(v => v.id === formData.vendor_id)
      
      const submitData = {
        ...formData,
        project_no: selectedProject?.project_number || '',
        vendor_name: selectedVendor?.vendor_name || ''
      }
      
      onSubmit(submitData)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Project *
          </label>
          <select
            value={formData.project_id}
            onChange={(e) => handleChange('project_id', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.project_id ? 'border-red-300' : 'border-slate-300'
            }`}
          >
            <option value={0}>Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_number} - {project.customer_name}
              </option>
            ))}
          </select>
          {errors.project_id && <p className="text-red-600 text-sm mt-1">{errors.project_id}</p>}
        </div>

        {/* Vendor Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Vendor *
          </label>
          <select
            value={formData.vendor_id}
            onChange={(e) => handleChange('vendor_id', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.vendor_id ? 'border-red-300' : 'border-slate-300'
            }`}
          >
            <option value={0}>Select vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.vendor_name}
              </option>
            ))}
          </select>
          {errors.vendor_id && <p className="text-red-600 text-sm mt-1">{errors.vendor_id}</p>}
        </div>

        {/* Cost Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cost Type *
          </label>
          <select
            value={formData.cost_type}
            onChange={(e) => handleChange('cost_type', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cost_type ? 'border-red-300' : 'border-slate-300'
            }`}
          >
            <option value="">Select cost type</option>
            <option value="Materials">Materials</option>
            <option value="Services">Services</option>
            <option value="Equipment">Equipment</option>
            <option value="Consulting">Consulting</option>
            <option value="Software">Software</option>
            <option value="Other">Other</option>
          </select>
          {errors.cost_type && <p className="text-red-600 text-sm mt-1">{errors.cost_type}</p>}
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.amount ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="0.00"
          />
          {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={3}>Under Review</option>
            <option value={2}>Ordered</option>
            <option value={1}>Received</option>
            <option value={0}>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {purchaseOrder ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}