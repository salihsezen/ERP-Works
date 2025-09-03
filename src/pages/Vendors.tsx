import { useState } from 'react'
import { useVendors } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { VendorForm } from '@/components/vendors/VendorForm'
import { VendorTable } from '@/components/vendors/VendorTable'
import { Plus } from 'lucide-react'
import type { Vendor } from '@/lib/supabase'

export function Vendors() {
  const { data: vendors, loading, error, create, update, remove } = useVendors()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

  const handleCreate = async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(vendorData)
      setIsModalOpen(false)
    } catch (err) {
      alert('Error creating vendor: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleUpdate = async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingVendor) return
    
    try {
      await update(editingVendor.id, vendorData)
      setIsModalOpen(false)
      setEditingVendor(null)
    } catch (err) {
      alert('Error updating vendor: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setIsModalOpen(true)
  }

  const handleDelete = async (vendor: Vendor) => {
    if (!confirm(`Are you sure you want to delete vendor ${vendor.vendor_name}?`)) {
      return
    }
    
    try {
      await remove(vendor.id)
    } catch (err) {
      alert('Error deleting vendor: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingVendor(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>
          <p className="text-slate-600 mt-1">Manage vendor information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Vendor
        </button>
      </div>

      {/* Table */}
      <VendorTable
        vendors={vendors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVendor ? 'Edit Vendor' : 'New Vendor'}
        size="lg"
      >
        <VendorForm
          vendor={editingVendor}
          onSubmit={editingVendor ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}