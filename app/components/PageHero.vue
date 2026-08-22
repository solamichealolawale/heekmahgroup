<script setup lang="ts">
import type { PageHeroContent } from '~/types/content'

defineProps<{
  content: PageHeroContent
}>()
</script>

<template>
  <section class="page-hero" :data-has-image="content.image ? 'true' : 'false'">
    <div class="shell page-hero-grid">
      <div class="page-hero-copy">
        <p class="eyebrow">{{ content.eyebrow }}</p>
        <h1>{{ content.title }}</h1>
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

        <dl v-if="content.facts?.length" class="page-hero-facts">
          <div v-for="fact in content.facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </div>

      <figure v-if="content.image" class="page-hero-media">
        <ResponsiveImage
          :asset="content.image"
          sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 960px) min(100vw - 80px, 780px), 620px"
          fetch-priority="high"
          loading="eager"
        />
        <figcaption v-if="content.imageCaption">{{ content.imageCaption }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  padding-block: clamp(52px, 6vw, 88px);
  background: radial-gradient(circle at 84% 12%, rgba(165, 110, 67, 0.1), transparent 30%), var(--rice-light);
}

.page-hero-grid {
  display: grid;
  min-height: min(690px, calc(100vh - 150px));
  align-items: center;
  grid-template-columns: minmax(0, 0.92fr) minmax(420px, 1.08fr);
  gap: clamp(50px, 8vw, 122px);
}

.page-hero[data-has-image='false'] .page-hero-grid {
  min-height: auto;
  grid-template-columns: minmax(0, 860px);
}

.page-hero-copy h1 {
  max-width: 14.5ch;
  margin-bottom: 28px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 5.3vw, 5.8rem);
  font-weight: 600;
  letter-spacing: -0.06em;
  line-height: 0.91;
}

.page-hero-summary {
  max-width: 58ch;
  margin-bottom: 32px;
  color: var(--ink-muted);
  font-size: clamp(1rem, 1.5vw, 1.22rem);
  line-height: 1.74;
}

.page-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.page-hero-facts {
  display: grid;
  max-width: 570px;
  padding-top: 36px;
  margin: 44px 0 0;
  border-top: 1px solid var(--line);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
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
  font-size: clamp(1.55rem, 2.4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.035em;
}

.page-hero-media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  margin: 0;
  overflow: hidden;
}

.page-hero-media::after {
  position: absolute;
  inset: 0;
  border: 1px solid var(--image-outline);
  content: '';
  pointer-events: none;
}

.page-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-hero-media figcaption {
  position: absolute;
  right: 18px;
  bottom: 18px;
  max-width: min(340px, calc(100% - 36px));
  padding: 12px 15px;
  background: rgba(23, 59, 39, 0.9);
  color: #fff;
  font-size: 0.76rem;
  font-weight: 750;
  letter-spacing: 0.025em;
  backdrop-filter: blur(10px);
}

@media (max-width: 960px) {
  .page-hero-grid {
    min-height: auto;
    grid-template-columns: 1fr;
  }

  .page-hero-copy {
    max-width: 780px;
  }

  .page-hero-media {
    max-width: 780px;
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 560px) {
  .page-hero-copy h1 {
    font-size: clamp(3rem, 15vw, 4.7rem);
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
  }

  .page-hero-media {
    aspect-ratio: 4 / 3;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .page-hero-media figcaption {
    background: var(--brand-solid);
    backdrop-filter: none;
  }
}
</style>
