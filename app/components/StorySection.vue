<script setup lang="ts">
import type { StoryContent } from '~/types/content'

defineProps<{
  content: StoryContent
}>()
</script>

<template>
  <section class="section story-section">
    <div class="shell story-grid">
      <figure class="story-image">
        <ResponsiveImage
          :asset="content.image"
          sizes="(max-width: 560px) calc(100vw - 56px), (max-width: 800px) min(92vw, 620px), 560px"
        />
      </figure>

      <div class="story-copy">
        <p class="eyebrow">{{ content.eyebrow }}</p>
        <h2 class="section-heading">{{ content.title }}</h2>
        <p class="section-lead">{{ content.body }}</p>
        <a class="text-link" :href="content.action.to">
          {{ content.action.label }}
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M3 8.5h10M9 4.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story-section {
  background: var(--rice-light);
}

.story-grid {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(360px, 0.92fr) minmax(0, 0.78fr);
  gap: clamp(52px, 9vw, 132px);
}

.story-image {
  position: relative;
  isolation: isolate;
  margin: 0;
}

.story-image::after {
  position: absolute;
  z-index: -1;
  right: -24px;
  bottom: -24px;
  width: 42%;
  height: 46%;
  background: var(--rice-surface);
  content: '';
}

.story-image img {
  width: 100%;
  aspect-ratio: 4 / 4.6;
  object-fit: cover;
}

.story-copy .section-heading {
  max-width: 12ch;
  margin-bottom: 30px;
}

.story-copy .section-lead {
  margin-bottom: 25px;
}

@media (max-width: 800px) {
  .story-grid {
    grid-template-columns: 1fr;
  }

  .story-image {
    width: min(92%, 620px);
  }

  .story-image img {
    aspect-ratio: 4 / 3;
  }
}
</style>
