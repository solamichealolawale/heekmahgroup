<script setup lang="ts">
import type { InteriorSectionContent } from '~/types/content'

defineProps<{
  sections: readonly InteriorSectionContent[]
}>()

type PrinciplesLayout = 'purpose' | 'capability' | 'grid'

function principlesLayout(sectionId: string): PrinciplesLayout {
  if (sectionId === 'direction') return 'purpose'
  if (sectionId === 'growth') return 'capability'
  return 'grid'
}
</script>

<template>
  <template v-for="section in sections" :key="section.id">
    <section
      v-if="section.kind === 'narrative'"
      :id="section.id"
      class="section narrative-section"
      :data-image-position="section.imagePosition ?? 'end'"
    >
      <div class="shell narrative-grid">
        <figure class="narrative-media">
          <ResponsiveImage
            :asset="section.image"
            sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 880px) min(100vw - 80px, 720px), 570px"
          />
        </figure>

        <div class="narrative-copy">
          <p class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
          <aside v-if="section.note" class="narrative-note">{{ section.note }}</aside>
          <NuxtLink v-if="section.action" class="text-link" :to="section.action.to">
            {{ section.action.label }}
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M3 8.5h10M9 4.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section
      v-else-if="section.kind === 'principles'"
      :id="section.id"
      class="section principles-section"
      :data-tone="section.tone ?? 'paper'"
    >
      <div class="shell">
        <div class="principles-heading">
          <div>
            <p class="eyebrow">{{ section.eyebrow }}</p>
            <h2 class="section-heading">{{ section.title }}</h2>
          </div>
          <p v-if="section.summary" class="section-lead">{{ section.summary }}</p>
        </div>

        <div v-if="principlesLayout(section.id) === 'purpose'" class="purpose-layout">
          <article
            v-for="(item, index) in section.items"
            :key="item.title"
            :data-primary="index === 0 ? 'true' : 'false'"
          >
            <div class="purpose-marker" aria-hidden="true">
              <span>{{ item.kicker ?? String(index + 1).padStart(2, '0') }}</span>
              <i />
            </div>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.body }}</p>
            </div>
          </article>
        </div>

        <div v-else-if="principlesLayout(section.id) === 'capability'" class="capability-path" role="list">
          <article v-for="(item, index) in section.items" :key="item.title" role="listitem">
            <div class="capability-marker" aria-hidden="true">
              <span>{{ item.kicker ?? String(index + 1).padStart(2, '0') }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>

        <div v-else class="principles-grid">
          <article v-for="item in section.items" :key="item.title">
            <p v-if="item.kicker" class="principle-kicker">{{ item.kicker }}</p>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section v-else-if="section.kind === 'offerings'" :id="section.id" class="section offerings-section">
      <div class="shell">
        <div class="offerings-heading">
          <div>
            <p class="eyebrow">{{ section.eyebrow }}</p>
            <h2 class="section-heading">{{ section.title }}</h2>
          </div>
          <p v-if="section.summary" class="section-lead">{{ section.summary }}</p>
        </div>

        <div class="offerings-grid" :data-columns="section.columns ?? 3">
          <article v-for="item in section.items" :key="item.name" class="offering-card">
            <figure>
              <ResponsiveImage
                :asset="item.image"
                sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 880px) calc(50vw - 36px), 620px"
              />
            </figure>
            <div class="offering-copy">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
              <ul v-if="item.details?.length" class="offering-details" :aria-label="`${item.name} options`">
                <li v-for="detail in item.details" :key="detail">{{ detail }}</li>
              </ul>
              <NuxtLink
                class="button-link secondary offering-action"
                :to="item.action.to"
                data-cta-location="offering-card"
                :data-cta-product="item.name"
              >
                {{ item.action.label }}
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section v-else :id="section.id" class="section page-callout" :data-has-image="section.image ? 'true' : 'false'">
      <div class="shell page-callout-grid">
        <figure v-if="section.image" class="page-callout-media">
          <ResponsiveImage
            :asset="section.image"
            sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 880px) min(100vw - 80px, 720px), 520px"
          />
        </figure>
        <div class="page-callout-copy">
          <p class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.title }}</h2>
          <p>{{ section.body }}</p>
          <div class="page-callout-actions">
            <NuxtLink
              class="button-link callout-primary"
              :to="section.primaryAction.to"
              data-cta-location="page-callout"
              data-cta-intent="primary"
            >
              {{ section.primaryAction.label }}
            </NuxtLink>
            <NuxtLink
              v-if="section.secondaryAction"
              class="button-link callout-secondary"
              :to="section.secondaryAction.to"
            >
              {{ section.secondaryAction.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </template>
</template>

<style scoped>
.narrative-section {
  background: var(--surface);
}

.narrative-grid {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(360px, 0.94fr) minmax(0, 1.06fr);
  gap: clamp(50px, 9vw, 132px);
}

.narrative-section[data-image-position='end'] .narrative-media {
  order: 2;
}

.narrative-media {
  aspect-ratio: 4 / 5;
  margin: 0;
  overflow: hidden;
}

.narrative-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.narrative-copy {
  max-width: 620px;
}

.narrative-copy h2 {
  max-width: 15ch;
  margin-bottom: 28px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(2.65rem, 5vw, 5.2rem);
  font-weight: 600;
  letter-spacing: -0.052em;
  line-height: 0.97;
}

.narrative-copy > p:not(.eyebrow) {
  margin-bottom: 18px;
  color: var(--ink-muted);
  font-size: clamp(1rem, 1.35vw, 1.13rem);
  line-height: 1.78;
}

.narrative-note {
  padding: 19px 0 19px 20px;
  margin: 30px 0;
  border-left: 3px solid var(--earth);
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: 1.18rem;
  font-weight: 600;
  line-height: 1.55;
}

.narrative-copy .text-link {
  margin-top: 8px;
}

.principles-section[data-tone='paper'] {
  background: var(--paper);
}

.principles-section[data-tone='rice'] {
  background: var(--rice-light);
}

.principles-section[data-tone='brand'] {
  background: var(--brand-solid);
  color: var(--on-brand);
}

.principles-heading,
.offerings-heading {
  display: grid;
  margin-bottom: clamp(54px, 7vw, 90px);
  align-items: end;
  grid-template-columns: minmax(0, 1fr) minmax(270px, 0.48fr);
  gap: clamp(36px, 7vw, 96px);
}

.principles-section[data-tone='brand'] .section-heading {
  color: var(--on-brand);
}

.principles-section[data-tone='brand'] .section-lead {
  color: rgba(255, 255, 255, 0.7);
}

.principles-section[data-tone='brand'] .eyebrow,
.principles-section[data-tone='brand'] .principle-kicker {
  color: var(--rice);
}

.principles-grid {
  display: grid;
  border-top: 1px solid var(--line);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.principles-grid article {
  min-height: 260px;
  padding: clamp(30px, 4.5vw, 54px);
}

.principles-grid article:nth-child(2n) {
  border-left: 1px solid var(--line);
}

.principles-grid article:nth-child(n + 3) {
  border-top: 1px solid var(--line);
}

.principles-section[data-tone='brand'] .principles-grid,
.principles-section[data-tone='brand'] .principles-grid article {
  border-color: rgba(255, 255, 255, 0.2);
}

.principle-kicker {
  margin-bottom: 24px;
  color: var(--earth);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.principles-grid h3 {
  max-width: 18ch;
  margin-bottom: 15px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(1.65rem, 2.8vw, 2.65rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.05;
}

.principles-grid article > p:last-child {
  max-width: 49ch;
  margin-bottom: 0;
  color: var(--ink-muted);
  line-height: 1.72;
}

.purpose-layout {
  display: grid;
  align-items: stretch;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  grid-template-rows: repeat(2, minmax(220px, auto));
  gap: 0 clamp(38px, 6vw, 92px);
}

.purpose-layout article {
  display: grid;
  padding: clamp(26px, 4vw, 44px) 0;
  align-content: start;
  grid-template-columns: minmax(72px, 0.22fr) minmax(0, 1fr);
  gap: clamp(18px, 3vw, 36px);
}

.purpose-layout article[data-primary='false'] + article[data-primary='false'] {
  border-top: 1px solid var(--line);
}

.purpose-layout article[data-primary='true'] {
  padding: clamp(34px, 5vw, 62px);
  border: 0;
  background: var(--brand-solid);
  color: var(--on-brand);
  grid-row: 1 / span 2;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
}

.purpose-marker {
  display: flex;
  min-width: 0;
  align-items: center;
  align-self: start;
  gap: 12px;
  color: var(--earth);
  font-size: 0.7rem;
  font-weight: 850;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.purpose-marker i {
  height: 1px;
  background: var(--line);
  flex: 1;
}

.purpose-layout article[data-primary='true'] .purpose-marker {
  color: var(--rice);
}

.purpose-layout article[data-primary='true'] .purpose-marker i {
  background: rgba(255, 255, 255, 0.24);
}

.purpose-layout h3 {
  max-width: 16ch;
  margin-bottom: 15px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.04;
}

.purpose-layout article[data-primary='true'] h3 {
  max-width: 11ch;
  margin-top: auto;
  color: var(--on-brand);
  font-size: clamp(2.7rem, 5vw, 5.1rem);
  line-height: 0.96;
}

.purpose-layout article > div:last-child > p {
  max-width: 48ch;
  margin: 0;
  color: var(--ink-muted);
  line-height: 1.72;
}

.purpose-layout article[data-primary='true'] > div:last-child > p {
  max-width: 40ch;
  color: rgba(255, 255, 255, 0.72);
}

.capability-path {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(18px, 3vw, 42px);
}

.capability-path::before {
  position: absolute;
  top: 34px;
  right: 0;
  left: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  content: '';
}

.capability-path article {
  position: relative;
  min-width: 0;
}

.capability-marker {
  position: relative;
  z-index: 1;
  display: grid;
  width: 68px;
  height: 68px;
  margin-bottom: clamp(34px, 5vw, 58px);
  border: 1px solid rgba(255, 255, 255, 0.46);
  background: var(--brand-solid);
  place-items: center;
  transition:
    background-color 180ms var(--ease-out),
    color 180ms var(--ease-out);
}

.capability-marker span {
  color: var(--rice);
  font-size: 0.7rem;
  font-weight: 850;
  letter-spacing: 0.14em;
}

.capability-path h3 {
  max-width: 12ch;
  margin-bottom: 16px;
  color: var(--on-brand);
  font-family: var(--font-display);
  font-size: clamp(1.65rem, 2.7vw, 2.55rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.05;
}

.capability-path article > p {
  max-width: 32ch;
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.72;
}

@media (hover: hover) {
  .capability-path article:hover .capability-marker {
    background: var(--rice);
  }

  .capability-path article:hover .capability-marker span {
    color: var(--brand-solid);
  }
}

.principles-section[data-tone='brand'] .principles-grid h3 {
  color: var(--on-brand);
}

.principles-section[data-tone='brand'] .principles-grid article > p:last-child {
  color: rgba(255, 255, 255, 0.7);
}

.offerings-section {
  background: var(--surface);
}

.offerings-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px 24px;
}

.offerings-grid[data-columns='2'] {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 48px 30px;
}

.offering-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.offering-card figure {
  aspect-ratio: var(--card-media-ratio);
  margin: 0;
  background: var(--rice-light);
  overflow: hidden;
}

.offering-card figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 340ms var(--ease-out);
}

.offering-card:hover figure img {
  transform: scale(1.025);
}

.offering-copy {
  display: flex;
  padding: 25px 0 0;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
}

.offering-copy h3 {
  margin-bottom: 12px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 2.4vw, 2.3rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.08;
}

.offering-copy > p {
  max-width: 50ch;
  margin-bottom: 18px;
  color: var(--ink-muted);
  line-height: 1.7;
}

.offering-details {
  display: flex;
  padding: 0;
  margin: 0 0 24px;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
}

.offering-details li {
  padding: 6px 10px;
  border: 1px solid var(--line);
  color: var(--ink-muted);
  font-size: 0.75rem;
  font-weight: 750;
}

.offering-action {
  min-height: 44px;
  padding-inline: 15px;
  margin-top: auto;
  font-size: 0.8rem;
}

.page-callout {
  background: var(--brand-solid);
  color: var(--on-brand);
}

.page-callout-grid {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(360px, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(52px, 9vw, 128px);
}

.page-callout[data-has-image='false'] .page-callout-grid {
  grid-template-columns: minmax(0, 850px);
}

.page-callout-media {
  aspect-ratio: 4 / 3;
  margin: 0;
  overflow: hidden;
}

.page-callout-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  outline-color: rgba(255, 255, 255, 0.12);
}

.page-callout-copy .eyebrow {
  color: var(--rice);
}

.page-callout-copy h2 {
  max-width: 14ch;
  margin-bottom: 24px;
  color: var(--on-brand);
  font-family: var(--font-display);
  font-size: clamp(2.65rem, 5.2vw, 5.4rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.96;
}

.page-callout-copy > p:not(.eyebrow) {
  max-width: 54ch;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.05rem;
  line-height: 1.75;
}

.page-callout-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.callout-primary {
  background: var(--on-brand);
  color: var(--brand-solid);
}

.callout-primary:hover {
  background: var(--rice);
}

.callout-secondary {
  border-color: rgba(255, 255, 255, 0.55);
  background: transparent;
  color: var(--on-brand);
}

.callout-secondary:hover {
  border-color: var(--on-brand);
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 880px) {
  .narrative-grid,
  .principles-heading,
  .offerings-heading,
  .page-callout-grid {
    grid-template-columns: 1fr;
  }

  .narrative-section[data-image-position='end'] .narrative-media {
    order: 0;
  }

  .narrative-media {
    width: min(100%, 720px);
    aspect-ratio: 16 / 10;
  }

  .offerings-grid,
  .offerings-grid[data-columns='2'] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .purpose-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 32px;
  }

  .purpose-layout article[data-primary='true'] {
    min-height: 460px;
    grid-row: auto;
  }

  .capability-path {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 54px 28px;
  }

  .capability-path::before {
    display: none;
  }

  .capability-marker {
    margin-bottom: 28px;
  }
}

@media (max-width: 620px) {
  .principles-grid,
  .offerings-grid,
  .offerings-grid[data-columns='2'] {
    grid-template-columns: 1fr;
  }

  .principles-grid article,
  .principles-grid article:nth-child(2n) {
    min-height: 0;
    border-left: 0;
  }

  .principles-grid article + article,
  .purpose-layout article + article {
    border-top: 1px solid var(--line);
  }

  .purpose-layout article,
  .purpose-layout article[data-primary='true'] {
    min-height: 0;
    padding: 30px 0;
    background: transparent;
    color: inherit;
    grid-template-columns: 64px minmax(0, 1fr);
    grid-template-rows: auto;
  }

  .purpose-layout article[data-primary='true'] {
    padding-top: 0;
  }

  .purpose-layout article[data-primary='true'] .purpose-marker {
    color: var(--earth);
  }

  .purpose-layout article[data-primary='true'] .purpose-marker i {
    background: var(--line);
  }

  .purpose-layout article[data-primary='true'] h3 {
    margin-top: 0;
    color: var(--brand-deep);
    font-size: clamp(2.2rem, 10vw, 3.2rem);
  }

  .purpose-layout article[data-primary='true'] > div:last-child > p {
    color: var(--ink-muted);
  }

  .capability-path {
    display: block;
    padding-left: 70px;
  }

  .capability-path::before {
    display: block;
    top: 0;
    right: auto;
    bottom: 0;
    left: 27px;
    width: 1px;
    height: auto;
  }

  .capability-path article {
    padding-bottom: 48px;
  }

  .capability-path article:last-child {
    padding-bottom: 0;
  }

  .capability-marker {
    position: absolute;
    top: 0;
    left: -70px;
    width: 56px;
    height: 56px;
    margin: 0;
  }

  .page-callout-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .page-callout-actions .button-link {
    width: 100%;
  }
}

@media (hover: none) {
  .offering-card:hover figure img {
    transform: none;
  }
}
</style>
