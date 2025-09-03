import { useState } from 'react'
import { useEmployees } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { EmployeeTable } from '@/components/employees/EmployeeTable'
import { Plus } from 'lucide-react'
import type { Employee } from '@/lib/supabase'

export function Employees() {
  const { data: employees, loading, error, create, update, remove } = useEmployees()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const handleCreate = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(employeeData)
      setIsModalOpen(false)
    } catch (err) {
      alert('Çalışan oluşturulurken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleUpdate = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingEmployee) return
    
    try {
      await update(editingEmployee.id, employeeData)
      setIsModalOpen(false)
      setEditingEmployee(null)
    } catch (err) {
      alert('Çalışan güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  const handleDelete = async (employee: Employee) => {
    if (!confirm(`${employee.first_name} ${employee.last_name} adlı çalışanı silmek istediğinizden emin misiniz?`)) {
      return
    }
    
    try {
      await remove(employee.id)
    } catch (err) {
      alert('Çalışan silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
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
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-600 mt-1">Manage employee information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
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