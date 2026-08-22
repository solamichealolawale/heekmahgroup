<script setup lang="ts">
import { blogPageContent } from '~/data/pages'
import type { BlogPageContent, CalloutSectionContent } from '~/types/content'
import { withArticleSummaries } from '~/utils/articles'

const content = await useCmsContent<BlogPageContent>('blog', blogPageContent)
const articles = await useWordPressArticleSummaries()
const blogNews = computed(() => withArticleSummaries({ ...content.value.news, items: [] }, articles.value))

const blogCallout = {
  kind: 'callout',
  id: 'share-an-idea',
  eyebrow: 'Work with Heekmah',
  title: 'Good agricultural ideas become useful through implementation.',
  body: 'Talk to our team about research, distribution, farmer support or a commercial partnership.',
  primaryAction: { label: 'Start a conversation', to: '/contact-us/?interest=partnership' },
  secondaryAction: { label: 'Call +234 905 555 4302', to: 'tel:+2349055554302' },
} as const satisfies CalloutSectionContent

usePageSeo({
  ...content.value.seo,
  path: '/blog/',
  image: content.value.hero.image,
  schemaName: content.value.hero.title,
  schemaType: 'CollectionPage',
})
</script>

<template>
  <PageHero :content="content.hero" />
  <NewsSection :content="blogNews" />
  <InteriorSections :sections="[blogCallout]" />
</template>
