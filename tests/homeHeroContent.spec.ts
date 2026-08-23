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

  it('pairs every retained image with its original WordPress slider copy', () => {
    expect(homePageContent.hero.slides.map(({ title }) => title)).toEqual([
      'Innovative Solutions for Sustainable Agriculture',
      'The No. 1 Choice for Healthy, Nutritious Rice',
      'Join Our Out-Grower Program',
      'Eco-Friendly Fertilizers, Chemicals, and Mechanization Services',
    ])
    expect(homePageContent.hero.slides.every(({ description }) => description.length > 50)).toBe(true)
  })
})
