import { useState } from 'react'
import { useProjects } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { ProjectTable } from '@/components/projects/ProjectTable'
import { Plus } from 'lucide-react'
import type { Project } from '@/lib/supabase'

export function Projects() {
  const { data: projects, loading, error, create, update, remove } = useProjects()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const handleCreate = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(projectData)
      setIsModalOpen(false)
    } catch (err) {
      alert('Proje oluşturulurken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleUpdate = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingProject) return
    
    try {
      await update(editingProject.id, projectData)
      setIsModalOpen(false)
      setEditingProject(null)
    } catch (err) {
      alert('Proje güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDelete = async (project: Project) => {
    if (!confirm(`${project.project_number} numaralı projeyi silmek istediğinizden emin misiniz?`)) {
      return
    }
    
    try {
      await remove(project.id)
    } catch (err) {
      alert('Proje silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
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
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">Manage project information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Table */}
      <ProjectTable
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'New Project'}
        size="lg"
      >
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}