<script setup lang="ts">
import { computed } from 'vue'

import type { PageHeroContent } from '~/types/content'

const props = defineProps<{
  content: PageHeroContent
}>()

const hasLongTitle = computed(() => props.content.title.length > 44)
</script>

<template>
  <section class="page-hero" :data-has-image="content.image ? 'true' : 'false'">
    <div class="page-hero-visual">
      <figure v-if="content.image" class="page-hero-media" aria-hidden="true">
        <ResponsiveImage
          :asset="content.image"
          sizes="100vw"
          nuxt-sizes="100vw"
          :max-width="1536"
          fetch-priority="high"
          loading="eager"
        />
      </figure>

      <div class="shell page-hero-content">
        <div class="page-hero-copy">
          <p class="eyebrow">{{ content.eyebrow }}</p>
          <h1 :class="{ 'is-long': hasLongTitle }">{{ content.title }}</h1>
          <p class="page-hero-summary">{{ content.summary }}</p>

          <div class="page-hero-actions">
            <NuxtLink
              class="button-link"
              :to="content.primaryAction.to"
              data-cta-location="page-hero"
              data-cta-intent="primary"
            >
              {{ content.primaryAction.label }}
            </NuxtLink>
            <NuxtLink v-if="content.secondaryAction" class="button-link secondary" :to="content.secondaryAction.to">
              {{ content.secondaryAction.label }}
            </NuxtLink>
          </div>
        </div>

        <p v-if="content.imageCaption && content.image" class="page-hero-caption">
          {{ content.imageCaption }}
        </p>
      </div>
    </div>

    <div v-if="content.facts?.length" class="page-hero-facts-wrap">
      <dl class="shell page-hero-facts">
        <div v-for="fact in content.facts" :key="fact.label">
          <dt>{{ fact.label }}</dt>
          <dd>{{ fact.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  background: var(--rice-light);
}

.page-hero-visual {
  position: relative;
  min-height: clamp(540px, 58vw, 660px);
  display: flex;
  overflow: hidden;
  isolation: isolate;
}

.page-hero[data-has-image='false'] .page-hero-visual {
  min-height: auto;
  background: radial-gradient(circle at 84% 12%, rgba(165, 110, 67, 0.1), transparent 30%), var(--rice-light);
}

.page-hero[data-has-image='false'] .page-hero-content {
  padding-block: clamp(72px, 9vw, 118px);
}

.page-hero[data-has-image='false'] .page-hero-copy h1 {
  color: var(--brand-deep);
}

.page-hero[data-has-image='false'] .page-hero-copy .eyebrow {
  color: var(--earth);
}

.page-hero[data-has-image='false'] .page-hero-summary {
  color: var(--ink-muted);
}

.page-hero[data-has-image='false'] .page-hero-actions .button-link {
  background: var(--brand-solid);
  color: var(--on-brand);
}

.page-hero[data-has-image='false'] .page-hero-actions .button-link:hover {
  background: var(--brand);
}

.page-hero[data-has-image='false'] .page-hero-actions .button-link.secondary {
  border-color: var(--brand-deep);
  background: transparent;
  color: var(--brand-deep);
  backdrop-filter: none;
}

.page-hero[data-has-image='false'] .page-hero-actions .button-link.secondary:hover {
  background: var(--brand-deep);
  color: var(--paper);
}

.page-hero-media {
  position: absolute;
  z-index: -2;
  inset: 0;
  margin: 0;
}

.page-hero-media::after {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(8, 28, 17, 0.94) 0%,
      rgba(8, 28, 17, 0.76) 43%,
      rgba(8, 28, 17, 0.28) 74%,
      rgba(8, 28, 17, 0.12) 100%
    ),
    linear-gradient(0deg, rgba(8, 22, 14, 0.58), transparent 52%);
  content: '';
}

.page-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-hero-content {
  display: flex;
  padding-block: clamp(76px, 9vw, 118px);
  align-items: flex-end;
  justify-content: space-between;
  gap: 48px;
}

.page-hero-copy {
  max-width: min(100%, 1040px);
}

.page-hero-copy h1 {
  max-width: 18ch;
  margin-bottom: 28px;
  color: var(--on-brand);
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 6.1vw, 6.6rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.92;
}

.page-hero-copy h1.is-long {
  max-width: 24ch;
  font-size: clamp(3.25rem, 5.35vw, 5.85rem);
}

.page-hero-copy .eyebrow {
  color: var(--rice);
}

.page-hero-summary {
  max-width: 56ch;
  margin-bottom: 32px;
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(1rem, 1.5vw, 1.22rem);
  line-height: 1.7;
}

.page-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.page-hero-actions .button-link {
  background: var(--on-brand);
  color: var(--brand-solid);
}

.page-hero-actions .button-link:hover {
  background: var(--rice);
}

.page-hero-actions .button-link.secondary {
  border-color: rgba(255, 255, 255, 0.76);
  background: rgba(8, 28, 17, 0.28);
  color: var(--on-brand);
  backdrop-filter: blur(12px);
}

.page-hero-actions .button-link.secondary:hover {
  border-color: var(--on-brand);
  background: var(--on-brand);
  color: var(--brand-solid);
}

.page-hero-caption {
  max-width: 28ch;
  margin: 0;
  align-self: flex-end;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.74rem;
  font-weight: 750;
  letter-spacing: 0.025em;
  line-height: 1.55;
  text-align: right;
}

.page-hero-facts-wrap {
  background: var(--rice-surface);
}

.page-hero-facts {
  display: grid;
  padding-block: 24px;
  margin-block: 0;
  grid-template-columns: repeat(2, minmax(0, 320px));
  gap: 18px clamp(38px, 7vw, 92px);
}

.page-hero-facts div {
  display: flex;
  flex-direction: column-reverse;
  gap: 7px;
}

.page-hero-facts dt {
  max-width: 24ch;
  color: var(--ink-muted);
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1.5;
}

.page-hero-facts dd {
  margin: 0;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 2.1vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.035em;
}

@media (max-width: 820px) {
  .page-hero-visual {
    min-height: 580px;
  }

  .page-hero-copy h1 {
    max-width: 16ch;
    font-size: clamp(3.2rem, 11vw, 5.2rem);
  }

  .page-hero-copy h1.is-long {
    max-width: 19ch;
    font-size: clamp(3.05rem, 10vw, 4.8rem);
  }

  .page-hero-content {
    padding-block: clamp(64px, 12vw, 92px);
    align-items: flex-end;
  }

  .page-hero-caption {
    display: none;
  }

  .page-hero-media::after {
    background:
      linear-gradient(90deg, rgba(8, 28, 17, 0.9) 0%, rgba(8, 28, 17, 0.58) 72%, rgba(8, 28, 17, 0.3) 100%),
      linear-gradient(0deg, rgba(8, 22, 14, 0.72), transparent 62%);
  }
}

@media (max-width: 560px) {
  .page-hero-visual {
    min-height: 540px;
  }

  .page-hero-copy h1,
  .page-hero-copy h1.is-long {
    max-width: 13ch;
    font-size: clamp(3rem, 14vw, 4.25rem);
  }

  .page-hero-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .page-hero-actions .button-link {
    width: 100%;
  }

  .page-hero-facts {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .page-hero-actions .button-link.secondary {
    background: rgba(8, 28, 17, 0.86);
    backdrop-filter: none;
  }
}
</style>
