# cPanel deployment runbook

## Target layout

WordPress stays in `public_html` and continues to own `/wp-admin`, `/wp-json` and `/wp-content/uploads`. The generated Nuxt files live in a separate internal release directory:

```text
public_html/
├── index.php                  # existing WordPress
├── wp-admin/                  # existing WordPress
├── wp-content/                # existing WordPress and media
├── nuxt-app/
│   ├── current/               # active Nuxt static release
│   └── previous/              # rollback copy
└── .htaccess                  # path split in live.htaccess
```

The public browser still sees normal URLs such as `/about-us/` and `/_nuxt/...`. Apache maps those requests internally to `nuxt-app/current`; WordPress admin, REST and uploads remain at their existing paths on the same domain. Because the CMS and public site share the origin, no CORS layer is required.

## First deployment: staging

1. Renew and verify the domain TLS certificate first. The current certificate was expired during development; valid HTTPS is required for the CMS build and for browsers to load WordPress media.
2. In cPanel, create a subdomain such as `staging.heekmahgroup.com` with a document root outside the live WordPress root, for example `public_html/nuxt-staging`.
3. Protect the subdomain with cPanel Directory Privacy if available.
4. Upload the contents of the generated Nuxt release ZIP into the staging document root. The root must contain `index.html`, `_nuxt`, `about-us`, and the other generated files directly.
5. Upload `staging.htaccess` and rename it to `.htaccess`.
6. Verify all routes, light and dark themes, navigation, images, the enquiry fallback, and the WordPress media URLs. The staging rules add `noindex` headers.
7. Inspect the response headers and confirm the staging hostname remains `noindex`, even though the generated production metadata is present in the HTML.

Creating the subdomain, changing DNS, installing plugins and changing live routing are external mutations. Perform them only after explicit approval and take a cPanel backup first.

## WordPress CMS activation

1. Upload `heekmah-content.zip` in WordPress Plugins and activate it.
2. Open **Heekmah Content** in the WordPress admin. The plugin seeds the approved structured content without altering existing pages, Elementor or the active theme.
3. Confirm `https://heekmahgroup.com/wp-json/heekmah/v1/content/home` returns JSON.
4. Confirm `https://heekmahgroup.com/wp-json/wp/v2/posts?status=publish` returns the native published posts. Assign a Featured Image to each post so listing and article covers use WordPress-generated responsive candidates; the existing three posts currently use reviewed fallback covers because no Featured Image is assigned.
5. Confirm a media object in the structured response includes `attachmentId` and `srcSet`. This is the responsive-image contract used by the static frontend.
6. Upload and activate `heekmah-enquiries.zip` when email delivery is ready to test.
7. Generate production with `NUXT_CMS_ENABLED=true`. The build fetches every published post, discovers each article route and writes those URLs into the Nuxt sitemap. If WordPress is unavailable during a build, Nuxt logs the failure and uses the bundled reviewed content.

## Live cutover

1. Download a full cPanel backup and save the existing `public_html/.htaccess` separately.
2. Upload and extract the new release as `public_html/nuxt-app/next`.
3. Rename the existing `current` directory to `previous`, then rename `next` to `current`. On the first release, create `current` directly.
4. Upload `live.htaccess` as `public_html/.htaccess` only after checking its contents against any hosting-specific rules in the existing file. Preserve host-managed PHP and SSL directives outside the rewrite block.
5. Test `/`, every navigation route, one article, `/wp-admin/`, the structured-content REST endpoint, an upload URL, a deliberate 404, canonical tags and the enquiry form.
6. Confirm `http://heekmahgroup.com` reaches HTTPS, `www.heekmahgroup.com` redirects to the non-`www` host, extensionless route variants gain a trailing slash, and `/heekmah-services/` redirects to `/heekmah-integral-services/`.
7. Confirm `/sitemap.xml` is public and `/wp-sitemap.xml` and `/sitemap_index.xml` redirect to it. Submit only `https://heekmahgroup.com/sitemap.xml` in Google Search Console.
8. Disable the WordPress maintenance page only after those checks pass.

## Rollback

1. Restore the saved `.htaccess` to return all public routes to WordPress; or
2. Rename `current` to `failed`, rename `previous` to `current`, and leave the Nuxt routing file in place.

Neither rollback deletes a release. Keep the last known-good directory until the new version has been stable and verified.

## Ongoing publishing

WordPress saves update the structured REST content immediately, but the public Nuxt HTML changes only after a new static build. The manual starting point is:

```bash
NUXT_CMS_ENABLED=true pnpm release:cpanel
```

The generated ZIP in `artifacts/cpanel` can be uploaded as `next`. A protected deployment webhook can automate this later, but it should use the same build, upload, verify and directory-swap sequence.

WordPress or plugin-generated SEO tags are harmless while they remain inside the unused WordPress theme response, but they must not be copied into the Nuxt head. Nuxt owns the public metadata and sitemap; WordPress owns the editable SEO content fields.
