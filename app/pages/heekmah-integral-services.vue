<script setup lang="ts">
import { servicesPageContent } from '~/data/pages'
import type { InteriorPageContent } from '~/types/content'

const content = await useCmsContent<InteriorPageContent>('services', servicesPageContent)

usePageSeo(() => ({
  ...content.value.seo,
  path: '/heekmah-integral-services/',
  image: content.value.hero.image,
  schemaName: content.value.hero.title,
}))
</script>

<template>
  <PageHero :content="content.hero" />
  <InteriorSections :sections="content.sections" />
</template>
