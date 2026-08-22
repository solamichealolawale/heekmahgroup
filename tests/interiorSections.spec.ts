import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import InteriorSections from '~/components/InteriorSections.vue'
import type { InteriorSectionContent } from '~/types/content'

const sections = [
  {
    kind: 'principles',
    id: 'direction',
    eyebrow: 'Our direction',
    title: 'The purpose behind the work',
    summary: 'Mission and vision.',
    tone: 'rice',
    items: [
      { kicker: 'Mission', title: 'Make progress practical', body: 'A practical mission.' },
      { kicker: 'Vision', title: 'Build a trusted hub', body: 'A focused vision.' },
      { kicker: 'Commitment', title: 'Stay close to customers', body: 'A clear commitment.' },
    ],
  },
  {
    kind: 'principles',
    id: 'growth',
    eyebrow: 'How we have grown',
    title: 'Progress measured in capability, not noise',
    tone: 'brand',
    items: [
      { kicker: '01', title: 'Inputs', body: 'First capability.' },
      { kicker: '02', title: 'Research', body: 'Second capability.' },
      { kicker: '03', title: 'Processing', body: 'Third capability.' },
      { kicker: '04', title: 'Market links', body: 'Fourth capability.' },
    ],
  },
] as const satisfies readonly InteriorSectionContent[]

describe('InteriorSections About layouts', () => {
  it('uses distinct structures for purpose and capability growth', () => {
    const wrapper = mount(InteriorSections, { props: { sections } })

    expect(wrapper.findAll('.purpose-layout article')).toHaveLength(3)
    expect(wrapper.find('.purpose-layout article').attributes('data-primary')).toBe('true')
    expect(wrapper.findAll('.capability-path [role="listitem"]')).toHaveLength(4)
    expect(wrapper.findAll('.principles-grid')).toHaveLength(0)
  })
})
