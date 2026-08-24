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

  it('rejects an empty list when the public design requires at least one item', () => {
    expect(
      matchesContentShape(
        {
          hero: { title: 'Live title', image: { src: '/live.webp', width: 1200, height: 800 } },
          sections: [],
        },
        reference,
      ),
    ).toBe(false)
  })

  it('rejects duplicate section identifiers before they become Vue keys or anchors', () => {
    expect(
      matchesContentShape(
        {
          hero: { title: 'Live title', image: { src: '/live.webp', width: 1200, height: 800 } },
          sections: [
            { kind: 'callout', id: 'same-section', title: 'First', body: 'One' },
            { kind: 'callout', id: 'same-section', title: 'Second', body: 'Two' },
          ],
        },
        {
          ...reference,
          sections: [{ kind: 'callout', id: 'reference', title: 'Act', body: 'Now' }],
        },
      ),
    ).toBe(false)
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

  it('rejects executable link schemes while retaining supported destinations', () => {
    const actionReference = { action: { label: 'Contact', to: '/contact-us/' } }

    expect(matchesContentShape({ action: { label: 'Call', to: 'tel:+2349055554302' } }, actionReference)).toBe(true)
    expect(matchesContentShape({ action: { label: 'Read', to: '#details' } }, actionReference)).toBe(true)
    expect(matchesContentShape({ action: { label: 'Unsafe', to: 'javascript:alert(1)' } }, actionReference)).toBe(false)
    expect(matchesContentShape({ action: { label: 'Unsafe', to: '//attacker.example' } }, actionReference)).toBe(false)
  })

  it('rejects blank required copy and invalid positive dimensions', () => {
    expect(
      matchesContentShape(
        {
          hero: { title: '   ', image: { src: '/live.webp', width: 1200, height: 800 } },
          sections: reference.sections,
        },
        reference,
      ),
    ).toBe(false)
    expect(
      matchesContentShape(
        { hero: { title: 'Live title', image: { src: '', width: 0, height: -1 } }, sections: reference.sections },
        reference,
      ),
    ).toBe(false)
  })

  it('allows deliberately empty optional or decorative strings when the reference is empty', () => {
    expect(matchesContentShape({ alt: '' }, { alt: '' })).toBe(true)
  })
})
