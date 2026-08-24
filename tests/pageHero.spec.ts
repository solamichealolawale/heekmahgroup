import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PageHero from '~/components/PageHero.vue'
import type { PageHeroContent } from '~/types/content'

const content = {
  eyebrow: 'Heekmah Rice Nigeria Limited',
  title: 'Built for progress across the agricultural value chain.',
  summary: 'Rice processed for households, retailers, caterers and bulk buyers.',
  primaryAction: { label: 'Request a rice quote', to: '/contact-us/?interest=rice-order' },
  secondaryAction: { label: 'View our products', to: '#rice-products' },
  image: {
    src: 'https://heekmahgroup.com/wp-content/uploads/2025/01/parr-rice.webp',
    alt: 'Clean long-grain rice',
    width: 2560,
    height: 1909,
  },
  imageCaption: 'Processed in Sokoto and made for homes and businesses',
  facts: [
    { value: '240 MT/day', label: 'Automated processing capacity' },
    { value: '10–50 kg', label: 'Parboiled rice pack sizes' },
  ],
} as const satisfies PageHeroContent

const ResponsiveImageStub = {
  inheritAttrs: false,
  props: {
    asset: { type: Object, required: true },
    sizes: { type: String, required: true },
    nuxtSizes: String,
    fetchPriority: String,
    loading: String,
    preload: Boolean,
    maxWidth: Number,
  },
  template:
    '<img data-responsive-image :data-sizes="sizes" :data-nuxt-sizes="nuxtSizes" :data-max-width="maxWidth" :data-fetch-priority="fetchPriority" :data-loading="loading" :data-preload="preload ? \'true\' : null" :src="asset.src" :alt="asset.alt" />',
}

const NuxtLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

describe('PageHero', () => {
  it('uses a full-width, high-priority responsive image and keeps facts below the visual', () => {
    const wrapper = mount(PageHero, {
      props: { content },
      global: { stubs: { ResponsiveImage: ResponsiveImageStub, NuxtLink: NuxtLinkStub } },
    })

    const image = wrapper.get('[data-responsive-image]')
    expect(image.attributes('data-sizes')).toBe('100vw')
    expect(image.attributes('data-nuxt-sizes')).toBe('100vw')
    expect(image.attributes('data-max-width')).toBe('1536')
    expect(image.attributes('data-fetch-priority')).toBe('high')
    expect(image.attributes('data-loading')).toBe('eager')
    expect(image.attributes('data-preload')).toBeUndefined()
    expect(wrapper.get('h1').classes()).toContain('is-long')
    expect(wrapper.find('.page-hero-visual .page-hero-facts').exists()).toBe(false)
    expect(wrapper.findAll('.page-hero-facts > div')).toHaveLength(2)
  })

  it('preserves a readable text-only variant when an editor removes the image', () => {
    const wrapper = mount(PageHero, {
      props: { content: { ...content, image: undefined, imageCaption: undefined } },
      global: { stubs: { ResponsiveImage: ResponsiveImageStub, NuxtLink: NuxtLinkStub } },
    })

    expect(wrapper.get('.page-hero').attributes('data-has-image')).toBe('false')
    expect(wrapper.find('[data-responsive-image]').exists()).toBe(false)
    expect(wrapper.get('h1').text()).toBe(content.title)
  })
})
