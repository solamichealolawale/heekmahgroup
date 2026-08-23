# Staging deployment status

Last verified: 23 August 2026 (Africa/Lagos)

## Environment

- URL: `https://staging.heekmahgroup.com/`
- cPanel document root: the staging subdomain document root shown in cPanel
- Deployed release: `artifacts/cpanel/heekmah-nuxt-20260822T210629Z.zip`
- Pre-change cPanel backup: retained in the account backup area
- The live WordPress document root was not changed.

## Verified behavior

- The staging hostname has a valid Namecheap StandardSSL certificate and HTTP redirects to HTTPS.
- Every HTTPS response includes `X-Robots-Tag: noindex, nofollow, noarchive`.
- HTML and JSON revalidate on every request; generated CSS, JavaScript, fonts and images use one-year immutable caching.
- The homepage, generated routes, canonical trailing-slash redirects and generated 404 page return the expected status codes.
- Desktop and mobile navigation, the services disclosure, dark mode and the enquiry select were browser-smoke-tested.
- The enquiry select handles a query-selected value, pointer selection and an unknown persisted value without exposing the unknown value.
- The staging canonical URL points to the production hostname; Nuxt owns public SEO metadata and WordPress owns the editable SEO fields.
- The native WordPress Posts refresh was verified by editing an existing post title and observing the staging page update after a normal refresh without rebuilding.
- The structured-content and enquiries plugins are active, and a non-delivering honeypot probe confirmed the enquiry REST route and staging CORS contract without sending email or storing an enquiry.

## Required before production cutover

- Upload the final network-enabled production artifact and repeat the route, media, form, metadata and console smoke checks.
- Take a fresh cPanel backup and preserve the current live `.htaccess` before changing routing.
- Exercise one reversible structured-section edit end to end, then restore it, to record the same no-rebuild proof already established for native posts.

## Rollback

No live routing was changed. The staging release can be replaced independently, and the full cPanel backup above contains the pre-deployment account state. Keep that backup until the live cutover is complete and stable.
