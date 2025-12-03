import { useState } from 'react'
import { useCustomers } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { CustomerTable } from '@/components/customers/CustomerTable'
import { Plus } from 'lucide-react'
import type { Customer } from '@/lib/supabase'
import { toast } from 'sonner'

export function Customers() {
  const { data: customers, loading, error, create, update, remove } = useCustomers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const handleCreate = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(customerData)
      setIsModalOpen(false)
      toast.success('Customer created')
    } catch (err) {
      toast.error('Error while creating customer', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleUpdate = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingCustomer) return
    
    try {
      await update(editingCustomer.id, customerData)
      setIsModalOpen(false)
      setEditingCustomer(null)
      toast.success('Customer updated')
    } catch (err) {
      toast.error('Error while updating customer', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete ${customer.name}?`)) {
      return
    }
    
    try {
      await remove(customer.id)
      toast.success('Customer deleted')
    } catch (err) {
      toast.error('Error while deleting customer', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
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
        <p className="text-red-600">Hata: {error}</p>
        <p className="text-red-600 mt-2">This error typically occurs when:</p>
        <ul className="list-disc pl-5 mt-2 text-red-600">
          <li>The database tables don't exist</li>
          <li>There are permission issues with the Supabase connection</li>
          <li>The Supabase project is not properly configured</li>
        </ul>
        <p className="text-red-600 mt-2">Please check that the Supabase database is properly set up with the required tables.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Customers</h1>
          <p className="text-slate-600 mt-1">Manage customer information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Customer
        </button>
      </div>

      {/* Table */}
      <CustomerTable
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? 'Edit Customer' : 'New Customer'}
        size="lg"
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={editingCustomer ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
