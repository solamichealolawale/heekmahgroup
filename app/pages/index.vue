<script setup lang="ts">
import { homePageContent } from '~/data/home'
import type { HomePageContent } from '~/types/content'
import { withArticleSummaries } from '~/utils/articles'

const content = await useCmsContent<HomePageContent>('home', homePageContent)
const articles = await useWordPressArticleSummaries()
const latestNews = computed(() => withArticleSummaries(content.value.articles, articles.value, 3))

usePageSeo(() => ({
  ...content.value.seo,
  path: '/',
  image: content.value.hero.slides[0],
  schemaName: content.value.hero.title,
}))
</script>

<template>
  <HomeHero :content="content.hero" />
  <StorySection :content="content.story" />
  <BusinessLines :content="content.businessLines" />
  <ExcellenceSection :content="content.excellence" />
  <ProductRange :content="content.products" />
  <TestimonialSection :content="content.testimonials" />
  <NewsSection :content="latestNews" />
  <FaqSection :content="content.faqs" />
  <ConversionPanel :content="content.conversion" />
</template>
