import { useState } from 'react'
import { Edit2, Trash2, Search } from 'lucide-react'
import type { Customer } from '@/lib/supabase'
import { getCustomerStatusText } from '@/lib/supabase'

interface CustomerTableProps {
  customers: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Customer>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter and sort customers
  const filteredAndSortedCustomers = customers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
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
            placeholder="Search customers..."
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
                onClick={() => handleSort('name')}
              >
                Customer Name
                {sortField === 'name' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Contact Person
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Segment
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
            {filteredAndSortedCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  {searchTerm ? 'No customers found matching search criteria' : 'No customers registered yet'}
                </td>
              </tr>
            ) : (
              filteredAndSortedCustomers.map((customer, index) => (
                <tr key={customer.id} className={`hover:bg-slate-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                }`}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{customer.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {customer.contact_person || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {customer.email || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {customer.phone || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {customer.segment || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(customer)}
                        className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(customer)}
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
        Total {filteredAndSortedCustomers.length} customers
      </div>
    </div>
  )
}