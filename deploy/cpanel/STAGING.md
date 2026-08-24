# Staging retirement status

Last verified: 24 August 2026 (Africa/Lagos)

## Retired environment

- The `staging.heekmahgroup.com` domain was removed from the Heekmah cPanel account after the production cutover.
- Its document root, `/home/heekmnas/staging.heekmahgroup.com`, was moved to cPanel Trash rather than permanently erased.
- The Heekmah DNS zone contains no remaining `staging.heekmahgroup.com` records.
- The staging hostname no longer presents the former Nuxt staging site.

## Safety checks

- `https://heekmahgroup.com/` remained live after retirement and served the expected Nuxt homepage.
- The production document root and preserved rollback release were not changed.
- WordPress, email, and other cPanel domains and document roots were not changed.

## Recovery

The former staging files can be restored from cPanel Trash while that Trash entry is retained. Restoring the files alone will not recreate the deleted cPanel domain or DNS records.
