=== Heekmah Structured Content ===
Contributors: heekmahgroup
Requires at least: 6.4
Requires PHP: 8.0
Stable tag: 1.5.0

Structured content fields and a read-only public REST API for the Heekmah Nuxt website.

The API exposes WordPress-generated responsive image candidates so the Nuxt frontend can request an appropriately sized WebP instead of a full-size upload.

Version 1.3 uses native WordPress Posts for the Nuxt blog and removes the old duplicate Articles editor from the Heekmah Content menu. Existing stored data is left untouched but is no longer used by the public site.

Version 1.5 restores the original per-slide homepage headings and descriptions as editable fields, and retires the former fifth slide.

== Installation ==

1. Upload and activate the plugin in WordPress.
2. Open Heekmah Content in the WordPress admin menu.
3. Review the seeded content and save any editorial changes.
4. Enable CMS fetching for the Nuxt build with NUXT_CMS_ENABLED=true.
5. Generate and deploy the Nuxt static site.

The plugin does not alter the active theme, Elementor pages or public routing.
