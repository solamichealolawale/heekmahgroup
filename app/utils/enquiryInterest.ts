import type { EnquiryInterestOption } from '~/types/content'

export function normalizeEnquiryInterest(
  value: unknown,
  options: readonly EnquiryInterestOption[],
  preferredFallback = 'general-enquiry',
): string {
  const values = new Set(options.map((option) => option.value))

  if (typeof value === 'string' && values.has(value)) {
    return value
  }

  if (values.has(preferredFallback)) {
    return preferredFallback
  }

  return options[0]?.value ?? ''
}
