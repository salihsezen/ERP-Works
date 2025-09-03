import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="relative">
        <Sidebar collapsed={sidebarCollapsed} />
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute bg-white border border-slate-200 rounded-r-lg shadow-md hover:shadow-lg transition-all duration-300 p-2 text-slate-600 hover:text-slate-900"
          style={{
            top: '50%',
            right: '-20px',
            transform: 'translateY(-50%)',
            zIndex: 35
          }}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}