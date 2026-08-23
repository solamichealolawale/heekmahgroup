<script setup lang="ts">
import type { PartnershipContent } from '~/types/content'

defineProps<{
  content: PartnershipContent
}>()
</script>

<template>
  <section class="partnership-section">
    <div class="partnership-image">
      <ResponsiveImage :asset="content.image" sizes="(max-width: 860px) 100vw, 55vw" />
    </div>
    <div class="partnership-copy">
      <p class="eyebrow">{{ content.eyebrow }}</p>
      <h2>{{ content.title }}</h2>
      <p>{{ content.body }}</p>
      <div class="partnership-actions">
        <NuxtLink
          class="button-link"
          :to="content.action.to"
          data-cta-location="partnership"
          data-cta-intent="partnership"
        >
          {{ content.action.label }}
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M3 8.5h10M9 4.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </NuxtLink>
        <NuxtLink
          class="button-link secondary"
          :to="content.secondaryAction.to"
          data-cta-location="partnership"
          data-cta-intent="phone-call"
        >
          {{ content.secondaryAction.label }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.partnership-section {
  display: grid;
  background: var(--rice-surface);
  grid-template-columns: minmax(0, 1fr) minmax(380px, 0.85fr);
}

.partnership-image {
  min-height: 620px;
  overflow: hidden;
}

.partnership-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.partnership-copy {
  display: flex;
  padding: clamp(64px, 9vw, 132px) clamp(36px, 8vw, 118px);
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
}

.partnership-copy h2 {
  max-width: 11ch;
  margin-bottom: 26px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(2.7rem, 5vw, 5.4rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.95;
}

.partnership-copy > p:not(.eyebrow) {
  max-width: 47ch;
  margin-bottom: 30px;
  color: var(--ink-muted);
  font-size: 1.05rem;
  line-height: 1.75;
}

.partnership-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 520px) {
  .partnership-actions {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }

  .partnership-actions .button-link {
    width: 100%;
  }
}

@media (max-width: 860px) {
  .partnership-section {
    grid-template-columns: 1fr;
  }

  .partnership-image {
    min-height: auto;
    aspect-ratio: 16 / 10;
  }
}
</style>
