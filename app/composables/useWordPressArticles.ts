import type { ComputedRef } from 'vue'

import { articles as fallbackArticles } from '~/data/articles'
import type { ArticleContent, ArticleSummary } from '~/types/content'
import { toArticleSummary } from '~/utils/articles'

const fallbackSummaries = fallbackArticles.map(toArticleSummary)

export async function useWordPressArticleSummaries(): Promise<ComputedRef<readonly ArticleSummary[]>> {
  const config = useRuntimeConfig()
  const wordpressUrl = config.public.wordpressUrl.replace(/\/$/, '')

  const articleRequest = useAsyncData<readonly ArticleSummary[]>(
    'wordpress-post-summaries',
    async () => {
      if (!import.meta.server || !config.cmsEnabled) {
        return fallbackSummaries
      }

      try {
        const { getWordPressArticles } = await import('~/utils/wordpressPosts')
        const latestArticles = await getWordPressArticles(wordpressUrl, true)
        return latestArticles.map(toArticleSummary)
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

  if (import.meta.client && config.public.cmsEnabled) {
    onMounted(async () => {
      try {
        const [{ data }, { getWordPressArticles }] = await Promise.all([
          articleRequest,
          import('~/utils/wordpressPosts'),
        ])
        const latestArticles = await getWordPressArticles(wordpressUrl, true, false)
        data.value = latestArticles.map(toArticleSummary)
      } catch (error) {
        console.warn('[Heekmah CMS] Keeping the prerendered article summaries because the live refresh failed.', error)
      }
    })
  }

  const { data } = await articleRequest

  return computed<readonly ArticleSummary[]>(() => data.value ?? fallbackSummaries)
}

export async function useWordPressArticle(slug: string): Promise<ComputedRef<ArticleContent | undefined>> {
  const config = useRuntimeConfig()
  const wordpressUrl = config.public.wordpressUrl.replace(/\/$/, '')
  const fallback = fallbackArticles.find((article) => article.slug === slug)

  const articleRequest = useAsyncData<ArticleContent | undefined>(
    `wordpress-post:${slug}`,
    async () => {
      if (!import.meta.server || !config.cmsEnabled) return fallback

      try {
        const { getWordPressArticles } = await import('~/utils/wordpressPosts')
        const latestArticles = await getWordPressArticles(wordpressUrl, true)
        return latestArticles.find((article) => article.slug === slug) ?? fallback
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

  if (import.meta.client && config.public.cmsEnabled) {
    onMounted(async () => {
      try {
        const [{ data }, { getWordPressArticles }] = await Promise.all([
          articleRequest,
          import('~/utils/wordpressPosts'),
        ])
        const latestArticles = await getWordPressArticles(wordpressUrl, true, false)
        data.value = latestArticles.find((article) => article.slug === slug) ?? fallback
      } catch (error) {
        console.warn(`[Heekmah CMS] Keeping the prerendered ${slug} article because the live refresh failed.`, error)
      }
    })
  }

  const { data } = await articleRequest

  return computed<ArticleContent | undefined>(() => data.value ?? fallback)
}
