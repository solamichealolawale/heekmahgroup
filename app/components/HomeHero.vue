<script setup lang="ts">
import type { HeroContent } from '~/types/content'

defineProps<{
  content: HeroContent
}>()
</script>

<template>
  <section class="hero">
    <div class="shell hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">{{ content.eyebrow }}</p>
        <h1>{{ content.title }}</h1>
        <p class="hero-summary">{{ content.summary }}</p>

        <div class="hero-actions">
          <a
            class="button-link"
            :href="content.primaryAction.to"
            data-cta-location="hero"
            data-cta-intent="general-enquiry"
          >
            {{ content.primaryAction.label }}
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M3 8.5h10M9 4.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </a>
          <a
            class="button-link secondary"
            :href="content.secondaryAction.to"
            data-cta-location="hero"
            data-cta-intent="explore-companies"
          >
            {{ content.secondaryAction.label }}
          </a>
        </div>

        <ul class="hero-highlights" aria-label="Areas of work">
          <li v-for="highlight in content.highlights" :key="highlight">
            {{ highlight }}
          </li>
        </ul>
      </div>

      <div class="hero-media" aria-label="Heekmah Group in the field">
        <figure class="hero-primary-image">
          <ResponsiveImage
            :asset="content.primaryImage"
            sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 820px) min(100vw - 80px, 640px), (max-width: 1060px) 42vw, 570px"
            fetch-priority="high"
            loading="eager"
          />
        </figure>
        <figure class="hero-secondary-image">
          <ResponsiveImage
            :asset="content.secondaryImage"
            sizes="(max-width: 560px) 38vw, 245px"
            fetch-priority="low"
          />
        </figure>
        <p class="hero-caption">
          {{ content.imageCaption }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: clamp(56px, 7vw, 104px) 0 clamp(74px, 8vw, 116px);
  background: var(--paper);
}

.hero-grid {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 0.93fr) minmax(430px, 0.87fr);
  gap: clamp(48px, 7vw, 112px);
}

.hero-copy h1 {
  max-width: 10.5ch;
  margin-bottom: 28px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 6.5vw, 6.7rem);
  font-weight: 600;
  letter-spacing: -0.058em;
  line-height: 0.9;
}

.hero-summary {
  max-width: 58ch;
  margin-bottom: 32px;
  color: var(--ink-muted);
  font-size: clamp(1.05rem, 1.45vw, 1.22rem);
  line-height: 1.72;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-highlights {
  display: flex;
  padding: 22px 0 0;
  margin: 38px 0 0;
  border-top: 1px solid var(--line);
  flex-wrap: wrap;
  gap: 10px 28px;
  color: var(--brand-deep);
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.04em;
  list-style: none;
}

.hero-highlights li {
  position: relative;
  padding-left: 14px;
}

.hero-highlights li::before {
  position: absolute;
  top: 0.55em;
  left: 0;
  width: 5px;
  height: 5px;
  background: var(--earth);
  content: '';
}

.hero-media {
  position: relative;
  min-height: 620px;
  padding: 0 0 58px 72px;
}

.hero-primary-image,
.hero-secondary-image {
  margin: 0;
}

.hero-primary-image {
  height: 570px;
  overflow: hidden;
}

.hero-primary-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

.hero-secondary-image {
  position: absolute;
  bottom: 0;
  left: 0;
  width: min(46%, 245px);
  padding: 10px;
  background: var(--rice-light);
}

.hero-secondary-image img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.hero-caption {
  position: absolute;
  right: -22px;
  bottom: 8px;
  display: flex;
  margin: 0;
  align-items: flex-end;
  flex-direction: column;
  color: var(--earth);
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-style: italic;
  line-height: 1.1;
}

@media (max-width: 1060px) {
  .hero-grid {
    grid-template-columns: minmax(0, 1fr) minmax(360px, 0.8fr);
    gap: 48px;
  }

  .hero-copy h1 {
    font-size: clamp(3.4rem, 7vw, 5.5rem);
  }

  .hero-media {
    min-height: 540px;
    padding-left: 54px;
  }

  .hero-primary-image {
    height: 490px;
  }
}

@media (max-width: 820px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    max-width: 700px;
  }

  .hero-copy h1 {
    max-width: 11ch;
  }

  .hero-media {
    width: min(100%, 640px);
    min-height: 590px;
    justify-self: end;
  }

  .hero-primary-image {
    height: 540px;
  }
}

@media (max-width: 560px) {
  .hero {
    padding-top: 44px;
  }

  .hero-copy h1 {
    font-size: clamp(3.15rem, 16vw, 4.7rem);
  }

  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-actions .button-link {
    width: 100%;
  }

  .hero-highlights {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-media {
    min-height: 458px;
    padding: 0 0 48px 26px;
  }

  .hero-primary-image {
    height: 420px;
  }

  .hero-secondary-image {
    width: 42%;
    padding: 6px;
  }

  .hero-caption {
    display: none;
  }
}
</style>
