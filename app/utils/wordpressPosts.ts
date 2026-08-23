import sanitizeHtml from 'sanitize-html'

// Shared by Nitro during prerendering and by the browser when refreshing WordPress content.

import { articles as fallbackArticles } from '~/data/articles'
import type { ArticleContent, MediaAsset } from '~/types/content'

interface WordPressRenderedField {
  readonly rendered: string
  readonly protected?: boolean
}

interface WordPressMediaSize {
  readonly source_url: string
  readonly width: number
  readonly height: number
}

interface WordPressMedia {
  readonly alt_text?: string
  readonly source_url: string
  readonly media_details?: {
    readonly width?: number
    readonly height?: number
    readonly sizes?: Readonly<Record<string, WordPressMediaSize>>
  }
}

interface WordPressTerm {
  readonly name: string
  readonly taxonomy: string
}

export interface WordPressPost {
  readonly id: number
  readonly slug: string
  readonly date: string
  readonly modified: string
  readonly title: WordPressRenderedField
  readonly excerpt: WordPressRenderedField
  readonly content: WordPressRenderedField
  readonly featured_media: number
  readonly categories: readonly number[]
  readonly _embedded?: {
    readonly 'wp:featuredmedia'?: readonly WordPressMedia[]
    readonly 'wp:term'?: readonly (readonly WordPressTerm[])[]
  }
}

const allowedTags = [
  'p',
  'br',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'strong',
  'b',
  'em',
  'i',
  'a',
  'figure',
  'img',
  'figcaption',
  'blockquote',
]

function normalizeInternalUrl(url = ''): string {
  if (!url) return url

  try {
    const parsed = new URL(url, 'https://heekmahgroup.com')

    if (parsed.hostname === 'heekmahgroup.com' || parsed.hostname === 'www.heekmahgroup.com') {
      const pathname = parsed.pathname === '/heekmah-services/' ? '/heekmah-integral-services/' : parsed.pathname
      return `${pathname}${parsed.search}${parsed.hash}`
    }
  } catch {
    return url
  }

  return url
}

export function sanitizeWordPressContent(content: string): string {
  return sanitizeHtml(content, {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      figure: ['class'],
      img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding'],
      li: ['value'],
      ol: ['start'],
    },
    allowedClasses: {
      figure: ['wp-block-image', 'alignwide', 'alignfull', 'size-*'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
    },
    transformTags: {
      a: (_tagName, attributes) => {
        const target = attributes.target === '_blank' ? '_blank' : undefined
        const rel = target ? 'noopener noreferrer' : undefined

        return {
          tagName: 'a',
          attribs: {
            href: normalizeInternalUrl(attributes.href),
            ...(target ? { target } : {}),
            ...(rel ? { rel } : {}),
          },
        }
      },
      img: (_tagName, attributes) => ({
        tagName: 'img',
        attribs: {
          ...(attributes.src ? { src: attributes.src } : {}),
          ...(attributes.srcset ? { srcset: attributes.srcset } : {}),
          ...(attributes.sizes ? { sizes: attributes.sizes } : {}),
          alt: attributes.alt ?? '',
          ...(attributes.width ? { width: attributes.width } : {}),
          ...(attributes.height ? { height: attributes.height } : {}),
          loading: 'lazy',
          decoding: 'async',
        },
      }),
    },
  })
}

function decodeHtmlEntities(value: string): string {
  const namedEntities: Readonly<Record<string, string>> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  }

  return value
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_match, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name: string) => namedEntities[name.toLowerCase()] ?? match)
}

function plainText(html: string): string {
  return decodeHtmlEntities(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }))
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(value: string, maximumLength: number): string {
  if (value.length <= maximumLength) return value

  const shortened = value
    .slice(0, maximumLength + 1)
    .replace(/\s+\S*$/, '')
    .trimEnd()
  return `${shortened}…`
}

function formatDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1))

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function mediaSrcSet(media: WordPressMedia): string | undefined {
  const sizes = Object.values(media.media_details?.sizes ?? {})
  const candidates = [
    ...sizes.map((size) => ({ src: size.source_url, width: size.width })),
    {
      src: media.source_url,
      width: media.media_details?.width,
    },
  ]
  const uniqueCandidates = new Map<number, string>()

  for (const candidate of candidates) {
    if (candidate.width && candidate.src) uniqueCandidates.set(candidate.width, candidate.src)
  }

  const entries = [...uniqueCandidates.entries()].sort(([firstWidth], [secondWidth]) => firstWidth - secondWidth)
  return entries.length > 1 ? entries.map(([width, src]) => `${src} ${width}w`).join(', ') : undefined
}

function featuredImage(post: WordPressPost, fallback?: ArticleContent): MediaAsset {
  const media = post._embedded?.['wp:featuredmedia']?.[0]

  if (media) {
    return {
      src: media.source_url,
      alt: media.alt_text?.trim() || plainText(post.title.rendered),
      width: media.media_details?.width ?? fallback?.image.width ?? 1600,
      height: media.media_details?.height ?? fallback?.image.height ?? 900,
      attachmentId: post.featured_media || undefined,
      srcSet: mediaSrcSet(media),
    }
  }

  if (fallback) return fallback.image

  const imageTag = post.content.rendered.match(/<img\b[^>]*>/i)?.[0]
  const attribute = (name: string): string | undefined =>
    imageTag?.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1]

  return {
    src: attribute('src') ?? fallbackArticles[0].image.src,
    alt: attribute('alt')?.trim() || plainText(post.title.rendered),
    width: Number(attribute('width')) || 1600,
    height: Number(attribute('height')) || 900,
    srcSet: attribute('srcset'),
  }
}

function postCategory(post: WordPressPost): string {
  const terms = post._embedded?.['wp:term']?.flat() ?? []
  return terms.find((term) => term.taxonomy === 'category')?.name || 'News'
}

export function transformWordPressPost(post: WordPressPost): ArticleContent {
  const fallback = fallbackArticles.find((article) => article.slug === post.slug)
  const title = plainText(post.title.rendered)
  const excerpt = plainText(post.excerpt.rendered) || plainText(post.content.rendered)
  const description = truncate(excerpt, 158)
  const category = postCategory(post)

  return {
    slug: post.slug,
    seo: {
      title: `${title} | Heekmah Group`,
      description,
    },
    eyebrow: category,
    title,
    summary: truncate(excerpt, 240),
    date: formatDate(post.date),
    datePublished: post.date.slice(0, 10),
    dateModified: post.modified.slice(0, 10),
    category,
    image: featuredImage(post, fallback),
    blocks: fallback?.blocks ?? [],
    html: sanitizeWordPressContent(post.content.rendered),
    source: 'wordpress',
  }
}

async function fetchWordPressPostPage(wordpressUrl: string, page: number) {
  return await $fetch.raw<readonly WordPressPost[]>(`${wordpressUrl}/wp-json/wp/v2/posts`, {
    query: {
      page,
      per_page: 100,
      status: 'publish',
      order: 'desc',
      orderby: 'date',
      _embed: 'wp:featuredmedia,wp:term',
      _fields: 'id,slug,date,modified,title,excerpt,content,featured_media,categories,_links,_embedded',
    },
    timeout: 12_000,
    retry: 1,
  })
}

interface ArticleCacheEntry {
  readonly expiresAt: number
  readonly request: Promise<readonly ArticleContent[]>
}

const articleCache = new Map<string, ArticleCacheEntry>()

async function fetchAndTransformWordPressArticles(
  wordpressUrl: string,
  useFallbackOnError: boolean,
): Promise<readonly ArticleContent[]> {
  try {
    const firstPage = await fetchWordPressPostPage(wordpressUrl, 1)
    const pageCount = Math.min(Number(firstPage.headers.get('x-wp-totalpages') ?? 1), 20)
    const posts = [...(firstPage._data ?? [])]

    for (let page = 2; page <= pageCount; page += 1) {
      const response = await fetchWordPressPostPage(wordpressUrl, page)
      posts.push(...(response._data ?? []))
    }

    if (posts.length) return posts.map(transformWordPressPost)
    if (!useFallbackOnError) throw new Error('WordPress returned no published posts.')

    return fallbackArticles
  } catch (error) {
    if (!useFallbackOnError) throw error

    console.warn('[Heekmah CMS] Using bundled articles because the WordPress Posts API could not be reached.', error)
    return fallbackArticles
  }
}

export async function getWordPressArticles(
  wordpressUrl: string,
  cmsEnabled: boolean,
  useFallbackOnError = true,
): Promise<readonly ArticleContent[]> {
  if (!cmsEnabled) return fallbackArticles

  const normalizedUrl = wordpressUrl.replace(/\/$/, '')
  const cached = articleCache.get(normalizedUrl)

  if (cached && cached.expiresAt > Date.now()) return await cached.request

  const request = fetchAndTransformWordPressArticles(normalizedUrl, useFallbackOnError)
  articleCache.set(normalizedUrl, {
    expiresAt: Date.now() + 30_000,
    request,
  })

  return await request
}
