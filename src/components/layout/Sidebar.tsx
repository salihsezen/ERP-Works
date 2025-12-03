import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Building2,
  UserCheck,
  ShoppingCart,
  FileText,
  Menu,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Vendors', href: '/vendors', icon: Building2 },
  { name: 'Employees', href: '/employees', icon: UserCheck },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
  { name: 'Invoices', href: '/invoices', icon: FileText },
]

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-slate-800 text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 h-screen min-h-screen
        ${collapsed ? 'w-16' : 'w-64'} text-white
        transform lg:transform-none transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r
      `} style={{
        background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)',
        borderColor: 'var(--border-subtle)'
      }}>
        {!collapsed && (
          <div className="flex flex-col items-center justify-center h-16 bg-slate-900">
            <h1 className="text-xl font-bold">Innobi OpsCore</h1>
            <p className="text-xs text-slate-400 mt-1">Modern operations suite</p>
          </div>
        )}
        
        <nav className={`${collapsed ? 'mt-4' : 'mt-8'} px-2`}>
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'} rounded-xl transition-all
                      ${isActive
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && (
                      <span className="transition-opacity duration-300">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
