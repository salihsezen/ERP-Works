import { useState } from 'react'
import { Edit2, Trash2, Search, ChevronUp, ChevronDown, Info } from 'lucide-react'
import type { PurchaseOrder } from '@/lib/supabase'

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[]
  onEdit: (purchaseOrder: PurchaseOrder) => void
  onDelete: (purchaseOrder: PurchaseOrder) => void
  approvals?: Record<number, { state: 'pending' | 'approved' | 'rejected'; lastUpdated?: string }>
  onApprove?: (purchaseOrder: PurchaseOrder) => void
  onReject?: (purchaseOrder: PurchaseOrder) => void
}

const getPurchaseOrderStatusText = (status: number) => {
  switch (status) {
    case 0: return 'Cancelled'
    case 1: return 'Received'
    case 2: return 'Ordered'
    case 3: return 'Under Review'
    default: return 'Unknown'
  }
}

const getPurchaseOrderStatusColor = (status: number) => {
  switch (status) {
    case 0: return 'bg-red-100 text-red-800'
    case 1: return 'bg-green-100 text-green-800'
    case 2: return 'bg-blue-100 text-blue-800'
    case 3: return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getApprovalBadge = (state: 'pending' | 'approved' | 'rejected' | 'na') => {
  switch (state) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-400/50'
    case 'rejected':
      return 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-500/20 dark:text-red-200 dark:border-red-400/50'
    case 'na':
      return 'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-400/50'
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-500/20 dark:text-slate-200 dark:border-slate-400/50'
  }
}

const formatAuditDate = (timestamp?: string) => {
  if (!timestamp) return '--'
  const d = new Date(timestamp)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const formatAuditLine = (action: string, timestamp?: string, actor = 'System') => {
  return {
    text: `Last action: ${action} on ${formatAuditDate(timestamp)}`,
    actor
  }
}

const getAuditRole = (action: string) => {
  switch (action) {
    case 'Approved':
    case 'Rejected':
    case 'Cancelled':
      return 'Controller'
    case 'Received':
      return 'Warehouse'
    case 'Pending':
      return 'Buyer'
    default:
      return 'System'
  }
}

export function PurchaseOrderTable({ purchaseOrders, onEdit, onDelete, approvals, onApprove, onReject }: PurchaseOrderTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof PurchaseOrder>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Filter and sort purchase orders
  const filteredAndSortedPurchaseOrders = purchaseOrders
    .filter(po => 
      po.project_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.cost_type?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField] || ''
      const bValue = b[sortField] || ''
      
      if (sortDirection === 'asc') {
        return aValue.toString().localeCompare(bValue.toString())
      } else {
        return bValue.toString().localeCompare(aValue.toString())
      }
    })

  const handleSort = (field: keyof PurchaseOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const renderSortIcon = (field: keyof PurchaseOrder) => {
    if (sortField !== field) return null
    return sortDirection === 'asc'
      ? <ChevronUp className="w-3 h-3 inline opacity-60" />
      : <ChevronDown className="w-3 h-3 inline opacity-60" />
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US')
  }

  return (
    <div className="card-elevated table-card">
      {/* Search */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search purchase orders..."
            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--bg-table-header)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cost Type
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('created_at')}
              >
                Created Date
                <span className="ml-1">{renderSortIcon('created_at')}</span>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('amount')}
              >
                Amount
                <span className="ml-1">{renderSortIcon('amount')}</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <span className="inline-flex items-center gap-2">
                  Status / Approval
                  <Info className="w-3 h-3 opacity-60" aria-label="Approval rules" />
                </span>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--bg-table-row)] divide-y divide-[var(--table-border)]">
            {filteredAndSortedPurchaseOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  {searchTerm ? 'No purchase orders found matching search criteria' : 'No purchase orders yet'}
                </td>
              </tr>
            ) : (
              filteredAndSortedPurchaseOrders.map((po, index) => {
                const statusValue = po.status ?? 3
                const rawApproval = approvals?.[po.id]?.state ?? 'pending'

                // Deterministic approval display per business rules
                let approvalState: 'pending' | 'approved' | 'rejected' | 'na'
                switch (statusValue) {
                  case 0: // Cancelled
                    approvalState = 'na'
                    break
                  case 2: // Ordered
                    approvalState = 'approved'
                    break
                  case 1: // Received
                  case 3: // Under Review
                  default:
                    approvalState = rawApproval
                    break
                }

                const showApprovalActions = Boolean(onApprove && onReject && approvalState === 'pending')

                const auditAction =
                  statusValue === 0 ? 'Cancelled'
                  : statusValue === 1 ? 'Received'
                  : statusValue === 2 ? 'Approved'
                  : approvalState === 'approved' ? 'Approved'
                  : approvalState === 'rejected' ? 'Rejected'
                  : 'Pending'

                const auditTimestamp = approvals?.[po.id]?.lastUpdated || po.updated_at || po.created_at

                return (
                  <tr key={po.id} className={`hover:bg-[var(--bg-table-hover)] ${
                    index % 2 === 0 ? 'bg-[var(--bg-table-row)]' : 'bg-[var(--bg-table-row-alt)]'
                  }`}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-[var(--text-primary)]">{po.project_no || '-'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                      {po.vendor_name || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                      {po.cost_type || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                      {po.created_at ? formatDate(po.created_at) : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-[var(--text-primary)]">
                        {(po.currency || '').trim() ? `${po.currency} ` : ''}{formatAmount(po.amount)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPurchaseOrderStatusColor(statusValue)}`}>
                          {getPurchaseOrderStatusText(statusValue)}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-[11px] font-medium rounded-full ${getApprovalBadge(approvalState)}`}>
                          {approvalState === 'pending'
                            ? 'Approval: Pending'
                            : approvalState === 'approved'
                              ? 'Approved'
                              : approvalState === 'rejected'
                                ? 'Rejected'
                                : 'Approval: N/A'}
                        </span>
                      </div>
                      <div className="text-[var(--text-secondary)] text-xs mt-1">
                        {(() => {
                          const audit = formatAuditLine(auditAction, auditTimestamp, getAuditRole(auditAction))
                          return (
                            <span className="inline-flex items-center gap-2">
                              {audit.text}
                              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border bg-amber-50 text-amber-800 border-amber-200 dark:bg-slate-500/20 dark:text-slate-200 dark:border-slate-400/40">
                                {audit.actor}
                              </span>
                            </span>
                          )
                        })()}
                      </div>
                </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {showApprovalActions && (
                          <>
                            <button
                              onClick={() => onApprove?.(po)}
                              className="px-2 py-1 text-xs rounded-lg border border-emerald-500/70 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition dark:text-emerald-200 dark:border-emerald-400/60 dark:bg-emerald-500/10"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onReject?.(po)}
                              className="px-2 py-1 text-xs rounded-lg border border-red-500/70 text-red-700 bg-red-50 hover:bg-red-100 transition dark:text-red-200 dark:border-red-400/60 dark:bg-red-500/10"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onEdit(po)}
                          className="p-1 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-white/10 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(po)}
                          className="p-1 text-slate-600 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-white/10 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 border-t border-slate-200 text-sm text-slate-600">
        Total {filteredAndSortedPurchaseOrders.length} purchase orders
      </div>
    </div>
  )
}
