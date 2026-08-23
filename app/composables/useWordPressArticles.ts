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
        const latestArticles = await getWordPressArticles(wordpressUrl, true, false)
        return latestArticles.map(toArticleSummary)
      } catch (error) {
        if (config.cmsStrict) throw error

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
        const [{ data }, { getWordPressArticleSummaries }] = await Promise.all([
          articleRequest,
          import('~/utils/wordpressPostSummaries'),
        ])
        data.value = await getWordPressArticleSummaries(wordpressUrl)
      } catch (error) {
        console.warn('[Heekmah CMS] Keeping the prerendered article summaries because the live refresh failed.', error)
      }
    })
  }

  const { data, error } = await articleRequest

  if (import.meta.server && config.cmsStrict && error.value) throw error.value

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
        const { getWordPressArticle } = await import('~/utils/wordpressPosts')
        const latestArticle = await getWordPressArticle(wordpressUrl, slug)

        if (!latestArticle && config.cmsStrict) {
          throw new Error(`WordPress did not return the expected published article: ${slug}.`)
        }

        return latestArticle
      } catch (error) {
        if (config.cmsStrict) throw error

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
      let latestArticle: ArticleContent | undefined

      try {
        const [, { getWordPressArticleForBrowser }] = await Promise.all([
          articleRequest,
          import('~/utils/wordpressPostClient'),
        ])
        latestArticle = await getWordPressArticleForBrowser(wordpressUrl, slug)
      } catch (error) {
        console.warn(`[Heekmah CMS] Keeping the prerendered ${slug} article because the live refresh failed.`, error)
        return
      }

      if (!latestArticle) {
        showError({ statusCode: 404, statusMessage: 'Page not found' })
        return
      }

      const { data } = await articleRequest
      data.value = latestArticle
    })
  }

  const { data, error } = await articleRequest

  if (import.meta.server && config.cmsStrict && error.value) throw error.value

  return computed<ArticleContent | undefined>(() => data.value ?? fallback)
}
