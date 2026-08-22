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

export function usePageSeo(input: PageSeoInput): void {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const canonicalUrl = `${siteUrl}${input.path}`
  const imageUrl = input.image?.src.startsWith('/') ? `${siteUrl}${input.image.src}` : input.image?.src

  useSeoMeta({
    title: input.title,
    description: input.description,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogTitle: input.title,
    ogDescription: input.description,
    ogUrl: canonicalUrl,
    ogSiteName: 'Heekmah Group',
    ogLocale: 'en_NG',
    ogImage: imageUrl,
    ogImageAlt: input.image?.alt,
    ogImageWidth: input.image?.width,
    ogImageHeight: input.image?.height,
    ogType: input.type ?? 'website',
    articlePublishedTime: input.datePublished,
    articleModifiedTime: input.dateModified,
    twitterCard: imageUrl ? 'summary_large_image' : 'summary',
    twitterTitle: input.title,
    twitterDescription: input.description,
    twitterImage: imageUrl,
    twitterImageAlt: input.image?.alt,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
  })

  const webpageId = `${canonicalUrl}#webpage`
  const schemaType = input.schemaType ?? (input.type === 'article' ? 'BlogPosting' : 'WebPage')
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': webpageId,
    url: canonicalUrl,
    name: input.schemaName ?? input.title,
    description: input.description,
    inLanguage: 'en-NG',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
  }

  if (imageUrl) {
    schema.primaryImageOfPage = {
      '@type': 'ImageObject',
      url: imageUrl,
      width: input.image?.width,
      height: input.image?.height,
      caption: input.image?.alt,
    }
    schema.image = imageUrl
  }

  if (schemaType === 'BlogPosting') {
    schema.headline = input.schemaName ?? input.title
    schema.mainEntityOfPage = { '@id': webpageId }
    schema.datePublished = input.datePublished
    schema.dateModified = input.dateModified ?? input.datePublished
    schema.author = { '@id': `${siteUrl}/#organization` }
    schema.publisher = { '@id': `${siteUrl}/#organization` }
  }

  useJsonLd('heekmah-page-schema', schema)
}
