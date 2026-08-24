import { describe, expect, it } from 'vitest'

import { sanitizeWordPressContentInBrowser, transformWordPressPostInBrowser } from '../app/utils/wordpressPostClient'
import type { WordPressPost } from '../app/utils/wordpressPostValidation'

const post = {
  id: 204,
  slug: 'a-live-story',
  date: '2026-08-20T10:30:00',
  modified: '2026-08-22T11:45:00',
  title: { rendered: 'A live &amp; safe story' },
  excerpt: { rendered: '<p>Updated directly in WordPress.</p>' },
  content: {
    rendered: `
      <p onclick="alert('bad')">Updated body.</p>
      <script>alert('bad')</script>
      <a href="#field-notes">Field notes</a>
      <a href="https://www.heekmahgroup.com/heekmah-services/">Services</a>
      <a href="https://example.com/research" target="_blank">Research</a>
      <img src="https://heekmahgroup.com/wp-content/uploads/field.webp" onerror="alert('bad')">
    `,
  },
  featured_media: 0,
  categories: [],
} as const satisfies WordPressPost

describe('WordPress browser article adapter', () => {
  it('sanitizes refreshed HTML without the server-only sanitizer', () => {
    const html = sanitizeWordPressContentInBrowser(post.content.rendered)

    expect(html).not.toContain('<script')
    expect(html).not.toContain('onclick')
    expect(html).not.toContain('onerror')
    expect(html).toContain('href="#field-notes"')
    expect(html).toContain('href="/heekmah-integral-services/"')
    expect(html).toContain('target="_blank" rel="noopener noreferrer"')
    expect(html).toContain('alt="" loading="lazy" decoding="async"')
  })

  it('maps refreshed post content to the same article contract as generation', () => {
    const article = transformWordPressPostInBrowser(post)

    expect(article).toMatchObject({
      slug: 'a-live-story',
      title: 'A live & safe story',
      summary: 'Updated directly in WordPress.',
      datePublished: '2026-08-20',
      dateModified: '2026-08-22',
      source: 'wordpress',
    })
    expect(article.html).toContain('Updated body.')
  })
})
