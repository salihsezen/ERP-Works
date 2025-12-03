import { useState } from 'react'
import { useEmployees } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { EmployeeTable } from '@/components/employees/EmployeeTable'
import { Plus } from 'lucide-react'
import type { Employee } from '@/lib/supabase'
import { toast } from 'sonner'

export function Employees() {
  const { data: employees, loading, error, create, update, remove } = useEmployees()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const handleCreate = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(employeeData)
      setIsModalOpen(false)
      toast.success('Employee created')
    } catch (err) {
      toast.error('Error while creating employee', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleUpdate = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingEmployee) return
    
    try {
      await update(editingEmployee.id, employeeData)
      setIsModalOpen(false)
      setEditingEmployee(null)
      toast.success('Employee updated')
    } catch (err) {
      toast.error('Error while updating employee', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  const handleDelete = async (employee: Employee) => {
    if (!confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      return
    }
    
    try {
      await remove(employee.id)
      toast.success('Employee deleted')
    } catch (err) {
      toast.error('Error while deleting employee', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEmployee(null)
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
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Employees</h1>
          <p className="text-slate-600 mt-1">Manage employee information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Employee
        </button>
      </div>

      {/* Table */}
      <EmployeeTable
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEmployee ? 'Edit Employee' : 'New Employee'}
        size="lg"
      >
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={editingEmployee ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
