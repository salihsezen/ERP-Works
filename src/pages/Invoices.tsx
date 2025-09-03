import { useState } from 'react'
import { useInvoices } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { Plus } from 'lucide-react'
import type { Invoice } from '@/lib/supabase'

export function Invoices() {
  const { data: invoices, loading, error, create, update, remove } = useInvoices()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)

  const handleCreate = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(invoiceData)
      setIsModalOpen(false)
    } catch (err) {
      alert('Fatura oluşturulurken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleUpdate = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingInvoice) return
    
    try {
      await update(editingInvoice.id, invoiceData)
      setIsModalOpen(false)
      setEditingInvoice(null)
    } catch (err) {
      alert('Fatura güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleDelete = async (invoice: Invoice) => {
    if (!confirm(`${invoice.invoice_no} numaralı faturayı silmek istediğinizden emin misiniz?`)) {
      return
    }
    
    try {
      await remove(invoice.id)
    } catch (err) {
      alert('Fatura silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingInvoice(null)
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
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-600 mt-1">Manage invoice information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </button>
      </div>

      {/* Table */}
      <InvoiceTable
        invoices={invoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingInvoice ? 'Edit Invoice' : 'New Invoice'}
        size="lg"
      >
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={editingInvoice ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}