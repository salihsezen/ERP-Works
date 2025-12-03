import { useLocation } from 'react-router-dom'
import { Bell, Settings, User } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Dashboard'
    case '/customers':
      return 'Customer Management'
    case '/projects':
      return 'Project Management'
    case '/vendors':
      return 'Vendor Management'
    case '/employees':
      return 'Employee Management'
    case '/purchase-orders':
      return 'Purchase Order Management'
    case '/invoices':
      return 'Invoice Management'
    default:
      return 'Innobi OpsCore'
  }
}

export function Header() {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  return (
    <header
      className="border-b px-6 py-4"
      style={{
        background: 'var(--bg-header)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--border-header)'
      }}
    >
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h2 className="text-lg font-medium text-[var(--text-primary)]">
            {pageTitle}
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <button className="p-2 text-slate-600 dark:text-slate-200 hover:text-[var(--text-primary)] dark:hover:text-white hover:bg-muted rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-600 dark:text-slate-200 hover:text-[var(--text-primary)] dark:hover:text-white hover:bg-muted rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-600 dark:text-slate-200 hover:text-[var(--text-primary)] dark:hover:text-white hover:bg-muted rounded-lg transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
