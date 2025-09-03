import { useState } from 'react'
import { Edit2, Trash2, Search } from 'lucide-react'
import type { PurchaseOrder } from '@/lib/supabase'

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[]
  onEdit: (purchaseOrder: PurchaseOrder) => void
  onDelete: (purchaseOrder: PurchaseOrder) => void
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

export function PurchaseOrderTable({ purchaseOrders, onEdit, onDelete }: PurchaseOrderTableProps) {
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

  const formatCurrency = (amount: number, currency: string = 'CAD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US')
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
            placeholder="Search purchase orders..."
            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
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
                onClick={() => handleSort('amount')}
              >
                Amount
                {sortField === 'amount' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('created_at')}
              >
                Created Date
                {sortField === 'created_at' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredAndSortedPurchaseOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  {searchTerm ? 'No purchase orders found matching search criteria' : 'No purchase orders yet'}
                </td>
              </tr>
            ) : (
              filteredAndSortedPurchaseOrders.map((po, index) => (
                <tr key={po.id} className={`hover:bg-slate-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                }`}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{po.project_no || '-'}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {po.vendor_name || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {po.cost_type || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">
                      {formatCurrency(po.amount, po.currency)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPurchaseOrderStatusColor(po.status || 3)}`}>
                      {getPurchaseOrderStatusText(po.status || 3)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {po.created_at ? formatDate(po.created_at) : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(po)}
                        className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(po)}
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
        Total {filteredAndSortedPurchaseOrders.length} purchase orders
      </div>
    </div>
  )
}