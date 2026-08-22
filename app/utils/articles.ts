import type { ArticleContent, ArticleSummary, NewsContent } from '~/types/content'

export function toArticleSummary(article: ArticleContent): ArticleSummary {
  return {
    title: article.title,
    excerpt: article.summary,
    date: article.date,
    dateTime: article.datePublished,
    category: article.category,
    to: `/${article.slug}/`,
    image: article.image,
  }
}

export function withArticleSummaries(
  content: NewsContent,
  articles: readonly ArticleSummary[],
  limit?: number,
): NewsContent {
  const visibleArticles = typeof limit === 'number' ? articles.slice(0, limit) : articles

  return {
    ...content,
    items: visibleArticles,
  }
}
