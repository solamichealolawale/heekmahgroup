import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readComponent = (name: string) => readFile(resolve(process.cwd(), `app/components/${name}.vue`), 'utf8')

describe('item separators', () => {
  it('draws excellence, company and FAQ rules only between adjacent items', async () => {
    const [excellence, companies, faq] = await Promise.all([
      readComponent('ExcellenceSection'),
      readComponent('BusinessLines'),
      readComponent('FaqSection'),
    ])

    expect(excellence).toContain('.excellence-list li + li')
    expect(excellence).not.toMatch(/\.excellence-list\s*{[^}]*border-top/s)
    expect(companies).toContain('.business-item + .business-item')
    expect(companies).not.toMatch(/\.business-list\s*{[^}]*border-top/s)
    expect(faq).toContain('details + details')
    expect(faq).not.toMatch(/\.faq-list\s*{[^}]*border-top/s)
  })

  it('does not put an outer top rule around card grids', async () => {
    const [testimonials, conversion, interior] = await Promise.all([
      readComponent('TestimonialSection'),
      readComponent('ConversionPanel'),
      readComponent('InteriorSections'),
    ])

    expect(testimonials).not.toMatch(/\.testimonial-list\s*{[^}]*border-top/s)
    expect(conversion).not.toMatch(/\.conversion-list\s*{[^}]*border-top/s)
    expect(interior).not.toMatch(/\.principles-grid\s*{[^}]*border-top/s)
  })
})
