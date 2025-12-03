import { useEffect, useState } from 'react'
import { useInvoices } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { Plus } from 'lucide-react'
import type { Invoice } from '@/lib/supabase'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { normalizeInvoiceStatus, type InvoiceStatus } from '@/lib/status'
import { useApprovalState } from '@/lib/approvals'

export function Invoices() {
  const { data: invoices, loading, error, create, update, remove } = useInvoices()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [searchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') as InvoiceStatus | null
  const { approvals, setApproval } = useApprovalState('invoice', invoices)

  const handleCreate = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(invoiceData)
      setIsModalOpen(false)
      toast.success('Invoice created')
    } catch (err) {
      toast.error('Error while creating invoice', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleUpdate = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingInvoice) return
    
    try {
      await update(editingInvoice.id, invoiceData)
      setIsModalOpen(false)
      setEditingInvoice(null)
      toast.success('Invoice updated')
    } catch (err) {
      toast.error('Error while updating invoice', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleDelete = async (invoice: Invoice) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.invoice_no}?`)) {
      return
    }
    
    try {
      await remove(invoice.id)
      toast.success('Invoice deleted')
    } catch (err) {
      toast.error('Error while deleting invoice', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleApprove = async (invoice: Invoice) => {
    try {
      setApproval(invoice.id, 'approved')
      toast.success('Invoice approved')
    } catch (err) {
      toast.error('Error while approving invoice', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleReject = async (invoice: Invoice) => {
    try {
      setApproval(invoice.id, 'rejected')
      toast.success('Invoice rejected')
    } catch (err) {
      toast.error('Error while rejecting invoice', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingInvoice(null)
  }

  useEffect(() => {
    if (error) {
      toast.error('Failed to load invoices', { description: error })
    }
  }, [error])

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

  const filteredInvoices = statusFilter
    ? invoices.filter(inv => normalizeInvoiceStatus(inv.status) === normalizeInvoiceStatus(statusFilter))
    : invoices

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Invoices</h1>
          <p className="text-slate-600 mt-1">Manage invoice information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      {/* Table */}
      <InvoiceTable
        invoices={filteredInvoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
        approvals={approvals}
        onApprove={handleApprove}
        onReject={handleReject}
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
