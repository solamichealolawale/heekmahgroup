const CMS_REFRESH_WINDOW_MS = 30_000

/**
 * Share a cache key across visitors for a short window while still allowing
 * WordPress edits to become visible without rebuilding the static site.
 */
export function getCmsRefreshToken(now = Date.now()): number {
  return Math.floor(now / CMS_REFRESH_WINDOW_MS)
}
