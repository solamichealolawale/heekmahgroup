<script setup lang="ts">
import type { ConversionPanelContent } from '~/types/content'

defineProps<{
  content: ConversionPanelContent
}>()
</script>

<template>
  <section class="conversion-section" aria-labelledby="conversion-heading">
    <div class="shell conversion-inner">
      <div class="conversion-intro">
        <p class="eyebrow">{{ content.eyebrow }}</p>
        <h2 id="conversion-heading">{{ content.title }}</h2>
      </div>

      <div class="conversion-list">
        <article v-for="item in content.items" :key="item.intent" class="conversion-item">
          <p class="conversion-eyebrow">{{ item.eyebrow }}</p>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <NuxtLink
            class="conversion-action"
            :to="item.action.to"
            data-cta-location="conversion-panel"
            :data-cta-intent="item.intent"
          >
            {{ item.action.label }}
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M3 8.5h10M9 4.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.conversion-section {
  padding-block: clamp(54px, 6vw, 82px);
  background: var(--brand-solid);
  color: var(--on-brand);
}

.conversion-inner {
  display: grid;
  align-items: stretch;
  grid-template-columns: minmax(210px, 0.52fr) minmax(0, 1.48fr);
  gap: clamp(42px, 7vw, 96px);
}

.conversion-intro {
  padding-top: 8px;
}

.conversion-intro .eyebrow,
.conversion-eyebrow {
  color: var(--rice);
}

.conversion-intro h2 {
  max-width: 8ch;
  margin: 0;
  color: var(--on-brand);
  font-family: var(--font-display);
  font-size: clamp(2.3rem, 4vw, 4rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.conversion-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.conversion-item {
  min-height: 300px;
  display: flex;
  padding: 30px clamp(22px, 2.6vw, 36px) 32px;
  flex-direction: column;
}

.conversion-item + .conversion-item {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.conversion-eyebrow {
  margin-bottom: 18px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.conversion-item h3 {
  margin-bottom: 14px;
  color: var(--on-brand);
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 2.3vw, 2.2rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.conversion-item > p:not(.conversion-eyebrow) {
  max-width: 34ch;
  margin-bottom: 26px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.65;
}

.conversion-action {
  min-height: 46px;
  display: inline-flex;
  padding: 0 14px 0 16px;
  margin-top: auto;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: var(--on-brand);
  box-shadow: var(--shadow-border);
  color: var(--brand-solid);
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: none;
  transition-property: background-color, box-shadow, scale;
  transition-duration: 160ms;
  transition-timing-function: var(--ease-out);
}

.conversion-action:hover {
  background: var(--rice);
  box-shadow: var(--shadow-border-hover);
}

.conversion-action:active {
  scale: 0.96;
}

.conversion-action svg {
  transition-property: transform;
  transition-duration: 170ms;
  transition-timing-function: var(--ease-out);
}

.conversion-action:hover svg {
  transform: translateX(3px);
}

@media (max-width: 1080px) {
  .conversion-inner {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .conversion-intro h2 {
    max-width: none;
  }
}

@media (max-width: 720px) {
  .conversion-list {
    grid-template-columns: 1fr;
  }

  .conversion-item {
    min-height: 250px;
    border-left: 0;
  }

  .conversion-item + .conversion-item {
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
}
</style>
