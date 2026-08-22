<script setup lang="ts">
import type { ProductRangeContent } from '~/types/content'

defineProps<{
  content: ProductRangeContent
}>()
</script>

<template>
  <section class="section products-section">
    <div class="shell">
      <div class="products-heading">
        <div>
          <p class="eyebrow">{{ content.eyebrow }}</p>
          <h2 class="section-heading">{{ content.title }}</h2>
        </div>
        <NuxtLink
          class="button-link secondary"
          :to="content.action.to"
          data-cta-location="product-header"
          data-cta-intent="find-a-distributor"
        >
          {{ content.action.label }}
        </NuxtLink>
      </div>

      <div class="product-grid">
        <article v-for="item in content.items" :key="item.name" class="product-item">
          <figure>
            <ResponsiveImage
              :asset="item.image"
              sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 820px) calc(50vw - 32px), 410px"
            />
          </figure>
          <div>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <NuxtLink
              class="button-link secondary product-action"
              :to="item.action.to"
              :aria-label="`${item.action.label}: ${item.name}`"
              data-cta-location="product-card"
              data-cta-intent="product-enquiry"
              :data-cta-product="item.name"
            >
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
.products-section {
  background: var(--rice-light);
}

.products-heading {
  display: flex;
  margin-bottom: clamp(48px, 6vw, 80px);
  align-items: end;
  justify-content: space-between;
  gap: 40px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 42px 24px;
}

.product-item figure {
  aspect-ratio: var(--card-media-ratio);
  margin: 0 0 22px;
  background: var(--surface);
  overflow: hidden;
}

.product-item {
  display: flex;
  flex-direction: column;
}

.product-item > div {
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
}

.product-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition-property: transform;
  transition-duration: 360ms;
  transition-timing-function: var(--ease-out);
}

.product-item:hover img {
  transform: scale(1.025);
}

.product-item h3 {
  margin-bottom: 9px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 2.1vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.product-item p {
  max-width: 43ch;
  margin-bottom: 22px;
  color: var(--ink-muted);
  line-height: 1.65;
}

.product-action {
  min-height: 44px;
  padding: 0 14px 0 16px;
  margin-top: auto;
  font-size: 0.8rem;
}

@media (max-width: 820px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .products-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}

@media (hover: none) {
  .product-item:hover img {
    transform: none;
  }
}
</style>
