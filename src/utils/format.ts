export const formatCurrencyWhole = (value: number, currency = 'CAD') => {
  const rounded = Math.round(value || 0)
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(rounded)
}

export const formatNumberWhole = (value: number) => Math.round(value || 0)
