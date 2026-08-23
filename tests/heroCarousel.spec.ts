import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import HeroCarousel from '~/components/HeroCarousel.vue'

const slides = [
  {
    src: 'https://heekmahgroup.com/wp-content/uploads/slide-one.webp',
    alt: 'Heekmah rice processing activity',
    width: 1200,
    height: 900,
  },
  {
    src: 'https://heekmahgroup.com/wp-content/uploads/slide-two.webp',
    alt: 'Heekmah agricultural work in the field',
    width: 1200,
    height: 900,
  },
  {
    src: 'https://heekmahgroup.com/wp-content/uploads/slide-three.webp',
    alt: 'Heekmah out-grower programme',
    width: 1200,
    height: 900,
  },
  {
    src: 'https://heekmahgroup.com/wp-content/uploads/slide-four.webp',
    alt: 'Heekmah crop protection work',
    width: 1200,
    height: 900,
  },
  {
    src: 'https://heekmahgroup.com/wp-content/uploads/slide-five.webp',
    alt: 'A seedling held in a farmer’s hand',
    width: 1200,
    height: 900,
  },
] as const

const ResponsiveImageStub = {
  props: ['asset'],
  template: '<img :src="asset.src" :alt="asset.alt" />',
}

function mountCarousel(autoplay = false) {
  return mount(HeroCarousel, {
    attachTo: document.body,
    props: {
      slides,
      caption: 'From field to table',
      autoplay,
    },
    global: {
      stubs: { ResponsiveImage: ResponsiveImageStub },
    },
  })
}

describe('HeroCarousel', () => {
  it('renders a named carousel with one active slide and explicit controls', () => {
    const wrapper = mountCarousel()
    const renderedSlides = wrapper.findAll('.carousel-slide')

    expect(wrapper.get('.hero-carousel').attributes('aria-roledescription')).toBe('carousel')
    expect(renderedSlides).toHaveLength(5)
    expect(wrapper.findAll('.carousel-dot')).toHaveLength(5)
    expect(renderedSlides[0].classes()).toContain('is-active')
    expect(renderedSlides[1].attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('[aria-label="Show image 1"]').attributes('aria-current')).toBe('true')

    wrapper.unmount()
  })

  it('moves between slides with buttons and announces manual changes', async () => {
    const wrapper = mountCarousel()

    await wrapper.get('[aria-label="Show next image"]').trigger('click')

    expect(wrapper.findAll('.carousel-slide')[1].classes()).toContain('is-active')
    expect(wrapper.get('[aria-label="Show image 2"]').attributes('aria-current')).toBe('true')
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('Showing slide 2 of 5.')

    wrapper.unmount()
  })

  it('supports arrow-key navigation from the carousel region', async () => {
    const wrapper = mountCarousel()
    const region = wrapper.get('.hero-carousel')

    await region.trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.findAll('.carousel-slide')[4].classes()).toContain('is-active')
    wrapper.unmount()
  })

  it('lets visitors pause and resume automatic rotation', async () => {
    const wrapper = mountCarousel(true)
    const pauseButton = wrapper.get('[aria-label="Pause automatic slides"]')

    await pauseButton.trigger('click')
    expect(pauseButton.attributes('aria-pressed')).toBe('true')
    expect(pauseButton.attributes('aria-label')).toBe('Resume automatic slides')

    await pauseButton.trigger('click')
    expect(pauseButton.attributes('aria-pressed')).toBe('false')
    wrapper.unmount()
  })
})
