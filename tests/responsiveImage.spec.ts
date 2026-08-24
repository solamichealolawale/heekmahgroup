import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ResponsiveImage from '~/components/ResponsiveImage.vue'

const NuxtImgStub = {
  inheritAttrs: false,
  props: ['provider', 'src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'fetchpriority', 'preload'],
  template:
    '<img data-nuxt-img :data-provider="provider" :data-preload="preload && preload.fetchPriority" :src="src" :srcset="srcset" :sizes="sizes" :alt="alt" :width="width" :height="height" :loading="loading" :fetchpriority="fetchpriority" />',
}

describe('ResponsiveImage', () => {
  it('renders WordPress carousel media through Nuxt Image with the saved responsive variants', () => {
    const src = 'https://heekmahgroup.com/wp-content/uploads/2025/01/heekah.webp'
    const wrapper = mount(ResponsiveImage, {
      props: {
        asset: {
          src,
          alt: 'Stacked bags of Heekmah Rice ready for distribution',
          width: 2560,
          height: 1620,
        },
        sizes: '(max-width: 820px) 100vw, 570px',
        nuxtSizes: '100vw sm:600px md:640px lg:42vw xl:570px',
        loading: 'eager',
        fetchPriority: 'high',
        preload: true,
      },
      global: {
        stubs: { NuxtImg: NuxtImgStub },
      },
    })

    const image = wrapper.get('[data-nuxt-img]')
    expect(image.attributes('data-provider')).toBe('none')
    expect(image.attributes('src')).toBe(src)
    expect(image.attributes('srcset')).toContain('heekah-768x486.webp 768w')
    expect(image.attributes('sizes')).toBe('100vw sm:600px md:640px lg:42vw xl:570px')
    expect(image.attributes('loading')).toBe('eager')
    expect(image.attributes('fetchpriority')).toBe('high')
    expect(image.attributes('data-preload')).toBeUndefined()
  })

  it('caps WordPress candidates when a full-width image does not need the original upload', () => {
    const src = 'https://heekmahgroup.com/wp-content/uploads/2025/01/heekah.webp'
    const wrapper = mount(ResponsiveImage, {
      props: {
        asset: {
          src,
          alt: 'Farm machinery',
          width: 2560,
          height: 1620,
        },
        sizes: '100vw',
        nuxtSizes: '100vw',
        maxWidth: 1536,
      },
      global: {
        stubs: { NuxtImg: NuxtImgStub },
      },
    })

    const srcSet = wrapper.get('[data-nuxt-img]').attributes('srcset')
    expect(srcSet).toContain('heekah-1536x972.webp 1536w')
    expect(srcSet).not.toContain('heekah-2048x1296.webp')
    expect(srcSet).not.toContain('heekah.webp 2560w')
  })
})
