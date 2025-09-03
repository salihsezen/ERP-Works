import { useState } from 'react'
import type { Vendor } from '@/lib/supabase'

interface VendorFormProps {
  vendor?: Vendor | null
  onSubmit: (data: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

export function VendorForm({ vendor, onSubmit, onCancel }: VendorFormProps) {
  const [formData, setFormData] = useState({
    vendor_no: vendor?.vendor_no || '',
    vendor_name: vendor?.vendor_name || '',
    vendor_type: vendor?.vendor_type ?? 0,
    contact_person: vendor?.contact_person || '',
    contact_phone: vendor?.contact_phone || '',
    contact_email: vendor?.contact_email || '',
    payment: vendor?.payment || '',
    status: vendor?.status ?? 1
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.vendor_no.trim()) {
      newErrors.vendor_no = 'Vendor number is required'
    }
    
    if (!formData.vendor_name.trim()) {
      newErrors.vendor_name = 'Vendor name is required'
    }
    
    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address'
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
        {/* Vendor Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Vendor Number *
          </label>
          <input
            type="text"
            value={formData.vendor_no}
            onChange={(e) => handleChange('vendor_no', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.vendor_no ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="VEN-001"
          />
          {errors.vendor_no && <p className="text-red-600 text-sm mt-1">{errors.vendor_no}</p>}
        </div>

        {/* Vendor Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Vendor Name *
          </label>
          <input
            type="text"
            value={formData.vendor_name}
            onChange={(e) => handleChange('vendor_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.vendor_name ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="Enter vendor name"
          />
          {errors.vendor_name && <p className="text-red-600 text-sm mt-1">{errors.vendor_name}</p>}
        </div>

        {/* Vendor Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Vendor Type
          </label>
          <select
            value={formData.vendor_type}
            onChange={(e) => handleChange('vendor_type', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Contractor</option>
            <option value={1}>Supplier</option>
          </select>
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

        {/* Contact Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => handleChange('contact_phone', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (416) 555-0100"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => handleChange('contact_email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contact_email ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="example@email.com"
          />
          {errors.contact_email && <p className="text-red-600 text-sm mt-1">{errors.contact_email}</p>}
        </div>

        {/* Payment Terms */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Payment Terms
          </label>
          <select
            value={formData.payment}
            onChange={(e) => handleChange('payment', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select payment terms</option>
            <option value="Prepaid">Prepaid</option>
            <option value="Net 15">Net 15</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 60">Net 60</option>
            <option value="Net 90">Net 90</option>
          </select>
        </div>

        {/* Status */}
        <div className="md:col-span-2">
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
          {vendor ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}