import type { ComputedRef } from 'vue'

import { getCmsRefreshToken } from '~/utils/cmsRefresh'
import { contentShapeMismatch } from '~/utils/contentShape'

const registeredLiveRefreshes = new Set<string>()

export async function useCmsContent<T>(key: string, fallback: T): Promise<ComputedRef<T>> {
  const config = useRuntimeConfig()
  const wordpressUrl = config.public.wordpressUrl.replace(/\/$/, '')

  const contentRequest = useAsyncData<T>(
    `heekmah-content:${key}`,
    async () => {
      if (!import.meta.server || !config.cmsEnabled) {
        return fallback
      }

      try {
        const candidate = await $fetch<unknown>(`${wordpressUrl}/wp-json/heekmah/v1/content/${key}`, {
          timeout: 12_000,
          retry: 1,
        })

        const mismatch = contentShapeMismatch(candidate, fallback)
        if (mismatch) {
          throw new Error(`WordPress returned malformed ${key} content at ${mismatch}.`)
        }

        return candidate as T
      } catch (error) {
        if (config.cmsStrict) throw error

        console.warn(`[Heekmah CMS] Using bundled ${key} content because WordPress could not be reached.`, error)
        return fallback
      }
    },
    {
      default: () => fallback,
      server: true,
    },
  )

  if (import.meta.client && config.public.cmsEnabled && !registeredLiveRefreshes.has(key)) {
    registeredLiveRefreshes.add(key)

    onMounted(async () => {
      try {
        const { data } = await contentRequest
        const candidate = await $fetch<unknown>(`${wordpressUrl}/wp-json/heekmah/v1/content/${key}`, {
          query: { heekmah_refresh: getCmsRefreshToken() },
          timeout: 12_000,
          retry: 1,
        })

        const mismatch = contentShapeMismatch(candidate, fallback)
        if (mismatch) {
          throw new Error(`WordPress returned malformed ${key} content at ${mismatch}.`)
        }

        data.value = candidate as T
      } catch (error) {
        console.warn(`[Heekmah CMS] Keeping the prerendered ${key} content because the live refresh failed.`, error)
      }
    })
  }

  const { data, error } = await contentRequest

  if (import.meta.server && config.cmsStrict && error.value) throw error.value

  return computed<T>(() => (data.value as T | null) ?? fallback)
}
