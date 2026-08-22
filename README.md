# Heekmah Group website

Nuxt 4 rebuild of the Heekmah Group website. WordPress remains the content and media source; Nuxt owns the presentation, SEO markup and static output.

## Current scope

The full public route set is implemented: homepage, About, Heekmah Rice, Integral Services, Blog, WordPress-authored articles, Contact and the two inherited policy routes. Page-section content lives in typed reviewed fixtures under `app/data/` and is exported into the installable structured-content WordPress plugin.

The site preserves the current public URL structure and prerenders pages as static HTML. WordPress remains the content editor and media library without Elementor or the licensed theme being part of the frontend.

## Local development

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` when the public Nuxt site or WordPress API uses a different origin in a local, staging or production environment.

## Quality checks

```bash
pnpm exec nuxi typecheck
pnpm generate
```

Static output is written to `.output/public`.

## Enquiry delivery

The contact form posts to the WordPress endpoint at `NUXT_PUBLIC_WORDPRESS_URL`. The installable plugin source is in `wordpress/heekmah-enquiries/`; its readme covers installation, recipient configuration, mail delivery and privacy.

## Structured WordPress content

`wordpress/heekmah-content/` contains the site-specific CMS plugin. It seeds structured fields for every public page, uses the existing WordPress media library and exposes read-only page content at `/wp-json/heekmah/v1/content/{collection}`. Blog entries come from native WordPress Posts at `/wp-json/wp/v2/posts`, including categories, dates, excerpts, article HTML and featured media. Run `pnpm content:export` after changing the bundled page-content model.

## Image delivery

Local interface assets use the official Nuxt Image module and are processed by the static `ipxStatic` provider during `nuxt generate`; no Node image server is required on cPanel. CMS images use the attachment sizes WordPress already creates. The structured-content API returns each attachment ID and `srcSet`, while the Nuxt components provide layout-specific `sizes` and loading priority.

`app/data/wordpress-media.json` is a fallback snapshot for the reviewed bundled content. New media selected in WordPress does not need to be added to this file: the live CMS response derives its current candidates from the attachment metadata.

## SEO ownership

WordPress stores the editable page title, description and visible headings; native WordPress Posts own article titles, excerpts, bodies, categories, dates and featured media. Nuxt is the only public SEO renderer. It outputs the canonical URL, robots directive, Open Graph and Twitter metadata, plus conservative JSON-LD for the organisation, website, page and articles.

The canonical hostname is `https://heekmahgroup.com`, routes use trailing slashes, and the generated sitemap includes the static pages plus every post fetched during the build. `pnpm audit:seo` validates the generated HTML and sitemap after `pnpm generate`.

WordPress SEO plugins are not part of the public head after cutover because the WordPress theme no longer renders the public routes. The cPanel rules redirect legacy WordPress/SEO-plugin sitemap URLs to the Nuxt sitemap instead of exposing two competing sitemap sources.

## cPanel release

Run `NUXT_CMS_ENABLED=true pnpm release:cpanel` to create an uploadable static ZIP. See [deploy/cpanel/README.md](deploy/cpanel/README.md) for staging, same-domain WordPress routing, cutover and rollback.

## Content architecture

See [docs/content-model.md](docs/content-model.md) for the WordPress-to-Nuxt content contract and the editable section inventory.
