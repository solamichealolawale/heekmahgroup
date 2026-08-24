<script setup lang="ts">
import { termsPageContent } from '~/data/pages'
import type { LegalPageContent } from '~/types/content'

const content = await useCmsContent<LegalPageContent>('terms', termsPageContent)

usePageSeo(() => ({
  ...content.value.seo,
  path: '/terms-conditon/',
}))
</script>

<template>
  <LegalContent :content="content" />
</template>
