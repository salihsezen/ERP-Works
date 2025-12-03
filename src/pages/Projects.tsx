import { useState } from 'react'
import { useProjects } from '@/hooks/useDatabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { ProjectTable } from '@/components/projects/ProjectTable'
import { Plus } from 'lucide-react'
import type { Project } from '@/lib/supabase'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'

export function Projects() {
  const { data: projects, loading, error, create, update, remove } = useProjects()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchParams] = useSearchParams()
  const statusFilter = searchParams.get('status')

  const handleCreate = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await create(projectData)
      setIsModalOpen(false)
      toast.success('Project created')
    } catch (err) {
      toast.error('Error while creating project', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleUpdate = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingProject) return
    
    try {
      await update(editingProject.id, projectData)
      setIsModalOpen(false)
      setEditingProject(null)
      toast.success('Project updated')
    } catch (err) {
      toast.error('Error while updating project', { description: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete project ${project.project_number}?`)) {
      return
    }
    
    try {
      await remove(project.id)
      toast.success('Project deleted')
    } catch (err) {
      toast.error('Error while deleting project', { description: err instanceof Error ? err.message : 'Unknown error' })
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

  const filteredProjects = statusFilter
    ? projects.filter(p => (p.status || '').toLowerCase() === statusFilter.toLowerCase())
    : projects

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-slate-600 mt-1">Manage project information</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Table */}
      <ProjectTable
        projects={filteredProjects}
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
