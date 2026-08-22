<script setup lang="ts">
import { siteContent } from '~/data/site'
import type { SiteContent } from '~/types/content'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl.replace(/\/$/, '')
const site = await useCmsContent<SiteContent>('site', siteContent)
const logoUrl = site.value.logo.src.startsWith('/') ? `${siteUrl}${site.value.logo.src}` : site.value.logo.src

useJsonLd('heekmah-site-schema', {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: site.value.brandName,
      url: `${siteUrl}/`,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
        width: site.value.logo.width,
        height: site.value.logo.height,
      },
      email: site.value.contact.email,
      telephone: site.value.contact.phoneHref,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.value.contact.addressLines.join(' '),
        addressCountry: 'NG',
      },
      areaServed: 'Nigeria',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: site.value.brandName,
      description: site.value.tagline,
      inLanguage: 'en-NG',
      publisher: { '@id': `${siteUrl}/#organization` },
    },
  ],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
