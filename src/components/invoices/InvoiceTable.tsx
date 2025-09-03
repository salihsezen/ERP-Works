import { useState } from 'react'
import { Edit2, Trash2, Search } from 'lucide-react'
import type { Invoice } from '@/lib/supabase'

interface InvoiceTableProps {
  invoices: Invoice[]
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
}

export function InvoiceTable({ invoices, onEdit, onDelete }: InvoiceTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Invoice>('invoice_date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number, currency: string = 'CAD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US')
  }

  const isOverdue = (invoice: Invoice) => {
    if (invoice.status === 'Paid' || invoice.status === 'Cancelled') {
      return false
    }
    const today = new Date()
    const dueDate = new Date(invoice.due_date)
    return dueDate < today
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
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
          <thead className="bg-slate-50">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('invoice_no')}
              >
                Invoice No
                {sortField === 'invoice_no' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Project
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('amount')}
              >
                Amount
                {sortField === 'amount' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('invoice_date')}
              >
                Invoice Date
                {sortField === 'invoice_date' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('due_date')}
              >
                Due Date
                {sortField === 'due_date' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredAndSortedInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  {searchTerm ? 'No invoices found matching search criteria' : 'No invoices registered yet'}
                </td>
              </tr>
            ) : (
              filteredAndSortedInvoices.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className={`hover:bg-slate-50 ${
                    isOverdue(invoice) ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{invoice.invoice_no}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {invoice.project_no || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {formatDate(invoice.invoice_date)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className={`text-slate-600 ${
                      isOverdue(invoice) ? 'text-red-600 font-medium' : ''
                    }`}>
                      {formatDate(invoice.due_date)}
                      {isOverdue(invoice) && (
                        <span className="ml-2 text-xs text-red-500">Overdue</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status || 'Pending')}`}>
                      {invoice.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(invoice)}
                        className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(invoice)}
                        className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 border-t border-slate-200 text-sm text-slate-600">
        Total {filteredAndSortedInvoices.length} invoices
        {filteredAndSortedInvoices.some(isOverdue) && (
          <span className="ml-4 text-red-600">
            • {filteredAndSortedInvoices.filter(isOverdue).length} overdue
          </span>
        )}
      </div>
    </div>
  )
}