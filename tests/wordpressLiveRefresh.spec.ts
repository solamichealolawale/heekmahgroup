import { afterEach, describe, expect, it, vi } from 'vitest'

import { getWordPressArticleSummaries } from '../app/utils/wordpressPostSummaries'
import { getWordPressArticle, getWordPressArticles } from '../app/utils/wordpressPosts'

const summaryPost = {
  id: 88,
  slug: 'paginated-story',
  date: '2026-08-20T10:30:00',
  modified: '2026-08-21T11:45:00',
  title: { rendered: 'Paginated story' },
  excerpt: { rendered: '<p>A story beyond the first page.</p>' },
  featured_media: 0,
  categories: [],
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('WordPress live refresh requests', () => {
  it('treats a successful missing slug as unpublished instead of restoring fallback content', async () => {
    const raw = vi.fn().mockResolvedValue({ _data: [] })
    vi.stubGlobal('$fetch', { raw })

    await expect(getWordPressArticle('https://missing.example', 'retired-story')).resolves.toBeUndefined()
    expect(raw).toHaveBeenCalledWith(
      'https://missing.example/wp-json/wp/v2/posts',
      expect.objectContaining({
        query: expect.objectContaining({
          slug: 'retired-story',
          per_page: 1,
          heekmah_refresh: expect.any(Number),
        }),
      }),
    )
  })

  it('requests lightweight summary fields without downloading every post body', async () => {
    const raw = vi.fn().mockResolvedValue({ _data: [] })
    vi.stubGlobal('$fetch', { raw })

    await expect(getWordPressArticleSummaries('https://summaries.example')).resolves.toEqual([])

    const options = raw.mock.calls[0]?.[1]
    expect(options.query._fields).not.toContain('content')
    expect(options.query.per_page).toBe(100)
    expect(options.query.heekmah_refresh).toEqual(expect.any(Number))
  })

  it('rejects malformed native post responses before they reach the page', async () => {
    const raw = vi.fn().mockResolvedValue({ _data: { title: 'not a post array' } })
    vi.stubGlobal('$fetch', { raw })

    await expect(getWordPressArticle('https://malformed-detail.example', 'unsafe-story')).rejects.toThrow(
      'invalid Posts API response',
    )
    await expect(getWordPressArticleSummaries('https://malformed-summaries.example')).rejects.toThrow(
      'invalid Posts API response',
    )
  })

  it('refreshes every reported summary page instead of truncating the archive at 100 posts', async () => {
    const raw = vi.fn().mockImplementation((_url, options) =>
      Promise.resolve({
        _data: [{ ...summaryPost, id: options.query.page }],
        headers: new Headers({ 'x-wp-totalpages': '2' }),
      }),
    )
    vi.stubGlobal('$fetch', { raw })

    const summaries = await getWordPressArticleSummaries('https://paginated-summaries.example')

    expect(summaries).toHaveLength(2)
    expect(raw).toHaveBeenCalledTimes(2)
    expect(raw.mock.calls.map((call) => call[1].query.page)).toEqual([1, 2])
  })

  it('supports a strict no-fallback mode for production CMS failures', async () => {
    const failure = new Error('WordPress is offline')
    const raw = vi.fn().mockRejectedValue(failure)
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.stubGlobal('$fetch', { raw })

    await expect(getWordPressArticles('https://strict-build.example', true, false)).rejects.toBe(failure)
    await expect(getWordPressArticles('https://preview-fallback.example', true, true)).resolves.not.toEqual([])
    expect(warning).toHaveBeenCalledOnce()
  })
})
