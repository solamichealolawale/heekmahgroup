import { articles as fallbackArticles } from '~/data/articles'
import { getWordPressArticles } from '../../utils/wordpressPosts'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const articles = config.cmsEnabled
    ? await getWordPressArticles(config.public.wordpressUrl, true, !config.cmsStrict)
    : fallbackArticles

  setResponseHeader(event, 'content-type', 'application/json; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=0, must-revalidate')

  return {
    routes: articles.map((article) => `/${article.slug}/`),
  }
})
