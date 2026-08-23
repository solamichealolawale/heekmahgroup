# WordPress content model

## Architecture

WordPress remains the private editorial system and media library. Nuxt consumes structured REST data, renders the public pages, and prerenders static HTML for search visibility and fast delivery.

The site-specific **Heekmah Structured Content** plugin registers the page fields and exposes them through the native REST API. This avoids Elementor, theme shortcodes and a new paid field-builder dependency. Editors change content; the Nuxt components keep layout, typography and responsive behavior consistent.

Saving an existing structured collection or published post updates the browser-rendered site on the visitor's next refresh; no deployment is required for that visible content change. Regenerate the static release when a new public post route is added or when updated metadata, sitemap entries or crawler-visible source HTML must ship. A protected build webhook can automate those release-only cases later.

The structured API collections are `site`, `home`, `about`, `rice`, `services`, `contact`, `blog`, `terms` and `refunds`. Native WordPress Posts provide the blog entries. A static build enables WordPress fetching with `NUXT_CMS_ENABLED=true`; otherwise the reviewed bundled content is used.

With CMS fetching enabled, the prerendered page is refreshed from WordPress after hydration. Edits to an existing page collection or published post therefore appear to visitors after a browser refresh without a new deployment. Regenerate the static site for a new post slug, updated sitemap and updated crawler/social-preview HTML.

## Media contract

Choosing an image stores its WordPress attachment ID, URL, alternative text and intrinsic dimensions. The REST response derives `srcSet` from current WordPress attachment metadata rather than saving generated filenames into editable content. Nuxt supplies a `sizes` value for each layout, preserves dimensions to prevent layout shift, eagerly prioritises only principal hero images, and lazy-loads later media.

Local interface assets such as the logo are handled by Nuxt Image and pre-generated during the static build. WordPress media uses WordPress’s existing WebP derivatives so cPanel does not need a runtime image transformer. The bundled content also has a checked-in media-variant snapshot for safe fallback builds.

## SEO contract

WordPress is the editorial source for page titles, meta descriptions, hero/social images and article dates. Canonical paths, indexing rules and schema types are controlled by Nuxt so an editor cannot accidentally create a second URL or deindex a public section.

Every generated page receives one canonical, one title and description, Open Graph and Twitter metadata, and page-level JSON-LD linked to the global `Organization` and `WebSite` identities. Articles use `BlogPosting` with their visible headline, relevant image, publication date, modification date and Heekmah Group as author and publisher. Product, review, rating, price and FAQ rich-result markup is deliberately omitted until the visible content contains the required verifiable information.

Only `https://heekmahgroup.com` URLs with their canonical trailing slash appear in the Nuxt sitemap. Old WordPress sitemaps and the `www` hostname are redirected at the cPanel layer. Run `pnpm audit:seo` after each production generation.

## Homepage fields

| Section      | Editable fields                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| SEO          | Page title, meta description, social image                                                               |
| Hero         | Eyebrow, heading, summary, two actions, highlights, two media assets, image caption                      |
| Start here   | Eyebrow, heading, ordered conversion options with label, copy, action and measurement intent             |
| Story        | Eyebrow, heading, body, action, media asset                                                              |
| Companies    | Eyebrow, heading, introduction, ordered company entries with descriptor, name, summary, action and media |
| Excellence   | Eyebrow, heading, introduction, ordered principles with number, title and body                           |
| Products     | Eyebrow, heading, archive action, ordered products with name, description, enquiry action and media      |
| Testimonials | Eyebrow, heading, ordered quotes with attribution and role                                               |
| FAQs         | Eyebrow, heading, ordered questions and answers                                                          |
| News         | Eyebrow, heading, archive action; article entries are queried from WordPress posts                       |
| Partnership  | Eyebrow, heading, body, primary and secondary actions, media asset                                       |

Global header, footer, contact details, navigation, editable services-menu label, header CTA, logo and legal links use a separate site-settings response. Nuxt groups the canonical Rice and Integral Services destinations beneath that label while preserving their WordPress-managed link labels. CTA links expose stable location and intent attributes so analytics can measure high-intent paths without coupling tracking code to the visual components.

## Contact page fields

| Section         | Editable fields                                                                             |
| --------------- | ------------------------------------------------------------------------------------------- |
| SEO             | Page title and meta description                                                             |
| Introduction    | Eyebrow, heading, summary and direct-contact prompt                                         |
| Enquiry form    | Eyebrow, heading, introduction, consent label, submit label and ordered enquiry-type labels |
| Contact details | Global email and phone from site settings                                                   |
| Locations       | Eyebrow, heading and ordered office/factory entries with label and multi-line address       |

The form posts JSON to `/wp-json/heekmah/v1/enquiries`. The site-specific `Heekmah Enquiries` plugin validates the shared enquiry-type contract, stores submissions as private WordPress records and attempts email delivery. The hidden honeypot, explicit consent and hashed-IP rate limit are functional safeguards rather than editor-controlled fields.

## Interior-page fields

About, Heekmah Rice and Integral Services share a structured section contract. Each page exposes SEO, a hero, ordered sections and conversion actions. Section types are intentionally limited to narrative, principles, offerings and callout so editors can reorder or update content without breaking the layout.

| Section type | Editable fields                                                              |
| ------------ | ---------------------------------------------------------------------------- |
| Hero         | Eyebrow, heading, summary, two actions, facts, media and caption             |
| Narrative    | Eyebrow, heading, ordered paragraphs, note, action, media and media position |
| Principles   | Eyebrow, heading, summary, colour tone and ordered principle cards           |
| Offerings    | Eyebrow, heading, summary, column count and ordered product/service cards    |
| Callout      | Eyebrow, heading, body, two conversion actions and optional media            |

Articles use native WordPress titles, excerpts, categories, dates, featured images and Gutenberg content. Nuxt sanitizes the rendered article HTML during generation, normalizes same-domain links and preserves responsive WordPress image candidates. Reviewed typed article fixtures remain only as an offline build fallback. Legal collections use ordered plain-language sections and carry a visible pre-launch review notice because the inherited WordPress policies were generic templates rather than approved Heekmah policy documents.

## URL contract

The rebuild keeps the current routes: `/`, `/about-us/`, `/heekmah-rice/`, `/heekmah-integral-services/`, `/blog/`, `/contact-us/`, `/terms-conditon/` and `/refund_returns/`. The legacy `/heekmah-services/` route will redirect permanently to `/heekmah-integral-services/` at cutover.
