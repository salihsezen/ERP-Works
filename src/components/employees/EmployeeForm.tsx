import { useState } from 'react'
import type { Employee } from '@/lib/supabase'

interface EmployeeFormProps {
  employee?: Employee | null
  onSubmit: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

export function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    first_name: employee?.first_name || '',
    last_name: employee?.last_name || '',
    email: employee?.email || '',
    department: employee?.department || '',
    phone: employee?.phone || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
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
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.first_name ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="Employee's first name"
          />
          {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.last_name ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="Employee's last name"
          />
          {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="example@email.com"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (416) 555-0100"
          />
        </div>

        {/* Department */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Department
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select department</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Accounting">Accounting</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="Project Management">Project Management</option>
            <option value="Quality Assurance">Quality Assurance</option>
            <option value="Research & Development">Research & Development</option>
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
          {employee ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}