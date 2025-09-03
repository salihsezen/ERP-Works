import { useState } from 'react'
import type { Project } from '@/lib/supabase'

interface ProjectFormProps {
  project?: Project | null
  onSubmit: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    project_number: project?.project_number || '',
    customer_name: project?.customer_name || '',
    start_date: project?.start_date || '',
    status: project?.status || 'Active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.project_number.trim()) {
      newErrors.project_number = 'Project number is required'
    }
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required'
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Project Number *
          </label>
          <input
            type="text"
            value={formData.project_number}
            onChange={(e) => handleChange('project_number', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.project_number ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="PRJ-2024-001"
          />
          {errors.project_number && <p className="text-red-600 text-sm mt-1">{errors.project_number}</p>}
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={(e) => handleChange('customer_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.customer_name ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="Enter customer name"
          />
          {errors.customer_name && <p className="text-red-600 text-sm mt-1">{errors.customer_name}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.start_date ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.start_date && <p className="text-red-600 text-sm mt-1">{errors.start_date}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
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
          {project ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}