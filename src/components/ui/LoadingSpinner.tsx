interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16', 
    lg: 'h-24 w-24'
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}