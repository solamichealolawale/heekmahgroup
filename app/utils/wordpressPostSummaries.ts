import { articles as fallbackArticles } from '~/data/articles'
import type { ArticleSummary, MediaAsset } from '~/types/content'
import { parseWordPressPostArray, type WordPressSummaryPost } from '~/utils/wordpressPostValidation'

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
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, ' '))
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

function featuredImage(post: WordPressSummaryPost): MediaAsset {
  const fallback = fallbackArticles.find((article) => article.slug === post.slug)?.image ?? fallbackArticles[0].image
  const media = post._embedded?.['wp:featuredmedia']?.[0]

  if (!media) return fallback

  const sizes = Object.values(media.media_details?.sizes ?? {})
  const candidates = [
    ...sizes.map((size) => ({ src: size.source_url, width: size.width })),
    { src: media.source_url, width: media.media_details?.width },
  ]
  const uniqueCandidates = new Map<number, string>()

  for (const candidate of candidates) {
    if (candidate.width && candidate.src) uniqueCandidates.set(candidate.width, candidate.src)
  }

  const entries = [...uniqueCandidates.entries()].sort(([firstWidth], [secondWidth]) => firstWidth - secondWidth)

  return {
    src: media.source_url,
    alt: media.alt_text?.trim() || plainText(post.title.rendered),
    width: media.media_details?.width ?? fallback.width,
    height: media.media_details?.height ?? fallback.height,
    attachmentId: post.featured_media || undefined,
    srcSet: entries.length > 1 ? entries.map(([width, src]) => `${src} ${width}w`).join(', ') : undefined,
  }
}

function category(post: WordPressSummaryPost): string {
  const terms = post._embedded?.['wp:term']?.flat() ?? []
  return terms.find((term) => term.taxonomy === 'category')?.name || 'News'
}

export function transformWordPressPostSummary(post: WordPressSummaryPost): ArticleSummary {
  const title = plainText(post.title.rendered)
  const excerpt = plainText(post.excerpt.rendered)

  return {
    title,
    excerpt: truncate(excerpt, 240),
    date: formatDate(post.date),
    dateTime: post.date.slice(0, 10),
    category: category(post),
    to: `/${post.slug}/`,
    image: featuredImage(post),
  }
}

interface SummaryCacheEntry {
  readonly expiresAt: number
  readonly request: Promise<readonly ArticleSummary[]>
}

const summaryCache = new Map<string, SummaryCacheEntry>()

async function fetchWordPressArticleSummaries(wordpressUrl: string): Promise<readonly ArticleSummary[]> {
  const response = await $fetch.raw<unknown>(`${wordpressUrl}/wp-json/wp/v2/posts`, {
    query: {
      page: 1,
      per_page: 100,
      status: 'publish',
      order: 'desc',
      orderby: 'date',
      heekmah_refresh: Date.now(),
      _embed: 'wp:featuredmedia,wp:term',
      _fields: 'id,slug,date,modified,title,excerpt,featured_media,categories,_links,_embedded',
    },
    timeout: 12_000,
    retry: 1,
  })

  return parseWordPressPostArray(response._data, false).map(transformWordPressPostSummary)
}

export async function getWordPressArticleSummaries(wordpressUrl: string): Promise<readonly ArticleSummary[]> {
  const normalizedUrl = wordpressUrl.replace(/\/$/, '')
  const cached = summaryCache.get(normalizedUrl)

  if (cached && cached.expiresAt > Date.now()) return await cached.request

  const request = fetchWordPressArticleSummaries(normalizedUrl)
  summaryCache.set(normalizedUrl, { expiresAt: Date.now() + 30_000, request })
  return await request
}
