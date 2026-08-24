import { getWordPressArticles } from '../../../utils/wordpressPosts'

export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig(event)
    const slug = getRouterParam(event, 'slug')
    const articles = await getWordPressArticles(config.public.wordpressUrl, config.cmsEnabled, !config.cmsStrict)
    const article = articles.find((item) => item.slug === slug)

    if (!article) {
      throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    }

    return article
  },
  {
    maxAge: 60,
    name: 'wordpress-post',
  },
)
