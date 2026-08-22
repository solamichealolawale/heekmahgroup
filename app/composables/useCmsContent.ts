import type { ComputedRef } from 'vue'

export async function useCmsContent<T>(key: string, fallback: T): Promise<ComputedRef<T>> {
  const config = useRuntimeConfig()
  const wordpressUrl = config.public.wordpressUrl.replace(/\/$/, '')

  const { data } = await useAsyncData<T>(
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

  return computed<T>(() => (data.value as T | null) ?? fallback)
}
