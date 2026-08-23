import { describe, expect, it } from 'vitest'

import { matchesContentShape } from '../app/utils/contentShape'

const reference = {
  hero: {
    title: 'Reference title',
    image: { src: '/reference.webp', width: 1600, height: 900 },
  },
  sections: [
    { kind: 'narrative', title: 'Story', paragraphs: ['One'] },
    { kind: 'principles', title: 'Direction', summary: 'A summary', items: [{ title: 'Mission' }] },
    { kind: 'principles', title: 'Growth', items: [{ title: 'Inputs' }] },
    { kind: 'callout', title: 'Act', body: 'Now' },
  ],
}

describe('matchesContentShape', () => {
  it('accepts valid content and API-enriched fields', () => {
    expect(
      matchesContentShape(
        {
          hero: {
            title: 'Live title',
            image: { src: '/live.webp', width: 1200, height: 800, srcSet: '/live-600.webp 600w' },
          },
          sections: [{ kind: 'callout', title: 'Contact us', body: 'Start here', extra: true }],
        },
        reference,
      ),
    ).toBe(true)
  })

  it('rejects a partial successful response before it can replace fallback state', () => {
    expect(matchesContentShape({ sections: [] }, reference)).toBe(false)
  })

  it('rejects a section whose discriminator is unknown', () => {
    expect(
      matchesContentShape(
        {
          hero: { title: 'Live title', image: { src: '/live.webp', width: 1200, height: 800 } },
          sections: [{ kind: 'unknown', title: 'Unsupported' }],
        },
        reference,
      ),
    ).toBe(false)
  })

  it('accepts valid variants that share a section discriminator', () => {
    expect(
      matchesContentShape(
        {
          hero: { title: 'Live title', image: { src: '/live.webp', width: 1200, height: 800 } },
          sections: [{ kind: 'principles', title: 'Progress', items: [{ title: 'Capability' }] }],
        },
        reference,
      ),
    ).toBe(true)
  })
})
