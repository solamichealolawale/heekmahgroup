<script setup lang="ts">
import type { TestimonialsContent } from '~/types/content'

defineProps<{
  content: TestimonialsContent
}>()
</script>

<template>
  <section class="section testimonial-section">
    <div class="shell">
      <div class="testimonial-heading">
        <p class="eyebrow">{{ content.eyebrow }}</p>
        <h2 class="section-heading">{{ content.title }}</h2>
      </div>

      <div class="testimonial-list">
        <blockquote v-for="item in content.items" :key="item.name">
          <span aria-hidden="true">“</span>
          <p>{{ item.quote }}</p>
          <footer>
            <strong>{{ item.name }}</strong>
            <span>{{ item.role }}</span>
          </footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonial-section {
  background: var(--brand);
  color: var(--on-brand);
}

.testimonial-heading {
  margin-bottom: clamp(46px, 6vw, 76px);
}

.testimonial-heading .eyebrow {
  color: var(--rice);
}

.testimonial-heading .section-heading {
  color: var(--on-brand);
}

.testimonial-list {
  display: grid;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

blockquote {
  position: relative;
  min-height: 390px;
  display: flex;
  padding: 38px clamp(24px, 3vw, 42px) 34px;
  margin: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.22);
  border-bottom: 1px solid rgba(255, 255, 255, 0.22);
  flex-direction: column;
}

blockquote:first-child {
  border-left: 1px solid rgba(255, 255, 255, 0.22);
}

blockquote > span {
  height: 48px;
  color: var(--rice);
  font-family: var(--font-display);
  font-size: 4.7rem;
  line-height: 1;
}

blockquote > p {
  margin: 20px 0 34px;
  color: rgba(255, 255, 255, 0.9);
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  line-height: 1.35;
}

blockquote footer {
  display: flex;
  margin-top: auto;
  flex-direction: column;
  gap: 3px;
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.86rem;
}

blockquote strong {
  color: var(--on-brand);
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .testimonial-list {
    display: flex;
    padding-bottom: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }

  blockquote {
    min-width: min(82vw, 480px);
    scroll-snap-align: start;
  }
}
</style>
