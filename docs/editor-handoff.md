# Heekmah website editor handoff

## Where to edit

Sign in to WordPress, then open **Heekmah Content**. Each tab controls one public area while Nuxt keeps typography, spacing, responsive behavior, dark mode and animation consistent.

- **Site settings:** logo, navigation, header action, footer contact details and legal links.
- **Home page:** SEO text, hero copy and four slider images, overview, companies, excellence, product range, testimonials, FAQs and the final next-step panel.
- **About, Heekmah Rice and Integral Services:** page hero and the ordered sections below it.
- **Contact page:** hero, visible form labels and locations. Enquiry type labels may be renamed, but their hidden system values are intentionally locked.
- **Blog page:** page hero, archive heading, final callout and the shared conversion panel beside article content.
- **Privacy, Terms and Refund policy:** introduction, important-information panel and ordered policy sections.

Use **Choose from media library** for images. Add accurate alternative text that describes what is visible. For large hero images, start with a sharp landscape original; WordPress supplies smaller responsive candidates and Nuxt chooses an appropriate size for the visitor’s screen.

## Homepage slider

Open **Heekmah Content → Home page → Hero → Slides**.

1. Choose an existing WordPress media-library image.
2. Write a short image-specific caption in **Slide title**. Keep it to roughly two to six words.
3. Write alternative text for the actual scene, not a slogan.
4. Reorder slides with the arrow controls. Four reviewed slides are the recommended set.
5. Save, allow up to 30 seconds, and refresh the public page.

The large introduction on the left explains Heekmah Group once; slider captions identify the scene and do not repeat the introduction.

## Pages and structured sections

Sections can be reordered, removed or added from their WordPress collection. The **Kind** and **ID** fields are hidden system fields: the editor keeps them valid automatically. Keep headings concise and split dense ideas into body copy. A good page order is:

1. Clear page promise in the hero.
2. What the business does and who it helps.
3. Evidence, capabilities, products or process.
4. A relevant next action near the end.

Save the collection, wait up to 30 seconds, then refresh. Existing public routes update without rebuilding. A release is still required when crawler-visible HTML or SEO metadata must update immediately.

## Blog posts

Blog entries use normal WordPress **Posts**, not the structured-content editor.

1. Edit the title, excerpt, category and Gutenberg body.
2. Set a **Featured Image** and its alternative text. This is the archive card and article cover.
3. Update or publish the post.

Changes to an existing published post appear in the browser after the short cache window without rebuilding. Publishing a new post, changing its slug, unpublishing it, or deleting it requires a new Nuxt release so the route and sitemap remain correct. A release is also needed when search engines and social previews must receive the new HTML before JavaScript runs.

## Enquiries and privacy

Accepted form submissions appear under **Enquiries** in WordPress before email is attempted. Check the **Email status** column when troubleshooting delivery. Limit access to administrators who need it, review stored enquiries regularly, and permanently delete records that are no longer needed for the conversation, relationship, records or a dispute.

Do not add or rename hidden enquiry values in code or the database. The visible labels are editable. The form distinguishes invalid information, rate limiting and a genuine service outage, and always provides the direct email or telephone fallback.

## SEO ownership

WordPress owns the editable SEO title and description fields. Nuxt is the only public renderer: it creates canonical URLs, Open Graph tags, structured data, robots rules and the sitemap. Do not add a second SEO implementation to the Nuxt output or expose the old WordPress theme as the public page.

## Publishing checklist

- Preview the edited page on a phone and desktop in both light and dark mode.
- Check that headings are concise, actions lead to the intended page and images match the surrounding copy.
- Confirm the first and last items do not have stray separator borders.
- For enquiries, verify a stored record and its email status after any mail configuration change.
- Run `pnpm release:cpanel` for new or removed blog routes, slug changes, sitemap changes, or crawler-ready SEO updates.
