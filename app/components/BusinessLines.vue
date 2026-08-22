<script setup lang="ts">
import type { BusinessLinesContent } from '~/types/content'

defineProps<{
  content: BusinessLinesContent
}>()
</script>

<template>
  <section id="companies" class="section business-section">
    <div class="shell">
      <div class="business-heading">
        <div>
          <p class="eyebrow">{{ content.eyebrow }}</p>
          <h2 class="section-heading">{{ content.title }}</h2>
        </div>
        <p class="section-lead">
          {{ content.summary }}
        </p>
      </div>

      <div class="business-list">
        <article v-for="(item, index) in content.items" :key="item.name" class="business-item">
          <figure>
            <ResponsiveImage
              :asset="item.image"
              sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 820px) min(100vw - 80px, 620px), 520px"
            />
          </figure>
          <div class="business-copy">
            <p class="business-number">0{{ index + 1 }} · {{ item.descriptor }}</p>
            <h3>{{ item.name }}</h3>
            <p>{{ item.summary }}</p>
            <NuxtLink class="text-link" :to="item.action.to">
              {{ item.action.label }}
              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M3 8.5h10M9 4.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" />
              </svg>
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.business-section {
  background: var(--brand-solid);
  color: var(--on-brand);
}

.business-heading {
  display: grid;
  margin-bottom: clamp(54px, 7vw, 90px);
  align-items: end;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.48fr);
  gap: 60px;
}

.business-heading .section-heading {
  color: var(--on-brand);
}

.business-heading .section-lead {
  color: rgba(255, 255, 255, 0.7);
}

.business-list {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.business-item {
  display: grid;
  padding-block: clamp(42px, 6vw, 78px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  align-items: center;
  grid-template-columns: minmax(300px, 0.82fr) minmax(0, 1fr);
  gap: clamp(42px, 8vw, 118px);
}

.business-item:nth-child(even) figure {
  order: 2;
}

.business-item figure {
  aspect-ratio: var(--card-media-ratio);
  margin: 0;
  overflow: hidden;
}

.business-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  outline-color: rgba(255, 255, 255, 0.1);
}

.business-copy {
  max-width: 520px;
}

.business-number {
  margin-bottom: 22px;
  color: var(--rice);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.business-copy h3 {
  max-width: 15ch;
  margin-bottom: 22px;
  color: var(--on-brand);
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 4vw, 4.2rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1;
}

.business-copy > p:not(.business-number) {
  max-width: 48ch;
  margin-bottom: 26px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.75;
}

.business-copy .text-link {
  color: var(--rice);
}

@media (max-width: 820px) {
  .business-heading,
  .business-item {
    grid-template-columns: 1fr;
  }

  .business-heading {
    gap: 28px;
  }

  .business-heading .section-lead {
    max-width: 56ch;
  }

  .business-item:nth-child(even) figure {
    order: 0;
  }

  .business-item figure {
    width: min(100%, 620px);
  }
}
</style>
