<script setup lang="ts">
import { blogPageContent } from '~/data/pages'
import type { BlogPageContent } from '~/types/content'
import { withArticleSummaries } from '~/utils/articles'

const content = await useCmsContent<BlogPageContent>('blog', blogPageContent)
const articles = await useWordPressArticleSummaries()
const blogNews = computed(() => withArticleSummaries({ ...content.value.news, items: [] }, articles.value))

usePageSeo(() => ({
  ...content.value.seo,
  path: '/blog/',
  image: content.value.hero.image,
  schemaName: content.value.hero.title,
  schemaType: 'CollectionPage',
}))
</script>

<template>
  <PageHero :content="content.hero" />
  <NewsSection :content="blogNews" />
  <InteriorSections :sections="[content.callout]" />
</template>
