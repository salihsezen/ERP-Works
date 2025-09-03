import { useState } from 'react'
import { useCustomers } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { CustomerTable } from '@/components/customers/CustomerTable'
import { Plus } from 'lucide-react'
import type { Customer } from '@/lib/supabase'

export function Customers() {
  const { data: customers, loading, error, create, update, remove } = useCustomers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const handleCreate = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(customerData)
      setIsModalOpen(false)
    } catch (err) {
      alert('Müşteri oluşturulurken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleUpdate = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingCustomer) return
    
    try {
      await update(editingCustomer.id, customerData)
      setIsModalOpen(false)
      setEditingCustomer(null)
    } catch (err) {
      alert('Müşteri güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`${customer.name} adlı müşteriyi silmek istediğinizden emin misiniz?`)) {
      return
    }
    
    try {
      await remove(customer.id)
    } catch (err) {
      alert('Müşteri silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600 mt-1">Manage customer information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
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