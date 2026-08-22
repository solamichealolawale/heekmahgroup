import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'

import SiteNavigation from '~/components/SiteNavigation.vue'

const items = [
  { label: 'About us', to: '/about-us/' },
  { label: 'Heekmah Rice', to: '/heekmah-rice/' },
  { label: 'Integral Services', to: '/heekmah-integral-services/' },
  { label: 'Blog', to: '/blog/' },
] as const

async function mountNavigation(path = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      ...items.map((item) => ({ path: item.to, component: { template: '<div />' } })),
    ],
  })
  await router.push(path)
  await router.isReady()

  return mount(SiteNavigation, {
    attachTo: document.body,
    props: { items, servicesLabel: 'Our Services' },
    global: { plugins: [router] },
  })
}

describe('SiteNavigation', () => {
  it('uses one named navigation landmark and a closed services disclosure by default', async () => {
    const wrapper = await mountNavigation()
    const trigger = wrapper.get('button')

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Primary navigation')
    expect(trigger.text()).toContain('Our Services')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-controls')).toBeTruthy()
  })

  it('activates its button trigger and exposes both service destinations', async () => {
    const wrapper = await mountNavigation()
    const trigger = wrapper.get('button')

    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.text()).toContain('Heekmah Rice')
    expect(wrapper.text()).toContain('Integral Services')
  })

  it('marks the services trigger when a service route is active', async () => {
    const wrapper = await mountNavigation('/heekmah-rice/')
    expect(wrapper.get('button').attributes('data-route-active')).toBe('true')
  })
})
