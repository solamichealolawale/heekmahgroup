import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import EnquiryInterestSelect from '~/components/EnquiryInterestSelect.vue'
import { normalizeEnquiryInterest } from '~/utils/enquiryInterest'

const options = [
  { value: 'general-enquiry', label: 'General enquiry' },
  { value: 'agricultural-services', label: 'Agricultural services' },
  { value: 'rice-order', label: 'Order Heekmah rice' },
] as const

function mountSelect(modelValue = 'general-enquiry', disabled = false) {
  return mount(EnquiryInterestSelect, {
    attachTo: document.body,
    props: {
      modelValue,
      options,
      inputId: 'enquiry-interest',
      inputName: 'interest',
      required: true,
      disabled,
      'onUpdate:modelValue': () => undefined,
    },
  })
}

describe('EnquiryInterestSelect', () => {
  it('renders an accessible closed trigger with the selected value and form semantics', () => {
    const wrapper = mountSelect()
    const trigger = wrapper.get('#enquiry-interest')

    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.text()).toContain('General enquiry')
    expect(document.querySelector('[name="interest"]')).not.toBeNull()
  })

  it('opens from the keyboard and maps the first typeahead keystroke to item text', async () => {
    const wrapper = mountSelect()
    const trigger = wrapper.get('#enquiry-interest')

    await trigger.trigger('keydown', { key: 'Enter', code: 'Enter' })
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')

    const listbox = document.querySelector('[role="listbox"]')
    expect(listbox).not.toBeNull()
    listbox?.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
    await nextTick()

    const highlighted = document.querySelector('[role="option"][data-highlighted]')
    expect(highlighted?.textContent).toContain('Agricultural services')
  })

  it('exposes the disabled state on its trigger', () => {
    const wrapper = mountSelect('general-enquiry', true)
    expect(wrapper.get('#enquiry-interest').attributes('disabled')).toBeDefined()
  })
})

describe('normalizeEnquiryInterest', () => {
  it('keeps a known value and replaces stale or missing values deterministically', () => {
    expect(normalizeEnquiryInterest('rice-order', options)).toBe('rice-order')
    expect(normalizeEnquiryInterest('retired-option', options)).toBe('general-enquiry')
    expect(normalizeEnquiryInterest(undefined, options, 'missing-fallback')).toBe('general-enquiry')
    expect(normalizeEnquiryInterest('anything', [], 'general-enquiry')).toBe('')
  })
})
