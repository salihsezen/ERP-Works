import { useEffect, useState } from 'react'
import { usePurchaseOrders } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { PurchaseOrderForm } from '@/components/purchase-orders/PurchaseOrderForm'
import { PurchaseOrderTable } from '@/components/purchase-orders/PurchaseOrderTable'
import { Plus } from 'lucide-react'
import type { PurchaseOrder } from '@/lib/supabase'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { isActivePurchaseOrderStatus } from '@/lib/status'
import { useApprovalState } from '@/lib/approvals'

export function PurchaseOrders() {
  const { data: purchaseOrders, loading, error, create, update, remove } = usePurchaseOrders()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [searchParams] = useSearchParams()
  const statusFilter = searchParams.get('status')
  const { approvals, setApproval } = useApprovalState('purchase_order', purchaseOrders)

  const handleCreate = async (purchaseOrderData: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(purchaseOrderData)
      setIsModalOpen(false)
      toast.success('Purchase order created')
    } catch (err) {
      toast.error('Error while creating purchase order', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleUpdate = async (purchaseOrderData: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingPurchaseOrder) return
    
    try {
      await update(editingPurchaseOrder.id, purchaseOrderData)
      setIsModalOpen(false)
      setEditingPurchaseOrder(null)
      toast.success('Purchase order updated')
    } catch (err) {
      toast.error('Error while updating purchase order', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleEdit = (purchaseOrder: PurchaseOrder) => {
    setEditingPurchaseOrder(purchaseOrder)
    setIsModalOpen(true)
  }

  const handleDelete = async (purchaseOrder: PurchaseOrder) => {
    if (!confirm('Are you sure you want to delete this purchase order?')) {
      return
    }
    
    try {
      await remove(purchaseOrder.id)
      toast.success('Purchase order deleted')
    } catch (err) {
      toast.error('Error while deleting purchase order', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleApprove = async (purchaseOrder: PurchaseOrder) => {
    try {
      await update(purchaseOrder.id, { status: 2 })
      setApproval(purchaseOrder.id, 'approved')
      toast.success('Purchase order approved')
    } catch (err) {
      toast.error('Error while approving purchase order', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleReject = async (purchaseOrder: PurchaseOrder) => {
    try {
      await update(purchaseOrder.id, { status: 0 })
      setApproval(purchaseOrder.id, 'rejected')
      toast.success('Purchase order rejected')
    } catch (err) {
      toast.error('Error while rejecting purchase order', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPurchaseOrder(null)
  }

  useEffect(() => {
    if (error) {
      toast.error('Failed to load purchase orders', { description: error })
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
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  const filteredPurchaseOrders = statusFilter === 'active'
    ? purchaseOrders.filter(po => isActivePurchaseOrderStatus(po.status))
    : purchaseOrders

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Purchase Orders</h1>
          <p className="text-slate-600 mt-1">Manage purchase orders</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Order
        </button>
      </div>

      {/* Table */}
      <PurchaseOrderTable
        purchaseOrders={filteredPurchaseOrders}
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
        title={editingPurchaseOrder ? 'Edit Purchase Order' : 'New Purchase Order'}
        size="lg"
      >
        <PurchaseOrderForm
          purchaseOrder={editingPurchaseOrder}
          onSubmit={editingPurchaseOrder ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
