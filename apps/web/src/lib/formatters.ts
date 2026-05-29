export const formatCurrency = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${currency} ${value.toLocaleString()}`
  }
}

export const formatCompactNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export const statusToTone = (status: string) => {
  const normalized = status.toLowerCase()

  if (['disponible', 'active', 'publicada', 'published'].includes(normalized)) {
    return 'active'
  }

  if (['pendiente', 'pending', 'draft', 'borrador'].includes(normalized)) {
    return 'pending'
  }

  if (['vendida', 'sold', 'inactiva', 'inactive'].includes(normalized)) {
    return 'inactive'
  }

  return 'neutral'
}

export const statusToLabel = (status: string) => {
  const normalized = status.toLowerCase()

  if (['disponible', 'active', 'publicada', 'published'].includes(normalized)) {
    return 'Disponible'
  }

  if (['pendiente', 'pending', 'draft', 'borrador'].includes(normalized)) {
    return 'Pendiente'
  }

  if (['vendida', 'sold', 'inactiva', 'inactive'].includes(normalized)) {
    return 'Vendida'
  }

  return 'Borrador'
}

export const formatDemoAddedDate = (index: number) => {
  const demoDates = ['12 oct. 2023', '05 oct. 2023', '28 sep. 2023', '14 oct. 2023']
  return demoDates[index] ?? 'Hoy'
}
