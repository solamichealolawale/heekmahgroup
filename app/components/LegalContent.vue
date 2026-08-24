<script setup lang="ts">
import type { LegalPageContent } from '~/types/content'

defineProps<{
  content: LegalPageContent
}>()
</script>

<template>
  <article class="legal-page">
    <header class="legal-header">
      <div class="shell legal-header-inner">
        <p class="eyebrow">{{ content.eyebrow }}</p>
        <h1>{{ content.title }}</h1>
        <p>{{ content.introduction }}</p>
      </div>
    </header>

    <div class="shell legal-layout">
      <aside class="legal-notice" aria-label="Important information">
        <p>Important information</p>
        <span>{{ content.reviewNotice }}</span>
      </aside>

      <div class="legal-body">
        <section v-for="section in content.sections" :key="section.title">
          <h2>{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
          <ul v-if="section.items">
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ul>
        </section>

        <div class="legal-contact">
          <p>Need clarification?</p>
          <NuxtLink class="text-link" to="/contact-us/?interest=general-enquiry">Contact Heekmah Group</NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.legal-header {
  padding-block: clamp(76px, 10vw, 142px);
  background: var(--rice-light);
}

.legal-header-inner {
  max-width: 920px;
}

.legal-header h1 {
  max-width: 13ch;
  margin-bottom: 25px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 7vw, 7rem);
  font-weight: 600;
  letter-spacing: -0.058em;
  line-height: 0.94;
}

.legal-header p:last-child {
  max-width: 63ch;
  margin-bottom: 0;
  color: var(--ink-muted);
  font-size: clamp(1.02rem, 1.6vw, 1.22rem);
  line-height: 1.72;
}

.legal-layout {
  display: grid;
  padding-block: clamp(66px, 9vw, 120px);
  align-items: start;
  grid-template-columns: minmax(250px, 330px) minmax(0, 700px);
  justify-content: space-between;
  gap: clamp(50px, 8vw, 112px);
}

.legal-notice {
  position: sticky;
  top: 112px;
  padding: 25px;
  border-left: 3px solid var(--earth);
  background: var(--rice-light);
}

.legal-notice p {
  margin-bottom: 10px;
  color: var(--brand-deep);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.legal-notice span {
  color: var(--ink-muted);
  font-size: 0.9rem;
  line-height: 1.65;
}

.legal-body section {
  padding-bottom: 40px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--line);
}

.legal-body section:last-of-type {
  border-bottom: 0;
}

.legal-body h2 {
  margin-bottom: 18px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.2vw, 2.8rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.06;
}

.legal-body p,
.legal-body li {
  color: var(--ink-muted);
  font-size: 1.02rem;
  line-height: 1.78;
}

.legal-body p {
  margin-bottom: 18px;
}

.legal-body ul {
  display: grid;
  padding-left: 24px;
  gap: 10px;
}

.legal-body li::marker {
  color: var(--earth);
}

.legal-contact {
  padding: 26px;
  background: var(--surface);
  box-shadow: var(--shadow-border);
}

.legal-contact p {
  margin-bottom: 5px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
}

@media (max-width: 800px) {
  .legal-layout {
    grid-template-columns: 1fr;
  }

  .legal-notice {
    position: static;
    max-width: 620px;
  }
}
</style>
