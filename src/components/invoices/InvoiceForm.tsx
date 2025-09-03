import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Invoice, Project } from '@/lib/supabase'

interface InvoiceFormProps {
  invoice?: Invoice | null
  onSubmit: (data: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

export function InvoiceForm({ invoice, onSubmit, onCancel }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    invoice_no: invoice?.invoice_no || '',
    project_id: invoice?.project_id || 0,
    project_no: invoice?.project_no || '',
    amount: invoice?.amount || 0,
    currency: invoice?.currency || 'TRY',
    invoice_date: invoice?.invoice_date || '',
    status: invoice?.status || 'Pending',
    due_date: invoice?.due_date || ''
  })

  const [projects, setProjects] = useState<Project[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('project_number')

        if (error) throw error
        if (data) setProjects(data)
      } catch (err) {
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.invoice_no.trim()) {
      newErrors.invoice_no = 'Invoice number is required'
    }
    
    if (!formData.project_id) {
      newErrors.project_id = 'Project selection is required'
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    
    if (!formData.invoice_date) {
      newErrors.invoice_date = 'Invoice date is required'
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required'
    }
    
    if (formData.invoice_date && formData.due_date && formData.due_date < formData.invoice_date) {
      newErrors.due_date = 'Due date cannot be before invoice date'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validate()) {
      // Auto-fill denormalized fields
      const selectedProject = projects.find(p => p.id === formData.project_id)
      
      const submitData = {
        ...formData,
        project_no: selectedProject?.project_number || ''
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

  // Auto-calculate due date when invoice date changes
  const handleInvoiceDateChange = (date: string) => {
    handleChange('invoice_date', date)
    
    if (date && !formData.due_date) {
      // Default to 30 days after invoice date
      const invoiceDate = new Date(date)
      const dueDate = new Date(invoiceDate)
      dueDate.setDate(dueDate.getDate() + 30)
      handleChange('due_date', dueDate.toISOString().split('T')[0])
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
        {/* Invoice Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Invoice Number *
          </label>
          <input
            type="text"
            value={formData.invoice_no}
            onChange={(e) => handleChange('invoice_no', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.invoice_no ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="INV-2024-001"
          />
          {errors.invoice_no && <p className="text-red-600 text-sm mt-1">{errors.invoice_no}</p>}
        </div>

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

        {/* Invoice Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Invoice Date *
          </label>
          <input
            type="date"
            value={formData.invoice_date}
            onChange={(e) => handleInvoiceDateChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.invoice_date ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.invoice_date && <p className="text-red-600 text-sm mt-1">{errors.invoice_date}</p>}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Due Date *
          </label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.due_date ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.due_date && <p className="text-red-600 text-sm mt-1">{errors.due_date}</p>}
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
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
          {invoice ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}