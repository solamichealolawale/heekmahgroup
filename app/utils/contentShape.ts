import { isSafeContentDestination } from './contentDestination'

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function arrayItemReferences(candidate: unknown, references: readonly unknown[]): readonly unknown[] {
  if (isRecord(candidate) && typeof candidate.kind === 'string') {
    return references.filter((reference) => isRecord(reference) && reference.kind === candidate.kind)
  }

  return references
}

export function contentShapeMismatch(candidate: unknown, reference: unknown, path = '$'): string | undefined {
  if (Array.isArray(reference)) {
    if (!Array.isArray(candidate)) return path
    if (!reference.length) return undefined
    if (!candidate.length) return path

    const identifiers = new Set<string>()

    for (const [index, item] of candidate.entries()) {
      if (isRecord(item) && typeof item.id === 'string') {
        if (!item.id.trim() || identifiers.has(item.id)) return `${path}[${index}].id`
        identifiers.add(item.id)
      }

      const itemReferences = arrayItemReferences(item, reference)
      if (!itemReferences.length) return `${path}[${index}]`

      let firstMismatch: string | undefined

      for (const itemReference of itemReferences) {
        const mismatch = contentShapeMismatch(item, itemReference, `${path}[${index}]`)
        if (!mismatch) {
          firstMismatch = undefined
          break
        }

        firstMismatch ??= mismatch
      }

      if (firstMismatch) return firstMismatch
    }

    return undefined
  }

  if (isRecord(reference)) {
    if (!isRecord(candidate)) return path

    for (const [key, value] of Object.entries(reference)) {
      const childPath = `${path}.${key}`
      if (!Object.hasOwn(candidate, key)) return childPath

      const mismatch = contentShapeMismatch(candidate[key], value, childPath)
      if (mismatch) return mismatch
    }

    return undefined
  }

  if (typeof candidate !== typeof reference) return path

  if (typeof candidate === 'string') {
    if (typeof reference === 'string' && reference.trim() && !candidate.trim()) return path
    if (path.endsWith('.to') && !isSafeContentDestination(candidate)) return path
  }

  if (typeof candidate === 'number') {
    if (!Number.isFinite(candidate)) return path
    if (typeof reference === 'number' && reference > 0 && candidate <= 0) return path
  }

  return undefined
}

export function matchesContentShape(candidate: unknown, reference: unknown): boolean {
  return contentShapeMismatch(candidate, reference) === undefined
}
