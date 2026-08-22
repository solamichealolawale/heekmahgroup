=== Heekmah Enquiries ===
Contributors: heekmahgroup
Tags: enquiries, rest-api, contact-form
Requires at least: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0

Receives enquiries from the Nuxt website, stores them privately in WordPress, and emails the responsible team.

== Installation ==

1. In WordPress, open Plugins > Add New > Upload Plugin.
2. Upload heekmah-enquiries.zip and activate it.
3. Confirm that an Enquiries item appears in the WordPress admin menu.
4. Send one non-production test from the Nuxt contact page and verify both the stored record and email delivery.

== Configuration ==

By default, email is sent to the WordPress Administration Email Address. To use a dedicated inbox, add this to wp-config.php above the "stop editing" line:

define( 'HEEKMAH_ENQUIRY_RECIPIENT', 'info@heekmahgroup.com' );

The Nuxt frontend reads NUXT_PUBLIC_WORDPRESS_URL and posts to:

/wp-json/heekmah/v1/enquiries

If Nuxt and WordPress are served from different origins, allow the public Nuxt origin in any security, proxy, or CORS plugin that restricts WordPress REST requests.

== Submission fields ==

Required: name, email, interest, message, consent.

Optional: phone, organisation, source. The website field is a hidden spam trap and must be left empty by people.

== Protection and delivery ==

The endpoint sanitizes and validates every field, rejects unknown enquiry types, uses a honeypot, and limits one IP hash to five valid attempts per ten minutes. Raw IP addresses are not stored.

Every accepted enquiry is stored as a private WordPress Enquiry before email is attempted. If wp_mail fails, the record remains available in WordPress and its Email status is marked failed. A configured transactional mail service is recommended for dependable delivery.

== Privacy ==

Enquiries contain personal data. Limit WordPress administrator access, state the purpose in the public privacy notice, and define an appropriate retention/deletion process. Deactivating or uninstalling this plugin does not automatically delete enquiry records.
