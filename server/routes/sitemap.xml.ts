import { getWordPressArticles } from '../utils/wordpressPosts'

const pagePaths = [
  '/',
  '/about-us/',
  '/heekmah-rice/',
  '/heekmah-integral-services/',
  '/blog/',
  '/contact-us/',
  '/terms-conditon/',
  '/refund_returns/',
] as const

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Readonly<Record<string, string>> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    }
    return entities[character] ?? character
  })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const articles = await getWordPressArticles(config.public.wordpressUrl, config.cmsEnabled)
  const pageEntries = pagePaths.map((path) => `<url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`)
  const articleEntries = articles.map(
    (article) =>
      `<url><loc>${escapeXml(`${siteUrl}/${article.slug}/`)}</loc><lastmod>${escapeXml(article.dateModified ?? article.datePublished)}</lastmod></url>`,
  )

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=300, stale-while-revalidate=3600')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...pageEntries,
    ...articleEntries,
  ].join('\n')}\n</urlset>\n`
})
