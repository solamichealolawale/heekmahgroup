<script setup lang="ts">
import {
  useDocumentVisibility,
  useElementHover,
  useIntervalFn,
  usePreferredReducedMotion,
  useSwipe,
} from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch, type WatchStopHandle } from 'vue'

import type { HeroSlide } from '~/types/content'

const props = withDefaults(
  defineProps<{
    slides: readonly HeroSlide[]
    label?: string
    autoplay?: boolean
  }>(),
  {
    label: 'Heekmah Group in the field',
    autoplay: true,
  },
)

const carousel = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const isUserPaused = ref(false)
const hasFocusWithin = ref(false)
const announcement = ref('')
const reducedMotion = usePreferredReducedMotion()
const documentVisibility = useDocumentVisibility()
const isHovering = useElementHover(carousel)
const slideCount = computed(() => props.slides.length)

const canAutoplay = computed(
  () =>
    props.autoplay &&
    slideCount.value > 1 &&
    !isUserPaused.value &&
    !hasFocusWithin.value &&
    !isHovering.value &&
    reducedMotion.value !== 'reduce' &&
    documentVisibility.value === 'visible',
)

function normalizedIndex(index: number): number {
  if (slideCount.value === 0) return 0
  return (index + slideCount.value) % slideCount.value
}

function goTo(index: number, announce = true): void {
  if (slideCount.value < 2) return

  activeIndex.value = normalizedIndex(index)
  if (announce) {
    announcement.value = `Showing slide ${activeIndex.value + 1} of ${slideCount.value}: ${props.slides[activeIndex.value]?.title ?? ''}`
  }
}

function showPrevious(): void {
  goTo(activeIndex.value - 1)
}

function showNext(): void {
  goTo(activeIndex.value + 1)
}

function toggleAutoplay(): void {
  isUserPaused.value = !isUserPaused.value
  announcement.value = isUserPaused.value ? 'Automatic slide rotation paused.' : 'Automatic slide rotation resumed.'
}

function handleFocusOut(event: FocusEvent): void {
  const nextTarget = event.relatedTarget
  if (!(nextTarget instanceof Node) || !carousel.value?.contains(nextTarget)) hasFocusWithin.value = false
}

useSwipe(carousel, {
  threshold: 48,
  onSwipeEnd: (_event, direction) => {
    if (direction === 'left') showNext()
    if (direction === 'right') showPrevious()
  },
})

const { pause, resume } = useIntervalFn(() => goTo(activeIndex.value + 1, false), 6_500, {
  immediate: false,
})

let stopAutoplaySync: WatchStopHandle | undefined

onMounted(() => {
  stopAutoplaySync = watch(
    canAutoplay,
    (shouldPlay) => {
      if (shouldPlay) resume()
      else pause()
    },
    { immediate: true },
  )
})

onBeforeUnmount(() => {
  stopAutoplaySync?.()
  pause()
})

watch(slideCount, (count) => {
  if (activeIndex.value >= count) activeIndex.value = 0
})
</script>

<template>
  <div
    ref="carousel"
    class="hero-carousel"
    role="region"
    aria-roledescription="carousel"
    :aria-label="label"
    tabindex="0"
    @focusin="hasFocusWithin = true"
    @focusout="handleFocusOut"
    @keydown.left.prevent="showPrevious"
    @keydown.right.prevent="showNext"
  >
    <div class="carousel-frame">
      <figure
        v-for="(slide, index) in slides"
        :key="slide.src"
        class="carousel-slide"
        :class="{ 'is-active': index === activeIndex }"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${index + 1} of ${slideCount}`"
        :aria-hidden="index === activeIndex ? undefined : 'true'"
      >
        <ResponsiveImage
          :asset="slide"
          sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 820px) min(100vw - 80px, 640px), (max-width: 1060px) 42vw, 570px"
          nuxt-sizes="100vw sm:600px md:640px lg:42vw xl:570px"
          :fetch-priority="index === 0 ? 'high' : 'low'"
          :loading="index === 0 ? 'eager' : 'lazy'"
        />
        <figcaption class="carousel-slide-copy">
          <span class="carousel-slide-title">{{ slide.title }}</span>
        </figcaption>
      </figure>

      <div v-if="slideCount > 1" class="carousel-controls">
        <button class="carousel-arrow" type="button" aria-label="Show previous image" @click="showPrevious">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="m12.5 4.5-5.5 5.5 5.5 5.5M7.5 10H16" />
          </svg>
        </button>

        <div class="carousel-dots" aria-label="Choose an image">
          <button
            v-for="(_slide, index) in slides"
            :key="`control-${index}`"
            class="carousel-dot"
            type="button"
            :aria-label="`Show image ${index + 1}`"
            :aria-current="index === activeIndex ? 'true' : undefined"
            @click="goTo(index)"
          >
            <span />
          </button>
        </div>

        <button class="carousel-arrow" type="button" aria-label="Show next image" @click="showNext">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="m7.5 4.5 5.5 5.5-5.5 5.5M12.5 10H4" />
          </svg>
        </button>

        <button
          v-if="autoplay"
          class="carousel-pause"
          type="button"
          :aria-label="isUserPaused ? 'Resume automatic slides' : 'Pause automatic slides'"
          :aria-pressed="isUserPaused"
          @click="toggleAutoplay"
        >
          <svg v-if="isUserPaused" class="carousel-play-icon" aria-hidden="true" viewBox="0 0 20 20">
            <path d="m7.25 5.25 7 4.75-7 4.75z" />
          </svg>
          <svg v-else aria-hidden="true" viewBox="0 0 20 20">
            <path d="M7 5.5v9M13 5.5v9" />
          </svg>
        </button>
      </div>

      <div class="carousel-meta" aria-hidden="true">
        <span class="carousel-counter">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
        <span class="carousel-divider" />
        <span class="carousel-count">{{ String(slideCount).padStart(2, '0') }}</span>
      </div>
    </div>

    <p class="carousel-announcement" aria-live="polite">{{ announcement }}</p>
  </div>
</template>

<style scoped>
:global(:root) {
  --hero-carousel-frame-shadow: inset 0 0 0 1px #000, 0 28px 70px rgba(23, 37, 27, 0.13);
}

:global(:root[data-theme='dark']) {
  --hero-carousel-frame-shadow: inset 0 0 0 1px #fff, 0 28px 70px rgba(0, 0, 0, 0.26);
}

.hero-carousel,
.carousel-frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-carousel {
  min-height: inherit;
  outline: none;
  touch-action: pan-y;
}

.hero-carousel:focus-visible .carousel-frame {
  box-shadow:
    0 0 0 3px var(--paper),
    0 0 0 6px var(--earth);
}

.carousel-announcement {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.carousel-frame {
  min-height: inherit;
  overflow: hidden;
  background: var(--brand-deep);
  box-shadow: var(--hero-carousel-frame-shadow);
}

.carousel-slide {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  pointer-events: none;
  transform: scale(1.018);
  transition:
    opacity 420ms cubic-bezier(0.2, 0, 0, 1),
    transform 680ms cubic-bezier(0.2, 0, 0, 1);
}

.carousel-slide.is-active {
  z-index: 1;
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.carousel-slide::after {
  position: absolute;
  z-index: 0;
  inset: 0;
  background: linear-gradient(180deg, rgba(8, 18, 11, 0.02) 48%, rgba(8, 18, 11, 0.8) 100%);
  content: '';
}

.carousel-slide-copy {
  position: absolute;
  z-index: 1;
  right: clamp(22px, 4vw, 38px);
  bottom: 88px;
  left: clamp(22px, 4vw, 38px);
  color: white;
}

.carousel-slide-title {
  max-width: 28ch;
  display: block;
  color: inherit;
  font-size: clamp(1rem, 1.6vw, 1.35rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.18;
  text-wrap: balance;
}

.carousel-controls,
.carousel-meta {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  color: white;
  background: rgba(15, 30, 20, 0.76);
  backdrop-filter: blur(16px) saturate(135%);
}

.carousel-controls {
  right: 18px;
  bottom: 18px;
  min-height: 48px;
  padding: 4px;
  gap: 2px;
  box-shadow:
    0 10px 32px rgba(0, 0, 0, 0.18),
    inset 0 1px rgba(255, 255, 255, 0.18);
}

.carousel-arrow,
.carousel-pause,
.carousel-dot {
  display: grid;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border: 0;
  place-items: center;
  color: inherit;
  background: transparent;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    transform 120ms ease;
}

.carousel-arrow:hover,
.carousel-pause:hover,
.carousel-arrow:focus-visible,
.carousel-pause:focus-visible {
  background: rgba(255, 255, 255, 0.13);
}

.carousel-arrow:active,
.carousel-pause:active,
.carousel-dot:active {
  transform: scale(0.96);
}

.carousel-arrow:focus-visible,
.carousel-pause:focus-visible,
.carousel-dot:focus-visible {
  outline: 2px solid white;
  outline-offset: -3px;
}

.carousel-arrow svg,
.carousel-pause svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.carousel-play-icon path {
  fill: currentColor;
  stroke: none;
}

.carousel-dots {
  display: flex;
  align-items: center;
}

.carousel-dot {
  min-width: 32px;
}

.carousel-dot span {
  width: 7px;
  height: 7px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  transition:
    width 220ms cubic-bezier(0.2, 0, 0, 1),
    background-color 160ms ease;
}

.carousel-dot[aria-current='true'] span {
  width: 22px;
  background: white;
}

.carousel-meta {
  top: 18px;
  left: 18px;
  min-height: 42px;
  padding: 0 15px;
  gap: 10px;
  font-size: 0.75rem;
  font-weight: 720;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.16);
}

.carousel-counter {
  font-variant-numeric: tabular-nums;
}

.carousel-divider {
  width: 22px;
  height: 1px;
  background: rgba(255, 255, 255, 0.55);
}

@media (max-width: 560px) {
  .carousel-slide-copy {
    right: 20px;
    bottom: 76px;
    left: 20px;
  }

  .carousel-slide-copy h2 {
    font-size: clamp(1.45rem, 7.2vw, 2rem);
  }

  .carousel-slide-copy p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .carousel-controls {
    right: 12px;
    bottom: 12px;
  }

  .carousel-meta {
    top: 12px;
    left: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .carousel-slide {
    transform: none;
    transition: opacity 180ms ease;
  }

  .carousel-arrow,
  .carousel-pause,
  .carousel-dot,
  .carousel-dot span {
    transition: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .carousel-controls,
  .carousel-meta {
    background: #13261a;
    backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .carousel-controls,
  .carousel-meta {
    border: 1px solid white;
    background: #0c1c12;
  }
}
</style>
