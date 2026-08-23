<script setup lang="ts">
import { blogPageContent } from '~/data/pages'
import type { BlogPageContent } from '~/types/content'
import { withArticleSummaries } from '~/utils/articles'

const route = useRoute()
const slug = (Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug) ?? ''
const article = await useWordPressArticle(slug)
const articleCollection = await useWordPressArticleSummaries()
const blog = await useCmsContent<BlogPageContent>('blog', blogPageContent)
const relatedNews = computed(() =>
  withArticleSummaries(
    { ...blog.value.news, items: [] },
    articleCollection.value.filter((item) => item.to !== `/${slug}/`),
    3,
  ),
)

const pageArticle = computed(() => article.value)

if (!pageArticle.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

usePageSeo(() => {
  const currentArticle = pageArticle.value

  if (!currentArticle) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return {
    ...currentArticle.seo,
    path: `/${currentArticle.slug}/`,
    image: currentArticle.image,
    type: 'article',
    schemaName: currentArticle.title,
    schemaType: 'BlogPosting',
    datePublished: currentArticle.datePublished,
    dateModified: currentArticle.dateModified,
  }
})
</script>

<template>
  <ArticleBody v-if="pageArticle" :article="pageArticle" />
  <NewsSection :content="relatedNews" />
</template>
