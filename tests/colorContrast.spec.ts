import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function channel(value: number): number {
  const normalized = value / 255
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16)
  return 0.2126 * channel((value >> 16) & 255) + 0.7152 * channel((value >> 8) & 255) + 0.0722 * channel(value & 255)
}

function contrast(first: string, second: string): number {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('light theme color contrast', () => {
  it('keeps earth-colored labels readable on the paper and rice surfaces', async () => {
    const css = await readFile(resolve(process.cwd(), 'app/assets/css/main.css'), 'utf8')
    const lightTheme = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? ''
    const token = (name: string) => lightTheme.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1] ?? ''

    expect(contrast(token('earth'), token('paper'))).toBeGreaterThanOrEqual(4.5)
    expect(contrast(token('earth'), token('rice-light'))).toBeGreaterThanOrEqual(4.5)
  })
})
