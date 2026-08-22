<script setup lang="ts">
import { siteContent } from '~/data/site'

const year = new Date().getFullYear()
const content = await useCmsContent('site', siteContent)
</script>

<template>
  <footer class="site-footer">
    <div class="shell footer-grid">
      <div class="footer-intro">
        <NuxtLink class="footer-brand" to="/" :aria-label="`${content.brandName} home`">
          <BrandMark class="footer-brand-mark" :src="content.logo.src" />
          <span>{{ content.brandName }}</span>
        </NuxtLink>
        <p>{{ content.tagline }}</p>
      </div>

      <nav class="footer-nav" aria-label="Footer navigation">
        <p class="footer-label">{{ content.exploreLabel }}</p>
        <NuxtLink v-for="item in content.navigation" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <address class="footer-contact">
        <p class="footer-label">{{ content.contactLabel }}</p>
        <a :href="`mailto:${content.contact.email}`">{{ content.contact.email }}</a>
        <a :href="`tel:${content.contact.phoneHref}`">{{ content.contact.phoneLabel }}</a>
        <p>
          <template v-for="line in content.contact.addressLines" :key="line"> {{ line }}<br /> </template>
        </p>
      </address>
    </div>

    <div class="shell footer-bottom">
      <p>© {{ year }} {{ content.brandName }}</p>
      <div>
        <NuxtLink v-for="item in content.legalLinks" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 76px 0 28px;
  background: var(--brand-solid);
  color: rgba(255, 255, 255, 0.74);
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(150px, 0.6fr) minmax(240px, 0.8fr);
  gap: clamp(40px, 7vw, 110px);
}

.footer-intro {
  max-width: 460px;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--on-brand);
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 700;
  text-decoration: none;
}

.footer-brand-mark {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.footer-intro p {
  max-width: 42ch;
  margin: 22px 0 0;
  line-height: 1.7;
}

.footer-label {
  margin: 0 0 18px;
  color: var(--rice);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.footer-nav,
.footer-contact {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  font-style: normal;
}

.footer-nav a,
.footer-contact a,
.footer-bottom a {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  transition-property: color;
  transition-duration: 160ms;
  transition-timing-function: var(--ease-out);
}

.footer-nav a:hover,
.footer-contact a:hover,
.footer-bottom a:hover {
  color: var(--on-brand);
}

.footer-contact p:last-child {
  margin: 14px 0 0;
  line-height: 1.65;
}

.footer-bottom {
  display: flex;
  padding-top: 26px;
  margin-top: 62px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  font-size: 0.84rem;
}

.footer-bottom p {
  margin: 0;
}

.footer-bottom div {
  display: flex;
  gap: 24px;
}

@media (max-width: 800px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-intro {
    grid-column: 1 / -1;
  }
}

@media (max-width: 540px) {
  .site-footer {
    padding-top: 58px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-intro {
    grid-column: auto;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
