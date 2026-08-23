import { describe, expect, it } from 'vitest'

import { enquirySubmissionErrorMessage } from '../app/utils/enquirySubmission'

describe('enquirySubmissionErrorMessage', () => {
  it('guides visitors to correct invalid form data', () => {
    expect(enquirySubmissionErrorMessage({ statusCode: 400 })).toContain('review the information')
    expect(enquirySubmissionErrorMessage({ response: { status: 422 } })).toContain('review the information')
  })

  it('explains rate limiting without presenting it as an outage', () => {
    expect(enquirySubmissionErrorMessage({ status: 429 })).toContain('wait a few minutes')
  })

  it('keeps direct contact details available for network and server failures', () => {
    const message = enquirySubmissionErrorMessage(new Error('Network failed'))

    expect(message).toContain('info@heekmahgroup.com')
    expect(message).toContain('+234 905 555 4302')
  })
})
