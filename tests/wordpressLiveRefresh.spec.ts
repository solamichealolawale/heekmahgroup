import { afterEach, describe, expect, it, vi } from 'vitest'

import { getWordPressArticleSummaries } from '../app/utils/wordpressPostSummaries'
import { getWordPressArticle } from '../app/utils/wordpressPosts'

afterEach(() => {
  vi.unstubAllGlobals()
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
})
