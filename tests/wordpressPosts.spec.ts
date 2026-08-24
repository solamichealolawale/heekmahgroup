import { describe, expect, it } from 'vitest'

import { articles } from '~/data/articles'
import { toArticleSummary } from '~/utils/articles'
import { isSafeWordPressPostSlug } from '~/utils/wordpressPostValidation'
import { sanitizeWordPressContent, transformWordPressPost, type WordPressPost } from '../server/utils/wordpressPosts'

const post = {
  id: 9010,
  slug: 'a-wordpress-story',
  date: '2026-08-20T10:30:00',
  modified: '2026-08-21T11:45:00',
  title: { rendered: 'Rice &amp; resilient farming' },
  excerpt: {
    rendered:
      '<p>A practical look at dependable rice systems, resilient farms and better links between growers and markets.</p>',
  },
  content: {
    rendered: `
      <p onclick="alert('bad')">A safe introduction.</p>
      <script>alert('bad')</script>
      <a href="#field-notes">Field notes</a>
      <a href="https://heekmahgroup.com/heekmah-services/">Services</a>
      <a href="https://example.com/research" target="_blank">Research</a>
      <img src="https://heekmahgroup.com/wp-content/uploads/field.webp" onerror="alert('bad')" alt="Field work">
    `,
  },
  featured_media: 77,
  categories: [30],
  _embedded: {
    'wp:featuredmedia': [
      {
        alt_text: 'Rice field team',
        source_url: 'https://heekmahgroup.com/wp-content/uploads/field-full.webp',
        media_details: {
          width: 1600,
          height: 1000,
          sizes: {
            medium: {
              source_url: 'https://heekmahgroup.com/wp-content/uploads/field-600.webp',
              width: 600,
              height: 375,
            },
          },
        },
      },
    ],
    'wp:term': [[{ name: 'Field notes', taxonomy: 'category' }], []],
  },
} as const satisfies WordPressPost

describe('WordPress Posts adapter', () => {
  it('maps native post fields, embedded categories and responsive featured media', () => {
    const article = transformWordPressPost(post)

    expect(article.source).toBe('wordpress')
    expect(article.title).toBe('Rice & resilient farming')
    expect(article.category).toBe('Field notes')
    expect(article.date).toBe('20 August 2026')
    expect(article.datePublished).toBe('2026-08-20')
    expect(article.dateModified).toBe('2026-08-21')
    expect(article.image).toMatchObject({
      src: 'https://heekmahgroup.com/wp-content/uploads/field-full.webp',
      alt: 'Rice field team',
      width: 1600,
      height: 1000,
      attachmentId: 77,
    })
    expect(article.image.srcSet).toContain('field-600.webp 600w')
    expect(article.image.srcSet).toContain('field-full.webp 1600w')
  })

  it('sanitizes post HTML and normalizes internal links before rendering', () => {
    const article = transformWordPressPost(post)

    expect(article.html).not.toContain('<script')
    expect(article.html).not.toContain('onclick')
    expect(article.html).not.toContain('onerror')
    expect(article.html).toContain('href="#field-notes"')
    expect(article.html).toContain('href="/heekmah-integral-services/"')
    expect(article.html).toContain('target="_blank" rel="noopener noreferrer"')
    expect(article.html).toContain('loading="lazy" decoding="async"')
  })

  it('keeps the reviewed cover when an existing post has no featured image', () => {
    const fallback = articles[0]
    const article = transformWordPressPost({
      ...post,
      slug: fallback.slug,
      featured_media: 0,
      _embedded: { 'wp:term': post._embedded['wp:term'] },
    })

    expect(article.image).toEqual(fallback.image)
  })

  it('uses the same deterministic cover for a new post without a featured image', () => {
    const article = transformWordPressPost({
      ...post,
      slug: 'new-story-without-a-featured-image',
      featured_media: 0,
      _embedded: { 'wp:term': post._embedded['wp:term'] },
    })

    expect(article.image).toEqual(articles[0].image)
  })

  it('keeps listing payloads free of full article bodies', () => {
    const summary = toArticleSummary(transformWordPressPost(post))

    expect(summary).not.toHaveProperty('html')
    expect(summary).not.toHaveProperty('blocks')
    expect(summary.to).toBe('/a-wordpress-story/')
  })

  it('removes unsupported embeds and event handlers from arbitrary post markup', () => {
    const html = sanitizeWordPressContent(
      '<p onmouseover="bad()">Useful text</p><iframe src="https://example.com"></iframe><img src="javascript:bad()">',
    )

    expect(html).toBe('<p>Useful text</p><img alt="" loading="lazy" decoding="async" />')
  })

  it('reserves every static public route from conflicting WordPress post slugs', () => {
    expect(isSafeWordPressPostSlug('privacy-policy')).toBe(false)
    expect(isSafeWordPressPostSlug('media')).toBe(false)
    expect(isSafeWordPressPostSlug('a-valid-field-update')).toBe(true)
  })
})
