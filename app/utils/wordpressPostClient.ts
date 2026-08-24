import DOMPurify from 'dompurify'

import { articles as fallbackArticles } from '~/data/articles'
import type { ArticleContent } from '~/types/content'
import { getCmsRefreshToken } from '~/utils/cmsRefresh'
import { transformWordPressPostSummary } from '~/utils/wordpressPostSummaries'
import { parseWordPressPostArray, type WordPressPost } from '~/utils/wordpressPostValidation'

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

const allowedAttributes: Readonly<Record<string, readonly string[]>> = {
  a: ['href', 'target', 'rel'],
  figure: ['class'],
  img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding'],
  li: ['value'],
  ol: ['start'],
}

const forbiddenContentTags = new Set([
  'button',
  'embed',
  'form',
  'iframe',
  'input',
  'math',
  'object',
  'script',
  'style',
  'svg',
  'template',
])

function normalizeInternalUrl(url: string): string {
  if (url.startsWith('#')) return url

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

function truncate(value: string, maximumLength: number): string {
  if (value.length <= maximumLength) return value

  const shortened = value
    .slice(0, maximumLength + 1)
    .replace(/\s+\S*$/, '')
    .trimEnd()
  return `${shortened}…`
}

function hasSafeProtocol(value: string, allowedProtocols: readonly string[]): boolean {
  try {
    return allowedProtocols.includes(new URL(value, 'https://heekmahgroup.com').protocol)
  } catch {
    return false
  }
}

function hasSafeSrcSet(value: string): boolean {
  return value.split(',').every((candidate) => {
    const [url, descriptor, ...unexpected] = candidate.trim().split(/\s+/)
    const validDescriptor = !descriptor || /^\d+w$|^\d+(?:\.\d+)?x$/.test(descriptor)

    return Boolean(url) && !unexpected.length && validDescriptor && hasSafeProtocol(url ?? '', ['http:', 'https:'])
  })
}

export function sanitizeWordPressContentInBrowser(content: string): string {
  const sanitized = DOMPurify(window).sanitize(content, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: [
      'href',
      'target',
      'rel',
      'class',
      'src',
      'srcset',
      'sizes',
      'alt',
      'width',
      'height',
      'loading',
      'decoding',
      'value',
      'start',
    ],
    ALLOW_DATA_ATTR: false,
  })
  const parsed = new DOMParser().parseFromString(sanitized, 'text/html')

  for (const element of [...parsed.body.querySelectorAll('*')]) {
    const tagName = element.tagName.toLowerCase()

    if (!allowedTags.includes(tagName)) {
      if (forbiddenContentTags.has(tagName)) element.remove()
      else element.replaceWith(...element.childNodes)
      continue
    }

    const tagAttributes = allowedAttributes[tagName] ?? []
    for (const attribute of [...element.attributes]) {
      if (!tagAttributes.includes(attribute.name.toLowerCase())) element.removeAttribute(attribute.name)
    }
  }

  for (const anchor of parsed.querySelectorAll('a')) {
    const href = anchor.getAttribute('href')
    if (href && hasSafeProtocol(href, ['http:', 'https:', 'mailto:', 'tel:'])) {
      anchor.setAttribute('href', normalizeInternalUrl(href))
    } else {
      anchor.removeAttribute('href')
    }

    if (anchor.getAttribute('target') === '_blank') {
      anchor.setAttribute('rel', 'noopener noreferrer')
    } else {
      anchor.removeAttribute('target')
      anchor.removeAttribute('rel')
    }
  }

  for (const figure of parsed.querySelectorAll('figure')) {
    const allowedClasses = [...figure.classList].filter(
      (className) =>
        className === 'wp-block-image' ||
        className === 'alignwide' ||
        className === 'alignfull' ||
        className.startsWith('size-'),
    )

    if (allowedClasses.length) figure.className = allowedClasses.join(' ')
    else figure.removeAttribute('class')
  }

  for (const image of parsed.querySelectorAll('img')) {
    const src = image.getAttribute('src')
    if (!src || !hasSafeProtocol(src, ['http:', 'https:'])) image.removeAttribute('src')

    const srcSet = image.getAttribute('srcset')
    if (srcSet && !hasSafeSrcSet(srcSet)) image.removeAttribute('srcset')

    if (!image.hasAttribute('alt')) image.setAttribute('alt', '')
    image.setAttribute('loading', 'lazy')
    image.setAttribute('decoding', 'async')
  }

  return parsed.body.innerHTML
}

export function transformWordPressPostInBrowser(post: WordPressPost): ArticleContent {
  const fallback = fallbackArticles.find((article) => article.slug === post.slug)
  const summary = transformWordPressPostSummary(post)
  const html = sanitizeWordPressContentInBrowser(post.content.rendered)
  const contentText =
    new DOMParser().parseFromString(html, 'text/html').body.textContent?.replace(/\s+/g, ' ').trim() ?? ''
  const excerpt = summary.excerpt || truncate(contentText, 240)

  return {
    slug: post.slug,
    seo: {
      title: `${summary.title} | Heekmah Group`,
      description: truncate(excerpt, 158),
    },
    eyebrow: summary.category,
    title: summary.title,
    summary: excerpt,
    date: summary.date,
    datePublished: post.date.slice(0, 10),
    dateModified: post.modified.slice(0, 10),
    category: summary.category,
    image: summary.image,
    blocks: fallback?.blocks ?? [],
    html,
    source: 'wordpress',
  }
}

interface ArticleDetailCacheEntry {
  readonly expiresAt: number
  readonly request: Promise<ArticleContent | undefined>
}

const articleDetailCache = new Map<string, ArticleDetailCacheEntry>()

async function fetchWordPressArticleForBrowser(
  wordpressUrl: string,
  slug: string,
): Promise<ArticleContent | undefined> {
  const response = await $fetch.raw<unknown>(`${wordpressUrl}/wp-json/wp/v2/posts`, {
    query: {
      slug,
      per_page: 1,
      status: 'publish',
      heekmah_refresh: getCmsRefreshToken(),
      _embed: 'wp:featuredmedia,wp:term',
      _fields: 'id,slug,date,modified,title,excerpt,content,featured_media,categories,_links,_embedded',
    },
    timeout: 12_000,
    retry: 1,
  })

  const post = parseWordPressPostArray(response._data, true)[0]
  return post ? transformWordPressPostInBrowser(post) : undefined
}

export async function getWordPressArticleForBrowser(
  wordpressUrl: string,
  slug: string,
): Promise<ArticleContent | undefined> {
  const normalizedUrl = wordpressUrl.replace(/\/$/, '')
  const cacheKey = `${normalizedUrl}:${slug}`
  const cached = articleDetailCache.get(cacheKey)

  if (cached && cached.expiresAt > Date.now()) return await cached.request

  const request = fetchWordPressArticleForBrowser(normalizedUrl, slug)
  articleDetailCache.set(cacheKey, { expiresAt: Date.now() + 30_000, request })
  return await request
}
