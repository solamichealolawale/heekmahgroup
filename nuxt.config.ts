// https://nuxt.com/docs/api/configuration/nuxt-config
const cmsEnabled = process.env.NUXT_CMS_ENABLED === 'true'
const cmsStrict = process.env.NUXT_CMS_STRICT === 'true'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/image'],
  image: {
    format: ['webp'],
    quality: 82,
  },
  runtimeConfig: {
    cmsEnabled,
    cmsStrict,
    public: {
      cmsEnabled,
      siteUrl: 'https://heekmahgroup.com',
      wordpressUrl: 'https://heekmahgroup.com',
    },
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  routeRules: {
    '/': { prerender: true },
    '/about-us/': { prerender: true },
    '/heekmah-rice/': { prerender: true },
    '/heekmah-integral-services/': { prerender: true },
    '/heekmah-services/': {
      redirect: { to: '/heekmah-integral-services/', statusCode: 301 },
    },
    '/blog/': { prerender: true },
    '/contact-us/': { prerender: true },
    '/terms-conditon/': { prerender: true },
    '/refund_returns/': { prerender: true },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/about-us/',
        '/heekmah-rice/',
        '/heekmah-integral-services/',
        '/blog/',
        '/contact-us/',
        '/terms-conditon/',
        '/refund_returns/',
        '/_heekmah/article-routes.json',
        '/sitemap.xml',
      ],
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-NG' },
      meta: [
        { name: 'theme-color', content: '#fbf9f3' },
        { name: 'color-scheme', content: 'light dark' },
      ],
      script: [
        {
          innerHTML:
            "(()=>{try{const stored=localStorage.getItem('heekmah-theme');const theme=stored==='light'||stored==='dark'?stored:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=theme;document.querySelector('meta[name=\"theme-color\"]')?.setAttribute('content',theme==='dark'?'#101411':'#fbf9f3')}catch{}})()",
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/webp',
          href: '/media/heekmah-logo.webp',
        },
        { rel: 'preconnect', href: 'https://heekmahgroup.com' },
      ],
    },
  },
})
