export interface WordPressRenderedField {
  readonly rendered: string
  readonly protected?: boolean
}

export interface WordPressMediaSize {
  readonly source_url: string
  readonly width: number
  readonly height: number
}

export interface WordPressMedia {
  readonly alt_text?: string
  readonly source_url: string
  readonly media_details?: {
    readonly width?: number
    readonly height?: number
    readonly sizes?: Readonly<Record<string, WordPressMediaSize>>
  }
}

export interface WordPressTerm {
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

export type WordPressSummaryPost = Omit<WordPressPost, 'content'>

const reservedPostSlugs = new Set([
  '_heekmah',
  '_ipx',
  '_nuxt',
  'about-us',
  'blog',
  'contact-us',
  'heekmah-integral-services',
  'heekmah-rice',
  'heekmah-services',
  'nuxt-app',
  'refund_returns',
  'terms-conditon',
  'wp-admin',
  'wp-content',
  'wp-includes',
  'wp-json',
  'wp-login',
])

export function isSafeWordPressPostSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && !reservedPostSlugs.has(slug)
}

export function parseWordPressPageCount(value: string | null | undefined): number {
  const pageCount = Number(value ?? 1)

  if (!Number.isInteger(pageCount) || pageCount < 0) {
    throw new TypeError('WordPress returned an invalid post page count.')
  }

  return Math.max(pageCount, 1)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isRenderedField(value: unknown): value is WordPressRenderedField {
  return isRecord(value) && typeof value.rendered === 'string'
}

function isMediaSize(value: unknown): value is WordPressMediaSize {
  return (
    isRecord(value) &&
    typeof value.source_url === 'string' &&
    typeof value.width === 'number' &&
    typeof value.height === 'number'
  )
}

function isMedia(value: unknown): value is WordPressMedia {
  if (!isRecord(value) || typeof value.source_url !== 'string') return false
  if (value.alt_text !== undefined && typeof value.alt_text !== 'string') return false
  if (value.media_details === undefined) return true
  if (!isRecord(value.media_details)) return false
  if (value.media_details.width !== undefined && typeof value.media_details.width !== 'number') return false
  if (value.media_details.height !== undefined && typeof value.media_details.height !== 'number') return false

  const sizes = value.media_details.sizes
  return sizes === undefined || (isRecord(sizes) && Object.values(sizes).every(isMediaSize))
}

function isTerm(value: unknown): value is WordPressTerm {
  return isRecord(value) && typeof value.name === 'string' && typeof value.taxonomy === 'string'
}

function isEmbedded(value: unknown): boolean {
  if (!isRecord(value)) return false

  const media = value['wp:featuredmedia']
  const terms = value['wp:term']

  return (
    (media === undefined || (Array.isArray(media) && media.every(isMedia))) &&
    (terms === undefined ||
      (Array.isArray(terms) && terms.every((termGroup) => Array.isArray(termGroup) && termGroup.every(isTerm))))
  )
}

function isWordPressPost(value: unknown, requireContent: boolean): boolean {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'number' &&
    typeof value.slug === 'string' &&
    isSafeWordPressPostSlug(value.slug) &&
    typeof value.date === 'string' &&
    typeof value.modified === 'string' &&
    isRenderedField(value.title) &&
    isRenderedField(value.excerpt) &&
    (!requireContent || isRenderedField(value.content)) &&
    typeof value.featured_media === 'number' &&
    Array.isArray(value.categories) &&
    value.categories.every((category) => typeof category === 'number') &&
    (value._embedded === undefined || isEmbedded(value._embedded))
  )
}

export function parseWordPressPostArray(value: unknown, requireContent: true): readonly WordPressPost[]
export function parseWordPressPostArray(value: unknown, requireContent: false): readonly WordPressSummaryPost[]
export function parseWordPressPostArray(
  value: unknown,
  requireContent: boolean,
): readonly (WordPressPost | WordPressSummaryPost)[] {
  if (!Array.isArray(value) || !value.every((post) => isWordPressPost(post, requireContent))) {
    throw new TypeError('WordPress returned an invalid Posts API response.')
  }

  return value as readonly (WordPressPost | WordPressSummaryPost)[]
}
