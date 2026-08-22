<script setup lang="ts">
import { ricePageContent } from '~/data/pages'
import type { InteriorPageContent } from '~/types/content'

const content = await useCmsContent<InteriorPageContent>('rice', ricePageContent)

usePageSeo({
  ...content.value.seo,
  path: '/heekmah-rice/',
  image: content.value.hero.image,
  schemaName: content.value.hero.title,
})
</script>

<template>
  <PageHero :content="content.hero" />
  <InteriorSections :sections="content.sections" />
</template>
