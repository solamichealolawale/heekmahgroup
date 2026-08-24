import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ThemeToggle from '~/components/ThemeToggle.vue'

type SchemeListener = () => void

function installColorSchemePreference(matches: boolean) {
  let prefersDark = matches
  const listeners = new Set<SchemeListener>()
  const query = {
    get matches() {
      return prefersDark
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_type: string, listener: SchemeListener) => listeners.add(listener),
    removeEventListener: (_type: string, listener: SchemeListener) => listeners.delete(listener),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => query),
  )

  return {
    setDark(value: boolean) {
      prefersDark = value
      listeners.forEach((listener) => listener())
    },
  }
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    vi.stubGlobal('useHead', vi.fn())
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-theme-mode')
    document.head.innerHTML = '<meta name="theme-color" content="#fbf9f3">'
  })

  it('defaults to system mode and follows system changes', async () => {
    const system = installColorSchemePreference(true)
    const wrapper = mount(ThemeToggle)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('button').attributes('data-mode')).toBe('system')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Theme: System. Switch to Light mode')
    expect(document.documentElement.dataset.theme).toBe('dark')

    system.setDark(false)
    await wrapper.vm.$nextTick()

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#fbf9f3')
    wrapper.unmount()
  })

  it('cycles through system, light and dark while remembering the explicit mode', async () => {
    installColorSchemePreference(true)
    const wrapper = mount(ThemeToggle)
    const button = wrapper.get('button')

    await button.trigger('click')
    expect(button.attributes('data-mode')).toBe('light')
    expect(localStorage.getItem('heekmah-theme')).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')

    await button.trigger('click')
    expect(button.attributes('data-mode')).toBe('dark')
    expect(localStorage.getItem('heekmah-theme')).toBe('dark')

    await button.trigger('click')
    expect(button.attributes('data-mode')).toBe('system')
    expect(localStorage.getItem('heekmah-theme')).toBe('system')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(wrapper.get('[aria-live="polite"]').text()).toContain('System theme selected')
    wrapper.unmount()
  })

  it('restores a saved explicit mode without following later system changes', async () => {
    localStorage.setItem('heekmah-theme', 'light')
    const system = installColorSchemePreference(false)
    const wrapper = mount(ThemeToggle)

    system.setDark(true)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('button').attributes('data-mode')).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    wrapper.unmount()
  })
})
