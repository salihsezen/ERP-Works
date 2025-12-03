// Shared status definitions for consistency across forms and tables

export type InvoiceStatus = 'Pending' | 'Approved' | 'Paid' | 'Overdue' | 'Cancelled'

export const INVOICE_STATUSES: { value: InvoiceStatus; label: string }[] = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Overdue', label: 'Overdue' },
  { value: 'Cancelled', label: 'Cancelled' },
]

export const normalizeInvoiceStatus = (status?: string): InvoiceStatus => {
  if (status === 'Paid' || status === 'Overdue' || status === 'Cancelled' || status === 'Pending' || status === 'Approved') {
    return status
  }
  return 'Pending'
}

export type PurchaseOrderStatus = 0 | 1 | 2 | 3
// 0: Cancelled, 1: Received, 2: Ordered, 3: Under Review
export const PURCHASE_ORDER_STATUSES: { value: PurchaseOrderStatus; label: string }[] = [
  { value: 3, label: 'Under Review' },
  { value: 2, label: 'Ordered' },
  { value: 1, label: 'Received' },
  { value: 0, label: 'Cancelled' },
]

export const isActivePurchaseOrderStatus = (status?: number | null) => {
  return status !== 0
}
