import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Suspense, lazy } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Lazy load all page components for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })))
const Customers = lazy(() => import('@/pages/Customers').then(module => ({ default: module.Customers })))
const Projects = lazy(() => import('@/pages/Projects').then(module => ({ default: module.Projects })))
const Vendors = lazy(() => import('@/pages/Vendors').then(module => ({ default: module.Vendors })))
const Employees = lazy(() => import('@/pages/Employees').then(module => ({ default: module.Employees })))
const PurchaseOrders = lazy(() => import('@/pages/PurchaseOrders').then(module => ({ default: module.PurchaseOrders })))
const Invoices = lazy(() => import('@/pages/Invoices').then(module => ({ default: module.Invoices })))

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/invoices" element={<Invoices />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  )
}

export default App