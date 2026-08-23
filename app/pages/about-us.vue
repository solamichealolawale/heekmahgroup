<script setup lang="ts">
import { aboutPageContent } from '~/data/pages'
import type { InteriorPageContent } from '~/types/content'

const content = await useCmsContent<InteriorPageContent>('about', aboutPageContent)

usePageSeo(() => ({
  ...content.value.seo,
  path: '/about-us/',
  image: content.value.hero.image,
  schemaName: content.value.hero.title,
  schemaType: 'AboutPage',
}))
</script>

<template>
  <PageHero :content="content.hero" />
  <InteriorSections :sections="content.sections" />
</template>
