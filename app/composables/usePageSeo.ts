import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import type { MediaAsset } from '~/types/content'

interface PageSeoInput {
  readonly title: string
  readonly description: string
  readonly path: string
  readonly image?: MediaAsset
  readonly type?: 'website' | 'article'
  readonly schemaName?: string
  readonly schemaType?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'BlogPosting'
  readonly datePublished?: string
  readonly dateModified?: string
}

export function usePageSeo(input: MaybeRefOrGetter<PageSeoInput>): void {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const resolvedInput = computed(() => toValue(input))
  const canonicalUrl = computed(() => `${siteUrl}${resolvedInput.value.path}`)
  const imageUrl = computed(() => {
    const image = resolvedInput.value.image
    return image?.src.startsWith('/') ? `${siteUrl}${image.src}` : image?.src
  })

  useSeoMeta({
    title: () => resolvedInput.value.title,
    description: () => resolvedInput.value.description,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogTitle: () => resolvedInput.value.title,
    ogDescription: () => resolvedInput.value.description,
    ogUrl: () => canonicalUrl.value,
    ogSiteName: 'Heekmah Group',
    ogLocale: 'en_NG',
    ogImage: () => imageUrl.value,
    ogImageAlt: () => resolvedInput.value.image?.alt,
    ogImageWidth: () => resolvedInput.value.image?.width,
    ogImageHeight: () => resolvedInput.value.image?.height,
    ogType: () => resolvedInput.value.type ?? 'website',
    articlePublishedTime: () => resolvedInput.value.datePublished,
    articleModifiedTime: () => resolvedInput.value.dateModified,
    twitterCard: () => (imageUrl.value ? 'summary_large_image' : 'summary'),
    twitterTitle: () => resolvedInput.value.title,
    twitterDescription: () => resolvedInput.value.description,
    twitterImage: () => imageUrl.value,
    twitterImageAlt: () => resolvedInput.value.image?.alt,
  })

  useHead(() => ({
    link: [{ rel: 'canonical', href: canonicalUrl.value }],
  }))

  const schema = computed<Record<string, unknown>>(() => {
    const pageInput = resolvedInput.value
    const pageImageUrl = imageUrl.value
    const webpageId = `${canonicalUrl.value}#webpage`
    const schemaType = pageInput.schemaType ?? (pageInput.type === 'article' ? 'BlogPosting' : 'WebPage')
    const value: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      '@id': webpageId,
      url: canonicalUrl.value,
      name: pageInput.schemaName ?? pageInput.title,
      description: pageInput.description,
      inLanguage: 'en-NG',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
    }

    if (pageImageUrl) {
      value.primaryImageOfPage = {
        '@type': 'ImageObject',
        url: pageImageUrl,
        width: pageInput.image?.width,
        height: pageInput.image?.height,
        caption: pageInput.image?.alt,
      }
      value.image = pageImageUrl
    }

    if (schemaType === 'BlogPosting') {
      value.headline = pageInput.schemaName ?? pageInput.title
      value.mainEntityOfPage = { '@id': webpageId }
      value.datePublished = pageInput.datePublished
      value.dateModified = pageInput.dateModified ?? pageInput.datePublished
      value.author = { '@id': `${siteUrl}/#organization` }
      value.publisher = { '@id': `${siteUrl}/#organization` }
    }

    return value
  })

  useJsonLd('heekmah-page-schema', schema)
}
