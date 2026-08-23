import type { ComputedRef } from 'vue'

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
        return (await $fetch(`${wordpressUrl}/wp-json/heekmah/v1/content/${key}`, {
          timeout: 12_000,
          retry: 1,
        })) as T
      } catch (error) {
        console.warn(`[Heekmah CMS] Using bundled ${key} content because WordPress could not be reached.`, error)
        return fallback
      }
    },
    {
      default: () => fallback,
      server: true,
    },
  )

  if (import.meta.client && config.public.cmsEnabled) {
    onMounted(async () => {
      try {
        const { data } = await contentRequest
        data.value = (await $fetch(`${wordpressUrl}/wp-json/heekmah/v1/content/${key}`, {
          query: { heekmah_refresh: Date.now() },
          timeout: 12_000,
          retry: 1,
        })) as T
      } catch (error) {
        console.warn(`[Heekmah CMS] Keeping the prerendered ${key} content because the live refresh failed.`, error)
      }
    })
  }

  const { data } = await contentRequest

  return computed<T>(() => (data.value as T | null) ?? fallback)
}
