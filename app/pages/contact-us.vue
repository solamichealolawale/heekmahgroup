<script setup lang="ts">
import { contactPageContent } from '~/data/contact'
import { siteContent } from '~/data/site'
import type { ContactPageContent, SiteContent } from '~/types/content'

const content = await useCmsContent<ContactPageContent>('contact', contactPageContent)
const site = await useCmsContent<SiteContent>('site', siteContent)

usePageSeo(() => ({
  ...content.value.seo,
  path: '/contact-us/',
  schemaName: content.value.hero.title,
  schemaType: 'ContactPage',
}))
</script>

<template>
  <section class="contact-hero">
    <div class="shell contact-hero-grid">
      <div class="contact-intro">
        <p class="eyebrow">{{ content.hero.eyebrow }}</p>
        <h1>{{ content.hero.title }}</h1>
        <p>{{ content.hero.summary }}</p>
      </div>

      <div class="direct-contact">
        <p class="direct-contact-title">{{ content.hero.directContactTitle }}</p>
        <a :href="`mailto:${site.contact.email}`">
          <span>Email</span>
          {{ site.contact.email }}
        </a>
        <a :href="`tel:${site.contact.phoneHref}`">
          <span>Call</span>
          {{ site.contact.phoneLabel }}
        </a>
      </div>
    </div>
  </section>

  <section class="contact-main">
    <div class="shell contact-layout">
      <ContactEnquiryForm :content="content.form" />

      <aside class="locations" aria-labelledby="locations-title">
        <p class="eyebrow">{{ content.locations.eyebrow }}</p>
        <h2 id="locations-title">{{ content.locations.title }}</h2>

        <div class="location-list">
          <address v-for="location in content.locations.items" :key="location.label">
            <p>{{ location.label }}</p>
            <span v-for="line in location.addressLines" :key="line">{{ line }}</span>
          </address>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.contact-hero {
  padding: clamp(76px, 10vw, 142px) 0 clamp(66px, 8vw, 108px);
  background: var(--rice-light);
}

.contact-hero-grid {
  display: grid;
  align-items: end;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: clamp(42px, 9vw, 138px);
}

.contact-intro {
  max-width: 790px;
}

.contact-intro h1 {
  max-width: 12ch;
  margin-bottom: 26px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(3.3rem, 7vw, 7rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.92;
}

.contact-intro > p:last-child {
  max-width: 59ch;
  margin-bottom: 0;
  color: var(--ink-muted);
  font-size: clamp(1rem, 1.6vw, 1.22rem);
  line-height: 1.75;
}

.direct-contact {
  padding: 26px;
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--shadow-border);
}

.direct-contact-title {
  margin-bottom: 16px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
}

.direct-contact a {
  min-height: 54px;
  display: flex;
  padding: 10px 0;
  border-top: 1px solid var(--line);
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  color: var(--brand-deep);
  font-weight: 720;
  overflow-wrap: anywhere;
  text-decoration: none;
  transition-property: color;
  transition-duration: 150ms;
  transition-timing-function: var(--ease-out);
}

.direct-contact a span {
  color: var(--ink-muted);
  font-size: 0.69rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.direct-contact a:hover {
  color: var(--earth);
}

.contact-main {
  padding-block: clamp(72px, 9vw, 128px);
}

.contact-layout {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(0, 1fr) minmax(250px, 0.33fr);
  gap: clamp(38px, 6vw, 84px);
}

.locations {
  position: sticky;
  top: 112px;
  padding-top: 24px;
}

.locations h2 {
  margin-bottom: 34px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.2vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
}

.location-list {
  display: grid;
  gap: 0;
}

.location-list address {
  padding: 24px 0;
  border-top: 1px solid var(--line);
  font-style: normal;
}

.location-list address:last-child {
  border-bottom: 1px solid var(--line);
}

.location-list p {
  margin-bottom: 8px;
  color: var(--brand-deep);
  font-weight: 800;
}

.location-list span {
  display: block;
  color: var(--ink-muted);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .contact-hero-grid,
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .direct-contact {
    max-width: 520px;
  }

  .locations {
    position: static;
    padding-top: 20px;
  }

  .location-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .location-list address,
  .location-list address:last-child {
    border-bottom: 1px solid var(--line);
  }
}

@media (max-width: 560px) {
  .contact-intro h1 {
    font-size: clamp(3rem, 16vw, 4.5rem);
  }

  .direct-contact {
    padding: 22px 20px;
  }

  .location-list {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
