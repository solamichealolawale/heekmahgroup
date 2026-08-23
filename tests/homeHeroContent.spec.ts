import { describe, expect, it } from 'vitest'

import { homePageContent } from '~/data/home'

describe('home hero content', () => {
  it('uses the four retained WordPress slider attachments in their saved order', () => {
    expect(homePageContent.hero.slides).toHaveLength(4)
    expect(homePageContent.hero.slides.map(({ attachmentId }) => attachmentId)).toEqual([8739, 8886, 8882, 8892])
    expect(homePageContent.hero.slides.map(({ src }) => src.split('/').at(-1))).toEqual([
      'pexels-agro-oliveira-289675200-13157324-1-scaled.webp',
      'heekah.webp',
      'outgrowers.webp',
      'chemical.webp',
    ])
  })

  it('pairs every retained image with a concise, image-specific caption', () => {
    expect(homePageContent.hero.slides.map(({ title }) => title)).toEqual([
      'Farm mechanisation',
      'Heekmah Rice, ready for distribution',
      'Supporting our out-growers',
      'Crop protection in practice',
    ])
    expect(homePageContent.hero.slides.every(({ description }) => description.length > 50)).toBe(true)
  })

  it('frames the final conversion panel as a next step instead of an opening prompt', () => {
    expect(homePageContent.conversion.eyebrow).toBe('Next steps')
    expect(homePageContent.conversion.title).toBe('Talk to the right team')
  })
})
