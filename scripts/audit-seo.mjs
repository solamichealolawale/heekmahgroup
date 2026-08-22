import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const siteUrl = 'https://heekmahgroup.com'
const requiredPageRoutes = [
  '/',
  '/about-us/',
  '/heekmah-rice/',
  '/heekmah-integral-services/',
  '/blog/',
  '/contact-us/',
  '/terms-conditon/',
  '/refund_returns/',
]

function decodeAttribute(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

function attributes(tag) {
  const result = {}

  for (const match of tag.matchAll(/([:\w-]+)(?:="([^"]*)")?/g)) {
    result[match[1]] = decodeAttribute(match[2] ?? '')
  }

  return result
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const sitemap = await readFile(resolve('.output/public/sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
const routes = sitemapUrls.map((url) => new URL(url).pathname)
const articleRoutes = new Set(routes.filter((route) => !requiredPageRoutes.includes(route)))

assert(new Set(sitemapUrls).size === sitemapUrls.length, 'Sitemap contains duplicate URLs')
assert(
  requiredPageRoutes.every((route) => routes.includes(route)),
  'Sitemap is missing one or more required public page routes',
)
assert(articleRoutes.size > 0, 'Sitemap must contain at least one WordPress article route')
assert(
  sitemapUrls.every((url) => url.startsWith(`${siteUrl}/`) && new URL(url).pathname.endsWith('/')),
  'Sitemap contains a non-canonical hostname or a route without a trailing slash',
)

for (const route of routes) {
  const outputPath = route === '/' ? 'index.html' : `${route.slice(1)}index.html`
  const html = await readFile(resolve('.output/public', outputPath), 'utf8')
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? ''
  const title = head.match(/<title>([\s\S]*?)<\/title>/g) ?? []
  const metas = [...head.matchAll(/<meta\s[^>]*>/g)].map(([tag]) => attributes(tag))
  const links = [...head.matchAll(/<link\s[^>]*>/g)].map(([tag]) => attributes(tag))
  const canonical = links.filter((link) => link.rel === 'canonical')
  const description = metas.filter((meta) => meta.name === 'description')
  const robots = metas.filter((meta) => meta.name === 'robots')
  const ogUrl = metas.filter((meta) => meta.property === 'og:url')
  const ogType = metas.filter((meta) => meta.property === 'og:type')
  const expectedCanonical = `${siteUrl}${route}`
  const jsonLd = [...head.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
    (match) => JSON.parse(match[1]),
  )
  const flattenedSchema = jsonLd.flatMap((item) => (Array.isArray(item['@graph']) ? item['@graph'] : [item]))
  const pageSchema = flattenedSchema.find((item) => item.url === expectedCanonical)
  const h1 = html.match(/<h1(?:\s[^>]*)?>/g) ?? []

  assert(title.length === 1 && title[0] !== '<title></title>', `${route}: expected one non-empty title`)
  assert(description.length === 1 && description[0].content, `${route}: expected one description`)
  assert(robots.length === 1 && robots[0].content.includes('index, follow'), `${route}: expected indexable robots`)
  assert(canonical.length === 1 && canonical[0].href === expectedCanonical, `${route}: canonical mismatch`)
  assert(ogUrl.length === 1 && ogUrl[0].content === expectedCanonical, `${route}: Open Graph URL mismatch`)
  assert(ogType.length === 1, `${route}: expected one Open Graph type`)
  assert(h1.length === 1, `${route}: expected one H1`)
  assert(jsonLd.length === 2, `${route}: expected site and page JSON-LD blocks`)
  assert(
    flattenedSchema.some((item) => item['@type'] === 'Organization'),
    `${route}: missing Organization schema`,
  )
  assert(
    flattenedSchema.some((item) => item['@type'] === 'WebSite'),
    `${route}: missing WebSite schema`,
  )
  assert(pageSchema, `${route}: missing canonical page schema`)

  if (articleRoutes.has(route)) {
    assert(ogType[0].content === 'article', `${route}: expected article Open Graph type`)
    assert(pageSchema['@type'] === 'BlogPosting', `${route}: expected BlogPosting schema`)
    assert(/^\d{4}-\d{2}-\d{2}/.test(pageSchema.datePublished), `${route}: missing publication date`)
    assert(pageSchema.headline, `${route}: missing article headline`)
  } else {
    assert(ogType[0].content === 'website', `${route}: expected website Open Graph type`)
  }
}

const expectedUrls = routes.map((route) => `${siteUrl}${route}`)
assert(
  JSON.stringify(sitemapUrls.toSorted()) === JSON.stringify(expectedUrls.toSorted()),
  'Sitemap URLs do not match the canonical route set',
)

const robotsFile = await readFile(resolve('public/robots.txt'), 'utf8')
assert(robotsFile.includes(`Sitemap: ${siteUrl}/sitemap.xml`), 'robots.txt does not reference the canonical sitemap')

console.info(`SEO audit passed for ${routes.length} generated routes.`)
