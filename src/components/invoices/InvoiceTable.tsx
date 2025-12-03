import { useState } from 'react'
import { Edit2, Trash2, Search, ChevronUp, ChevronDown, Info } from 'lucide-react'
import type { Invoice } from '@/lib/supabase'
import type { InvoiceStatus } from '@/lib/status'

interface InvoiceTableProps {
  invoices: Invoice[]
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
  approvals?: Record<number, { state: 'pending' | 'approved' | 'rejected'; lastUpdated?: string }>
  onApprove?: (invoice: Invoice) => void
  onReject?: (invoice: Invoice) => void
}

export function InvoiceTable({ invoices, onEdit, onDelete, approvals, onApprove, onReject }: InvoiceTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Invoice>('invoice_date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const normalizeStatus = (status?: string): InvoiceStatus => {
    if (status === 'Paid' || status === 'Overdue' || status === 'Cancelled' || status === 'Pending') {
      return status
    }
    return 'Pending'
  }

  // Filter and sort invoices
  const filteredAndSortedInvoices = invoices
    .filter(invoice => 
      invoice.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.project_no?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const renderSortIcon = (field: keyof Invoice) => {
    if (sortField !== field) return null
    return sortDirection === 'asc'
      ? <ChevronUp className="w-3 h-3 inline opacity-60" />
      : <ChevronDown className="w-3 h-3 inline opacity-60" />
  }

  const renderApprovalBadge = (displayState: 'pending' | 'approved' | 'rejected' | 'na' | 'hidden') => {
    if (displayState === 'hidden') return null
    const base = 'inline-flex px-2 py-1 text-[11px] font-medium rounded-full'
    if (displayState === 'approved') {
      return <span className={`${base} bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-400/50`}>Approved</span>
    }
    if (displayState === 'rejected') {
      return <span className={`${base} bg-red-100 text-red-700 border border-red-300 dark:bg-red-500/20 dark:text-red-200 dark:border-red-400/50`}>Rejected</span>
    }
    if (displayState === 'na') {
      return <span className={`${base} bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-400/50`}>Approval: N/A</span>
    }
    return <span className={`${base} bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-500/20 dark:text-slate-200 dark:border-slate-400/50`}>Approval: Pending</span>
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
      case 'Paid':
        return 'System'
      case 'Overdue':
        return 'System'
      case 'Pending':
        return 'Controller'
      default:
        return 'System'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200'
      case 'Pending':
        return 'bg-amber-100 text-amber-700 dark:bg-yellow-500/20 dark:text-yellow-200'
      case 'Overdue':
        return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200'
      case 'Cancelled':
        return 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200'
      default:
        return 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200'
    }
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

  const isOverdue = (invoice: Invoice) => {
    const normalized = normalizeStatus(invoice.status)
    return normalized === 'Overdue'
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
            placeholder="Search invoices..."
            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--bg-table-header)]">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('invoice_no')}
              >
                Invoice No
                <span className="ml-1">{renderSortIcon('invoice_no')}</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Project
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('invoice_date')}
              >
                Invoice Date
                <span className="ml-1">{renderSortIcon('invoice_date')}</span>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('due_date')}
              >
                Due Date
                <span className="ml-1">{renderSortIcon('due_date')}</span>
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
            {filteredAndSortedInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  {searchTerm ? 'No invoices found matching search criteria' : 'No invoices registered yet'}
                </td>
              </tr>
            ) : (
              filteredAndSortedInvoices.map((invoice, index) => {
                const normalized = normalizeStatus(invoice.status)
                const rawApproval = approvals?.[invoice.id]?.state ?? 'pending'

                // Deterministic display per rules
                let renderedStatus: InvoiceStatus = normalized
                let renderedApproval: 'pending' | 'approved' | 'rejected' | 'na' | 'hidden' = 'pending'
                let isOverdueRow = false
                let overdueTitle: string | undefined
                let auditAction = 'Pending'
                let auditTimestamp = approvals?.[invoice.id]?.lastUpdated || invoice.updated_at || invoice.created_at

                switch (normalized) {
                  case 'Cancelled':
                    renderedStatus = 'Cancelled'
                    renderedApproval = 'na'
                    auditAction = 'Cancelled'
                    break
                  case 'Pending':
                    renderedStatus = 'Pending'
                    renderedApproval = 'pending'
                    auditAction = 'Pending'
                    break
                  case 'Approved':
                    renderedStatus = 'Approved'
                    renderedApproval = 'approved'
                    auditAction = 'Approved'
                    break
                  case 'Paid':
                    renderedStatus = 'Paid'
                    renderedApproval = 'approved'
                    auditAction = 'Paid'
                    break
                  case 'Overdue':
                    renderedStatus = 'Overdue'
                    renderedApproval = 'approved'
                    isOverdueRow = true
                    auditAction = 'Overdue'
                    overdueTitle = (() => {
                      const days = Math.max(1, Math.ceil((Date.now() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24)))
                      return `Overdue by ${days} days`
                    })()
                    break
                  default:
                    renderedStatus = normalized
                    renderedApproval = rawApproval as any
                }

                // Enforce invalid combo cleanup visually
                if (renderedStatus === 'Pending' && renderedApproval !== 'pending') {
                  renderedApproval = 'pending'
                  auditAction = 'Pending'
                }
                if (renderedStatus === 'Approved' && renderedApproval !== 'approved') {
                  renderedApproval = 'approved'
                  auditAction = 'Approved'
                }
                if (renderedStatus === 'Paid' && renderedApproval !== 'approved') {
                  renderedApproval = 'approved'
                  auditAction = 'Paid'
                }
                if (renderedStatus === 'Overdue' && renderedApproval !== 'approved') {
                  renderedApproval = 'approved'
                  auditAction = 'Overdue'
                }

                const showApprovalActions = Boolean(onApprove && onReject && renderedApproval === 'pending')

                return (
                  <tr 
                    key={invoice.id} 
                    className={`hover:bg-[var(--bg-table-hover)] ${
                      index % 2 === 0 ? 'bg-[var(--bg-table-row)]' : 'bg-[var(--bg-table-row-alt)]'
                    } ${isOverdueRow ? 'bg-red-500/5' : ''}`}
                    title={overdueTitle}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`font-medium ${isOverdueRow ? 'text-red-400 font-semibold' : 'text-[var(--text-primary)]'}`} title={overdueTitle}>
                        {invoice.invoice_no}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {invoice.project_no ? (
                        <span className="text-blue-400">{invoice.project_no}</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                      {formatDate(invoice.invoice_date)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-200">
                      {formatDate(invoice.due_date)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-[var(--text-primary)]">
                        {(invoice.currency || '').trim() ? `${invoice.currency} ` : ''}{formatAmount(invoice.amount)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(renderedStatus)}`}>
                          {renderedStatus}
                        </span>
                        {renderApprovalBadge(renderedApproval)}
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
                              onClick={() => onApprove?.(invoice)}
                              className="px-2 py-1 text-xs rounded-lg border border-emerald-500/70 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition dark:text-emerald-200 dark:border-emerald-400/60 dark:bg-emerald-500/10"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onReject?.(invoice)}
                              className="px-2 py-1 text-xs rounded-lg border border-red-500/70 text-red-700 bg-red-50 hover:bg-red-100 transition dark:text-red-200 dark:border-red-400/60 dark:bg-red-500/10"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onEdit(invoice)}
                          className="p-1 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-white/10 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(invoice)}
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
        Total {filteredAndSortedInvoices.length} invoices
        {filteredAndSortedInvoices.some(isOverdue) && (
          <span className="ml-4 text-red-600">
            - {filteredAndSortedInvoices.filter(isOverdue).length} overdue
          </span>
        )}
      </div>
    </div>
  )
}
