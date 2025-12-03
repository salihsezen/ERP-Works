import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ui/ThemeProvider'
import { ToasterProvider } from './components/ui/ToasterProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ErrorBoundary>
        <App />
        <ToasterProvider />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)
