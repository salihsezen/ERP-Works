import { Toaster } from 'sonner'

export function ToasterProvider() {
  return (
    <Toaster
      richColors
      position="top-right"
      closeButton
      toastOptions={{
        className: 'rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)]',
        style: { background: 'var(--bg-card)', color: 'var(--text-primary)' }
      }}
    />
  )
}
