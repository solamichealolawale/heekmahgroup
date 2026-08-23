import { mount } from '@vue/test-utils'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import HeroCarousel from '~/components/HeroCarousel.vue'

const slides = [
  {
    src: 'https://heekmahgroup.com/wp-content/uploads/slide-one.webp',
    alt: 'Heekmah rice processing activity',
    title: 'Rice processing built for consistent quality',
    description: 'Clean rice processing prepared for homes and businesses.',
    width: 1200,
    height: 900,
  },
  {
    src: 'https://heekmahgroup.com/wp-content/uploads/slide-two.webp',
    alt: 'Heekmah agricultural work in the field',
    title: 'Practical support for productive farms',
    description: 'Farm inputs and mechanisation where they are needed.',
    width: 1200,
    height: 900,
  },
  {
    src: 'https://heekmahgroup.com/wp-content/uploads/slide-three.webp',
    alt: 'Heekmah out-grower programme',
    title: 'Out-growers working with Heekmah',
    description: 'Partnerships that strengthen farmers and supply.',
    width: 1200,
    height: 900,
  },
  {
    src: 'https://heekmahgroup.com/wp-content/uploads/slide-four.webp',
    alt: 'Heekmah crop protection work',
    title: 'Crop protection in the field',
    description: 'Responsible protection for healthier farm output.',
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
    expect(renderedSlides).toHaveLength(4)
    expect(wrapper.findAll('.carousel-dot')).toHaveLength(4)
    expect(renderedSlides[0].classes()).toContain('is-active')
    expect(renderedSlides[1].attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('[aria-label="Show image 1"]').attributes('aria-current')).toBe('true')
    expect(renderedSlides[0].get('.carousel-slide-title').text()).toBe('Rice processing built for consistent quality')
    expect(renderedSlides[0].text()).not.toContain('Clean rice processing prepared for homes and businesses.')
    expect(wrapper.find('.carousel-slide h2').exists()).toBe(false)

    wrapper.unmount()
  })

  it('moves between slides with buttons and announces manual changes', async () => {
    const wrapper = mountCarousel()

    await wrapper.get('[aria-label="Show next image"]').trigger('click')

    expect(wrapper.findAll('.carousel-slide')[1].classes()).toContain('is-active')
    expect(wrapper.get('[aria-label="Show image 2"]').attributes('aria-current')).toBe('true')
    expect(wrapper.get('[aria-live="polite"]').text()).toBe(
      'Showing slide 2 of 4: Practical support for productive farms',
    )
    expect(wrapper.findAll('.carousel-slide')[1].get('.carousel-slide-title').text()).toBe(
      'Practical support for productive farms',
    )

    wrapper.unmount()
  })

  it('supports arrow-key navigation from the carousel region', async () => {
    const wrapper = mountCarousel()
    const region = wrapper.get('.hero-carousel')

    await region.trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.findAll('.carousel-slide')[3].classes()).toContain('is-active')
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

  it('aligns the counter, caption and controls to one left-hand guide', async () => {
    const source = await readFile(resolve(process.cwd(), 'app/components/HeroCarousel.vue'), 'utf8')

    expect(source).toContain('--carousel-content-inset: clamp(22px, 4vw, 38px)')
    expect(source).toContain('left: var(--carousel-content-inset)')
    expect(source).not.toMatch(/\.carousel-controls\s*\{[^}]*\bright:/s)
  })
})
