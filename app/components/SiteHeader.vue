<script setup lang="ts">
import { useBreakpoints, useScrollLock } from '@vueuse/core'

import { siteContent } from '~/data/site'

const route = useRoute()
const menuOpen = ref(false)
const menuToggle = useTemplateRef<HTMLButtonElement>('menuToggle')
const bodyElement = shallowRef<HTMLElement | null>(null)
const breakpoints = useBreakpoints({ desktop: 861 }, { ssrWidth: 1200 })
const isMobile = breakpoints.smaller('desktop')
const bodyScrollLocked = useScrollLock(bodyElement)
const content = await useCmsContent('site', siteContent)
let servicesOpenAtEscapeStart = false

const servicesNavigationLabel = computed(() => content.value.servicesNavigationLabel || 'Our Services')

watchEffect(() => {
  bodyScrollLocked.value = menuOpen.value && isMobile.value
})

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

function closeMenu(): void {
  menuOpen.value = false
}

function recordEscapeState(event: KeyboardEvent): void {
  const header = event.currentTarget as HTMLElement
  servicesOpenAtEscapeStart = header.querySelector('.navigation-trigger')?.getAttribute('aria-expanded') === 'true'
}

async function handleHeaderEscape(): Promise<void> {
  if (!menuOpen.value || servicesOpenAtEscapeStart) {
    servicesOpenAtEscapeStart = false
    return
  }

  closeMenu()
  await nextTick()
  menuToggle.value?.focus()
}

onMounted(() => {
  bodyElement.value = document.body
})
</script>

<template>
  <header class="site-header" @keydown.esc.capture="recordEscapeState" @keydown.esc="handleHeaderEscape">
    <div class="shell header-inner">
      <NuxtLink class="brand" to="/" :aria-label="`${content.brandName} home`">
        <BrandMark class="brand-mark" :src="content.logo.src" />
        <span class="brand-name">{{ content.brandName }}</span>
      </NuxtLink>

      <div class="navigation-shell" :data-open="menuOpen ? 'true' : 'false'">
        <SiteNavigation :items="content.navigation" :services-label="servicesNavigationLabel" @navigate="closeMenu" />
      </div>

      <div class="header-actions">
        <NuxtLink
          class="button-link header-cta"
          :to="content.headerAction.to"
          data-cta-location="header"
          data-cta-intent="general-enquiry"
        >
          {{ content.headerAction.label }}
        </NuxtLink>
        <ThemeToggle />
        <button
          ref="menuToggle"
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="primary-navigation"
          :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'"
          @click="menuOpen = !menuOpen"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  z-index: 50;
  top: 0;
  background: var(--header-bg);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}

.header-inner {
  display: flex;
  min-height: 78px;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.brand {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 10px;
  color: var(--brand-deep);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.brand-mark {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.navigation-shell {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-cta {
  min-height: 44px;
  padding: 0 16px;
  font-size: 0.82rem;
}

.menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--brand-deep);
}

.menu-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  margin: 5px auto;
  background: currentColor;
  transition-property: transform;
  transition-duration: 180ms;
  transition-timing-function: var(--ease-out);
}

.menu-toggle[aria-expanded='true'] span:first-child {
  transform: translateY(3.5px) rotate(45deg);
}

.menu-toggle[aria-expanded='true'] span:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}

@media (max-width: 1120px) {
  .header-cta {
    display: none;
  }
}

@media (max-width: 860px) {
  .header-inner {
    min-height: 70px;
    flex-wrap: wrap;
    gap: 0 16px;
  }

  .header-actions {
    margin-left: auto;
  }

  .menu-toggle {
    display: block;
  }

  .navigation-shell {
    order: 3;
    width: 100%;
    max-height: 0;
    align-items: stretch;
    flex-direction: column;
    gap: 0;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    visibility: hidden;
    transition-property: max-height, opacity, visibility;
    transition-duration: 220ms, 140ms, 0s;
    transition-delay: 0s, 0s, 220ms;
    transition-timing-function: var(--ease-out);
  }

  .navigation-shell[data-open='true'] {
    max-height: min(620px, calc(100dvh - 70px));
    padding-bottom: 18px;
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
    transition-delay: 0s;
  }
}

@media (max-width: 360px) {
  .brand-name {
    display: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .site-header {
    background: var(--paper);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .navigation-shell,
  .menu-toggle span {
    transition-duration: 0.01ms;
  }
}
</style>
