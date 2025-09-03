import { useState } from 'react'
import { Edit2, Trash2, Search } from 'lucide-react'
import type { Project } from '@/lib/supabase'

interface ProjectTableProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectTable({ projects, onEdit, onDelete }: ProjectTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Project>('project_number')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => 
      project.project_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800'
      case 'Completed':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
            placeholder="Search projects..."
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
                onClick={() => handleSort('project_number')}
              >
                Project Number
                {sortField === 'project_number' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('customer_name')}
              >
                Customer
                {sortField === 'customer_name' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('start_date')}
              >
                Start Date
                {sortField === 'start_date' && (
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
            {filteredAndSortedProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  {searchTerm ? 'No projects found matching search criteria' : 'No projects registered yet'}
                </td>
              </tr>
            ) : (
              filteredAndSortedProjects.map((project, index) => (
                <tr key={project.id} className={`hover:bg-slate-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                }`}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{project.project_number}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {project.customer_name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {formatDate(project.start_date)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status || 'Active')}`}>
                      {project.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(project)}
                        className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(project)}
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
        Total {filteredAndSortedProjects.length} projects
      </div>
    </div>
  )
}