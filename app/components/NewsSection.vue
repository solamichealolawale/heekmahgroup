<script setup lang="ts">
import type { NewsContent } from '~/types/content'

defineProps<{
  content: NewsContent
}>()
</script>

<template>
  <section class="section news-section">
    <div class="shell">
      <div class="news-heading">
        <div>
          <p class="eyebrow">{{ content.eyebrow }}</p>
          <h2 class="section-heading">{{ content.title }}</h2>
        </div>
        <NuxtLink class="text-link" :to="content.action.to">
          {{ content.action.label }}
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M3 8.5h10M9 4.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </NuxtLink>
      </div>

      <div class="article-grid">
        <article v-for="item in content.items" :key="item.to">
          <NuxtLink class="article-image" :to="item.to" :aria-label="`Read ${item.title}`">
            <ResponsiveImage
              :asset="item.image"
              sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 860px) calc(50vw - 36px), 410px"
            />
          </NuxtLink>
          <div class="article-meta">
            <span>{{ item.category }}</span>
            <time :datetime="item.dateTime">{{ item.date }}</time>
          </div>
          <h3>
            <NuxtLink :to="item.to">{{ item.title }}</NuxtLink>
          </h3>
          <p>{{ item.excerpt }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.news-section {
  background: var(--surface);
}

.news-heading {
  display: flex;
  margin-bottom: clamp(48px, 6vw, 76px);
  align-items: end;
  justify-content: space-between;
  gap: 36px;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 34px;
}

.article-image {
  display: block;
  aspect-ratio: var(--card-media-ratio);
  margin-bottom: 22px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition-property: transform;
  transition-duration: 340ms;
  transition-timing-function: var(--ease-out);
}

.article-image:hover img {
  transform: scale(1.025);
}

.article-meta {
  display: flex;
  margin-bottom: 13px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--ink-muted);
  font-size: 0.74rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.article-meta span {
  color: var(--earth);
}

.article-grid h3 {
  margin-bottom: 14px;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.article-grid h3 a {
  color: var(--brand-deep);
  text-decoration: none;
}

.article-grid h3 a:hover {
  text-decoration: underline;
  text-decoration-color: var(--earth);
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.article-grid article > p {
  margin-bottom: 0;
  color: var(--ink-muted);
  line-height: 1.65;
}

@media (max-width: 860px) {
  .article-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .news-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .article-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

@media (hover: none) {
  .article-image:hover img {
    transform: none;
  }
}
</style>
