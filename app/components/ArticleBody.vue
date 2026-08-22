<script setup lang="ts">
import type { ArticleContent } from '~/types/content'

defineProps<{
  article: ArticleContent
}>()
</script>

<template>
  <article class="article-page">
    <header class="article-header">
      <div class="shell article-header-inner">
        <div class="article-meta">
          <span>{{ article.category }}</span>
          <time :datetime="article.datePublished">{{ article.date }}</time>
        </div>
        <h1>{{ article.title }}</h1>
        <p>{{ article.summary }}</p>
      </div>
    </header>

    <figure class="shell article-lead-image">
      <ResponsiveImage
        :asset="article.image"
        sizes="(max-width: 620px) 100vw, min(100vw - 80px, 1320px)"
        fetch-priority="high"
        loading="eager"
      />
    </figure>

    <div class="shell article-layout">
      <!-- WordPress HTML is sanitized on the Nitro server before it reaches this component. -->
      <div v-if="article.html" class="article-body wordpress-article-content" v-html="article.html" />

      <div v-else class="article-body">
        <template v-for="(block, index) in article.blocks" :key="`${block.kind}-${index}`">
          <p v-if="block.kind === 'paragraph'">{{ block.text }}</p>
          <h2 v-else-if="block.kind === 'heading'">{{ block.text }}</h2>
          <ul v-else-if="block.kind === 'list'">
            <li v-for="item in block.items" :key="item">{{ item }}</li>
          </ul>
          <aside v-else class="article-callout">
            <p>{{ block.title }}</p>
            <blockquote>{{ block.body }}</blockquote>
          </aside>
        </template>
      </div>

      <aside class="article-conversion">
        <p class="eyebrow">Continue the conversation</p>
        <h2>Have a related project or partnership in mind?</h2>
        <p>Tell us what you are working on and where Heekmah Group may be able to contribute.</p>
        <NuxtLink
          class="button-link"
          to="/contact-us/?interest=partnership"
          data-cta-location="article-sidebar"
          data-cta-intent="partnership"
        >
          Talk to our team
        </NuxtLink>
      </aside>
    </div>
  </article>
</template>

<style scoped>
.article-header {
  padding-block: clamp(76px, 10vw, 148px) clamp(58px, 7vw, 96px);
  background: var(--rice-light);
}

.article-header-inner {
  max-width: 1020px;
}

.article-meta {
  display: flex;
  margin-bottom: 24px;
  align-items: center;
  gap: 14px;
  color: var(--ink-muted);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.article-meta span {
  color: var(--earth);
}

.article-meta span::after {
  margin-left: 14px;
  color: var(--line);
  content: '·';
}

.article-header h1 {
  max-width: 16ch;
  margin-bottom: 28px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(3.15rem, 6.8vw, 7rem);
  font-weight: 600;
  letter-spacing: -0.06em;
  line-height: 0.93;
}

.article-header p {
  max-width: 66ch;
  margin-bottom: 0;
  color: var(--ink-muted);
  font-size: clamp(1.04rem, 1.7vw, 1.3rem);
  line-height: 1.72;
}

.article-lead-image {
  aspect-ratio: 16 / 8;
  margin-top: clamp(34px, 5vw, 72px);
  margin-bottom: 0;
  overflow: hidden;
}

.article-lead-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-layout {
  display: grid;
  padding-block: clamp(68px, 9vw, 128px);
  align-items: start;
  grid-template-columns: minmax(0, 720px) minmax(260px, 340px);
  justify-content: space-between;
  gap: clamp(52px, 8vw, 110px);
}

.article-body > p,
.article-body li,
.wordpress-article-content :deep(p),
.wordpress-article-content :deep(li) {
  color: var(--ink-muted);
  font-size: clamp(1.04rem, 1.4vw, 1.15rem);
  line-height: 1.82;
}

.article-body > p,
.wordpress-article-content :deep(p) {
  margin-bottom: 24px;
}

.article-body > p:first-child::first-letter,
.wordpress-article-content :deep(> p:first-child::first-letter) {
  float: left;
  padding: 7px 9px 0 0;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: 4.9rem;
  font-weight: 600;
  line-height: 0.68;
}

.article-body h2,
.wordpress-article-content :deep(h2),
.wordpress-article-content :deep(h3) {
  max-width: 21ch;
  margin: 58px 0 20px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.8vw, 3.35rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.02;
}

.wordpress-article-content :deep(h3) {
  margin-top: 42px;
  font-size: clamp(1.65rem, 3vw, 2.55rem);
}

.article-body ul,
.wordpress-article-content :deep(ul),
.wordpress-article-content :deep(ol) {
  display: grid;
  padding: 8px 0 8px 25px;
  margin: 0 0 28px;
  gap: 13px;
}

.article-body li::marker,
.wordpress-article-content :deep(li::marker) {
  color: var(--earth);
}

.wordpress-article-content :deep(a) {
  color: var(--brand-deep);
  font-weight: 700;
  text-decoration-color: color-mix(in srgb, var(--earth) 70%, transparent);
  text-decoration-thickness: 1.5px;
  text-underline-offset: 3px;
}

.wordpress-article-content :deep(a:hover) {
  color: var(--earth);
}

.wordpress-article-content :deep(figure) {
  width: 100%;
  margin: clamp(34px, 6vw, 64px) 0;
  background: var(--rice-light);
}

.wordpress-article-content :deep(figure img) {
  display: block;
  width: 100%;
  height: clamp(240px, 42vw, 450px);
  object-fit: cover;
}

.wordpress-article-content :deep(figcaption) {
  padding-top: 9px;
  color: var(--ink-muted);
  font-size: 0.8rem;
  line-height: 1.5;
}

.wordpress-article-content :deep(blockquote) {
  padding: 4px 0 4px 24px;
  margin: 42px 0;
  border-left: 3px solid var(--earth);
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.4vw, 2rem);
  line-height: 1.4;
}

.article-callout {
  padding: clamp(26px, 4vw, 42px);
  margin: 48px 0;
  background: var(--rice-light);
  box-shadow: var(--shadow-border);
}

.article-callout > p {
  margin-bottom: 14px;
  color: var(--earth);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.article-callout blockquote {
  margin: 0;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 2.6vw, 2.15rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.article-conversion {
  position: sticky;
  top: 112px;
  padding: 30px;
  background: var(--brand-solid);
  color: var(--on-brand);
}

.article-conversion .eyebrow {
  color: var(--rice);
}

.article-conversion h2 {
  margin-bottom: 16px;
  color: var(--on-brand);
  font-family: var(--font-display);
  font-size: clamp(1.65rem, 2.7vw, 2.35rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.08;
}

.article-conversion > p:not(.eyebrow) {
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.68;
}

.article-conversion .button-link {
  background: var(--on-brand);
  color: var(--brand-solid);
}

@media (max-width: 880px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-conversion {
    position: static;
    max-width: 620px;
  }
}

@media (max-width: 620px) {
  .article-header h1 {
    font-size: clamp(3rem, 15vw, 4.7rem);
  }

  .article-lead-image {
    width: 100%;
    aspect-ratio: 4 / 3;
  }
}
</style>
