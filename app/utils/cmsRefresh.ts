const CMS_REFRESH_WINDOW_MS = 30_000

/**
 * Bound live refreshes to a short shared-cache window while still allowing
 * WordPress edits to become visible without rebuilding the static site.
 */
export function getCmsRefreshToken(now = Date.now()): number {
  return Math.floor(now / CMS_REFRESH_WINDOW_MS)
}
