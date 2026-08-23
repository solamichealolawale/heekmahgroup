const fallbackMessage =
  'The online enquiry service is unavailable right now. Please email info@heekmahgroup.com or call +234 905 555 4302.'

function errorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined

  const candidate = error as {
    status?: unknown
    statusCode?: unknown
    response?: { status?: unknown }
  }
  const status = candidate.statusCode ?? candidate.status ?? candidate.response?.status

  return typeof status === 'number' ? status : undefined
}

export function enquirySubmissionErrorMessage(error: unknown): string {
  const status = errorStatus(error)

  if (status === 400 || status === 422) {
    return 'Please review the information you entered and try again. If the problem continues, email info@heekmahgroup.com or call +234 905 555 4302.'
  }

  if (status === 429) {
    return 'Too many enquiries were sent in a short time. Please wait a few minutes, then try again—or email info@heekmahgroup.com.'
  }

  return fallbackMessage
}
