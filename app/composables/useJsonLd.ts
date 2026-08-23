import { toValue, type MaybeRefOrGetter } from 'vue'

type JsonLdRecord = Readonly<Record<string, unknown>>

function serializeJsonLd(value: JsonLdRecord): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function useJsonLd(key: string, value: MaybeRefOrGetter<JsonLdRecord>): void {
  useHead(() => ({
    script: [
      {
        key,
        type: 'application/ld+json',
        innerHTML: serializeJsonLd(toValue(value)),
      },
    ],
  }))
}
