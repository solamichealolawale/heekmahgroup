import { describe, expect, it } from 'vitest'

import { homePageContent } from '~/data/home'

describe('home hero content', () => {
  it('uses the five original WordPress slider attachments in their saved order', () => {
    expect(homePageContent.hero.slides).toHaveLength(5)
    expect(homePageContent.hero.slides.map(({ attachmentId }) => attachmentId)).toEqual([8739, 8886, 8882, 8892, 8747])
    expect(homePageContent.hero.slides.map(({ src }) => src.split('/').at(-1))).toEqual([
      'pexels-agro-oliveira-289675200-13157324-1-scaled.webp',
      'heekah.webp',
      'outgrowers.webp',
      'chemical.webp',
      'pexels-agro-oliveira-289675200-13157324-3-scaled.webp',
    ])
  })
})
