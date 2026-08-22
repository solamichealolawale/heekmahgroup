import { getWordPressArticles } from '../../utils/wordpressPosts'
import { toArticleSummary } from '~/utils/articles'

export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig(event)
    const articles = await getWordPressArticles(config.public.wordpressUrl, config.cmsEnabled)
    return articles.map(toArticleSummary)
  },
  {
    maxAge: 60,
    name: 'wordpress-posts',
  },
)
