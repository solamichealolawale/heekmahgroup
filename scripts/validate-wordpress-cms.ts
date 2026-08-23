import { contactPageContent } from '../app/data/contact'
import { homePageContent } from '../app/data/home'
import {
  aboutPageContent,
  blogPageContent,
  refundPageContent,
  ricePageContent,
  servicesPageContent,
  termsPageContent,
} from '../app/data/pages'
import { siteContent } from '../app/data/site'
import { contentShapeMismatch } from '../app/utils/contentShape'
import { parseWordPressPageCount, parseWordPressPostArray } from '../app/utils/wordpressPostValidation'

const wordpressUrl = (process.env.NUXT_PUBLIC_WORDPRESS_URL || 'https://heekmahgroup.com').replace(/\/$/, '')
const refresh = Date.now()
const collections = {
  site: siteContent,
  home: homePageContent,
  contact: contactPageContent,
  about: aboutPageContent,
  rice: ricePageContent,
  services: servicesPageContent,
  blog: blogPageContent,
  terms: termsPageContent,
  refunds: refundPageContent,
} as const

async function fetchRequired(url: URL, label: string): Promise<Response> {
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(12_000),
      })

      if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}.`)
      return response
    } catch (error) {
      lastError = error
    }
  }

  throw new Error(`Could not validate ${label}.`, { cause: lastError })
}

async function validateCollection(key: keyof typeof collections): Promise<void> {
  const url = new URL(`${wordpressUrl}/wp-json/heekmah/v1/content/${key}`)
  url.searchParams.set('heekmah_refresh', String(refresh))
  const response = await fetchRequired(url, `the ${key} collection`)
  const candidate: unknown = await response.json()
  const mismatch = contentShapeMismatch(candidate, collections[key])

  if (mismatch) throw new Error(`WordPress returned malformed ${key} content at ${mismatch}.`)
}

async function fetchPostPage(page: number) {
  const url = new URL(`${wordpressUrl}/wp-json/wp/v2/posts`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('per_page', '100')
  url.searchParams.set('status', 'publish')
  url.searchParams.set('order', 'desc')
  url.searchParams.set('orderby', 'date')
  url.searchParams.set('heekmah_refresh', String(refresh))
  url.searchParams.set('_embed', 'wp:featuredmedia,wp:term')
  url.searchParams.set(
    '_fields',
    'id,slug,date,modified,title,excerpt,content,featured_media,categories,_links,_embedded',
  )

  const response = await fetchRequired(url, `WordPress Posts page ${page}`)
  const candidate: unknown = await response.json()

  return {
    pageCount: parseWordPressPageCount(response.headers.get('x-wp-totalpages')),
    posts: parseWordPressPostArray(candidate, true),
  }
}

await Promise.all((Object.keys(collections) as (keyof typeof collections)[]).map(validateCollection))

const firstPage = await fetchPostPage(1)
const pageCount = firstPage.pageCount
let postCount = firstPage.posts.length

for (let page = 2; page <= pageCount; page += 1) {
  postCount += (await fetchPostPage(page)).posts.length
}

console.info(`Validated ${Object.keys(collections).length} WordPress collections and ${postCount} published posts.`)
