const controlCharacterPattern = /[\u0000-\u001f\u007f]/

export function isSafeContentDestination(value: string): boolean {
  const destination = value.trim()

  if (!destination || controlCharacterPattern.test(destination) || destination.includes('\\')) return false

  if (destination.startsWith('#')) return destination.length > 1
  if (destination.startsWith('/') && !destination.startsWith('//')) return true

  try {
    const url = new URL(destination)

    if (url.protocol === 'https:') return true
    if (url.protocol === 'mailto:') return Boolean(url.pathname) && !/\s/.test(url.pathname)
    if (url.protocol === 'tel:') return /^\+?[\d().\s-]+$/.test(url.pathname)
  } catch {
    return false
  }

  return false
}
