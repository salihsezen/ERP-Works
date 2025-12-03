import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'innobi-theme'

const getPreferredTheme = (): Theme => {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') return stored
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getPreferredTheme)

  const applyTheme = (next: Theme) => {
    const root = window.document.documentElement
    // Keep class for Tailwind's dark mode and also set data attribute for theme tokens
    root.classList.remove(next === 'light' ? 'dark' : 'light')
    root.classList.add(next)
    root.setAttribute('data-theme', next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    toggleTheme: () => setThemeState(prev => (prev === 'light' ? 'dark' : 'light')),
    setTheme: (t: Theme) => setThemeState(t)
  }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
