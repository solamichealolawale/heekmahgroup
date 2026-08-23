<script setup lang="ts">
import { privacyPageContent } from '~/data/pages'
import type { LegalPageContent } from '~/types/content'

const content = await useCmsContent<LegalPageContent>('privacy', privacyPageContent)

usePageSeo(() => ({
  ...content.value.seo,
  path: '/privacy-policy/',
  schemaName: content.value.title,
}))
</script>

<template>
  <LegalContent :content="content" />
</template>
