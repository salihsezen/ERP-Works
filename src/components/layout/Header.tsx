import { useLocation } from 'react-router-dom'
import { Bell, Settings, User } from 'lucide-react'

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
      return 'Modern ERP'
  }
}

export function Header() {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h2 className="text-lg font-medium text-slate-700">
            {pageTitle}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}