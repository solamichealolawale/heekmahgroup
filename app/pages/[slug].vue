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

const pageArticle = article.value

if (!pageArticle) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

usePageSeo({
  ...pageArticle.seo,
  path: `/${pageArticle.slug}/`,
  image: pageArticle.image,
  type: 'article',
  schemaName: pageArticle.title,
  schemaType: 'BlogPosting',
  datePublished: pageArticle.datePublished,
  dateModified: pageArticle.dateModified,
})
</script>

<template>
  <ArticleBody :article="pageArticle" />
  <NewsSection :content="relatedNews" />
</template>
