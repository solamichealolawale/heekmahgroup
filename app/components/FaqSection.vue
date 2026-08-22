<script setup lang="ts">
import type { FaqContent } from '~/types/content'

defineProps<{
  content: FaqContent
}>()
</script>

<template>
  <section class="section faq-section">
    <div class="shell faq-grid">
      <div>
        <p class="eyebrow">{{ content.eyebrow }}</p>
        <h2 class="section-heading">{{ content.title }}</h2>
      </div>

      <div class="faq-list">
        <details v-for="(item, index) in content.items" :key="item.question" :open="index === 0">
          <summary>
            <span>{{ item.question }}</span>
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 19 19" fill="none">
              <path d="M9.5 3v13M3 9.5h13" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-section {
  background: var(--paper);
}

.faq-grid {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1fr);
  gap: clamp(56px, 10vw, 150px);
}

.faq-list {
  border-top: 1px solid var(--line);
}

details {
  padding: 0;
  border-bottom: 1px solid var(--line);
}

summary {
  min-height: 92px;
  display: flex;
  padding: 22px 0;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: var(--brand-deep);
  cursor: pointer;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2vw, 1.7rem);
  font-weight: 600;
  line-height: 1.25;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

summary svg {
  flex: 0 0 auto;
  transition-property: transform;
  transition-duration: 180ms;
  transition-timing-function: var(--ease-out);
}

details[open] summary svg {
  transform: rotate(45deg);
}

details p {
  max-width: 62ch;
  padding: 0 58px 30px 0;
  margin: 0;
  color: var(--ink-muted);
  line-height: 1.75;
}

@media (max-width: 760px) {
  .faq-grid {
    grid-template-columns: 1fr;
  }
}
</style>
