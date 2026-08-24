import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const homepageSource = readFileSync(resolve('app/pages/index.vue'), 'utf8')

describe('homepage section hierarchy', () => {
  it('explains the business before presenting the final conversion paths', () => {
    const story = homepageSource.indexOf('<StorySection')
    const companies = homepageSource.indexOf('<BusinessLines')
    const products = homepageSource.indexOf('<ProductRange')
    const news = homepageSource.indexOf('<NewsSection')
    const faq = homepageSource.indexOf('<FaqSection')
    const conversion = homepageSource.indexOf('<ConversionPanel')

    expect(story).toBeGreaterThan(-1)
    expect(story).toBeLessThan(companies)
    expect(companies).toBeLessThan(products)
    expect(products).toBeLessThan(news)
    expect(news).toBeLessThan(faq)
    expect(faq).toBeLessThan(conversion)
    expect(homepageSource).not.toContain('<PartnershipCta')
  })
})
