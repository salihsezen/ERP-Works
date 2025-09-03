import { useState } from 'react'
import type { Customer } from '@/lib/supabase'

interface CustomerFormProps {
  customer?: Customer | null
  onSubmit: (data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    contact_person: customer?.contact_person || '',
    address: customer?.address || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    segment: customer?.segment || '',
    status: customer?.status ?? 1
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required'
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

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="Enter customer name"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contact Person
          </label>
          <input
            type="text"
            value={formData.contact_person}
            onChange={(e) => handleChange('contact_person', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contact person name"
          />
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

        {/* Segment */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Segment
          </label>
          <select
            value={formData.segment}
            onChange={(e) => handleChange('segment', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select segment</option>
            <option value="Enterprise">Enterprise</option>
            <option value="SMB">SMB</option>
            <option value="Individual">Individual</option>
            <option value="Government">Government</option>
          </select>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Customer address"
          />
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
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
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
          {customer ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}