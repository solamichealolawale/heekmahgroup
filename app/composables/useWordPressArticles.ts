import type { ComputedRef } from 'vue'

import { articles as fallbackArticles } from '~/data/articles'
import type { ArticleContent, ArticleSummary } from '~/types/content'
import { toArticleSummary } from '~/utils/articles'

const fallbackSummaries = fallbackArticles.map(toArticleSummary)

export async function useWordPressArticleSummaries(): Promise<ComputedRef<readonly ArticleSummary[]>> {
  const config = useRuntimeConfig()

  const { data } = await useAsyncData<readonly ArticleSummary[]>(
    'wordpress-post-summaries',
    async () => {
      if (!import.meta.server || !config.cmsEnabled) {
        return fallbackSummaries
      }

      try {
        return await $fetch<readonly ArticleSummary[]>('/api/wordpress/posts')
      } catch (error) {
        console.warn(
          '[Heekmah CMS] Using bundled article summaries because WordPress Posts could not be reached.',
          error,
        )
        return fallbackSummaries
      }
    },
    {
      default: () => fallbackSummaries,
      server: true,
    },
  )

  return computed<readonly ArticleSummary[]>(() => data.value ?? fallbackSummaries)
}

export async function useWordPressArticle(slug: string): Promise<ComputedRef<ArticleContent | undefined>> {
  const config = useRuntimeConfig()
  const fallback = fallbackArticles.find((article) => article.slug === slug)

  const { data } = await useAsyncData<ArticleContent | undefined>(
    `wordpress-post:${slug}`,
    async () => {
      if (!import.meta.server || !config.cmsEnabled) return fallback

      try {
        return await $fetch<ArticleContent>(`/api/wordpress/posts/${encodeURIComponent(slug)}`)
      } catch (error) {
        console.warn(`[Heekmah CMS] Using the bundled ${slug} article because WordPress could not be reached.`, error)
        return fallback
      }
    },
    {
      default: () => fallback,
      server: true,
    },
  )

  return computed<ArticleContent | undefined>(() => data.value ?? fallback)
}
