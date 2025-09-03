import { useState } from 'react'
import { usePurchaseOrders } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { PurchaseOrderForm } from '@/components/purchase-orders/PurchaseOrderForm'
import { PurchaseOrderTable } from '@/components/purchase-orders/PurchaseOrderTable'
import { Plus } from 'lucide-react'
import type { PurchaseOrder } from '@/lib/supabase'

export function PurchaseOrders() {
  const { data: purchaseOrders, loading, error, create, update, remove } = usePurchaseOrders()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<PurchaseOrder | null>(null)

  const handleCreate = async (purchaseOrderData: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(purchaseOrderData)
      setIsModalOpen(false)
    } catch (err) {
      alert('Satın alma siparişi oluşturulurken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleUpdate = async (purchaseOrderData: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingPurchaseOrder) return
    
    try {
      await update(editingPurchaseOrder.id, purchaseOrderData)
      setIsModalOpen(false)
      setEditingPurchaseOrder(null)
    } catch (err) {
      alert('Satın alma siparişi güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleEdit = (purchaseOrder: PurchaseOrder) => {
    setEditingPurchaseOrder(purchaseOrder)
    setIsModalOpen(true)
  }

  const handleDelete = async (purchaseOrder: PurchaseOrder) => {
    if (!confirm('Bu satın alma siparişini silmek istediğinizden emin misiniz?')) {
      return
    }
    
    try {
      await remove(purchaseOrder.id)
    } catch (err) {
      alert('Satın alma siparişi silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPurchaseOrder(null)
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
          <h1 className="text-2xl font-bold text-slate-900">Purchase Orders</h1>
          <p className="text-slate-600 mt-1">Manage purchase orders</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </button>
      </div>

      {/* Table */}
      <PurchaseOrderTable
        purchaseOrders={purchaseOrders}
        onEdit={handleEdit}
        onDelete={handleDelete}
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