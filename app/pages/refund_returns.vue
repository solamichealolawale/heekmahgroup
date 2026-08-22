<script setup lang="ts">
import { refundPageContent } from '~/data/pages'
import type { LegalPageContent } from '~/types/content'

const content = await useCmsContent<LegalPageContent>('refunds', refundPageContent)

usePageSeo({
  ...content.value.seo,
  path: '/refund_returns/',
})
</script>

<template>
  <LegalContent :content="content" />
</template>
