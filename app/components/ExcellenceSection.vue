<script setup lang="ts">
import type { ExcellenceContent } from '~/types/content'

defineProps<{
  content: ExcellenceContent
}>()
</script>

<template>
  <section class="section excellence-section">
    <div class="shell excellence-grid">
      <div class="excellence-intro">
        <p class="eyebrow">{{ content.eyebrow }}</p>
        <h2 class="section-heading">{{ content.title }}</h2>
        <p class="section-lead">
          {{ content.summary }}
        </p>
      </div>

      <ol class="excellence-list">
        <li v-for="item in content.items" :key="item.number">
          <span>{{ item.number }}</span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.excellence-grid {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1fr);
  gap: clamp(58px, 10vw, 150px);
}

.excellence-intro {
  position: sticky;
  top: 126px;
}

.excellence-intro .section-heading {
  margin-bottom: 28px;
}

.excellence-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.excellence-list li {
  display: grid;
  padding: 30px 0 34px;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 26px;
}

.excellence-list li + li {
  border-top: 1px solid var(--line);
}

.excellence-list li > span {
  color: var(--earth);
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-style: italic;
}

.excellence-list h3 {
  margin-bottom: 10px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(1.65rem, 2.7vw, 2.35rem);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.excellence-list p {
  max-width: 50ch;
  margin-bottom: 0;
  color: var(--ink-muted);
  line-height: 1.7;
}

@media (max-width: 760px) {
  .excellence-grid {
    grid-template-columns: 1fr;
  }

  .excellence-intro {
    position: static;
  }
}

@media (max-width: 480px) {
  .excellence-list li {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 16px;
  }
}
</style>
