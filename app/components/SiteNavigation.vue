<script setup lang="ts">
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
} from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import type { ContentLink } from '~/types/content'

type NavigationEntry =
  | { readonly kind: 'link'; readonly item: ContentLink }
  | { readonly kind: 'services'; readonly label: string; readonly items: readonly ContentLink[] }

const props = defineProps<{
  items: readonly ContentLink[]
  servicesLabel: string
}>()

const emit = defineEmits<{
  navigate: []
}>()

const route = useRoute()
const activeItem = ref('')
const servicePaths = new Set(['/heekmah-rice/', '/heekmah-integral-services/'])

const entries = computed<readonly NavigationEntry[]>(() => {
  const serviceItems = props.items.filter((item) => servicePaths.has(item.to))
  const result: NavigationEntry[] = []
  let servicesAdded = false

  for (const item of props.items) {
    if (servicePaths.has(item.to)) {
      if (!servicesAdded) {
        result.push({ kind: 'services', label: props.servicesLabel, items: serviceItems })
        servicesAdded = true
      }

      continue
    }

    result.push({ kind: 'link', item })
  }

  return result
})

const servicesRouteActive = computed(() => servicePaths.has(normalizePath(route.path)))

watch(
  () => route.fullPath,
  () => {
    activeItem.value = ''
  },
)

function normalizePath(path: string): string {
  return path === '/' ? path : `${path.replace(/\/+$/, '')}/`
}

function isRouteActive(path: string): boolean {
  return normalizePath(route.path) === normalizePath(path)
}

function handleNavigate(): void {
  activeItem.value = ''
  emit('navigate')
}
</script>

<template>
  <NavigationMenuRoot
    id="primary-navigation"
    v-model="activeItem"
    class="primary-navigation"
    aria-label="Primary navigation"
    :delay-duration="120"
    :skip-delay-duration="160"
  >
    <NavigationMenuList class="navigation-list">
      <template v-for="entry in entries" :key="entry.kind === 'link' ? entry.item.to : 'services'">
        <NavigationMenuItem v-if="entry.kind === 'link'" class="navigation-item">
          <NavigationMenuLink as-child :active="isRouteActive(entry.item.to)">
            <RouterLink class="navigation-link" :to="entry.item.to" @click="handleNavigate">
              {{ entry.item.label }}
            </RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem v-else value="services" class="navigation-item services-item">
          <NavigationMenuTrigger class="navigation-trigger" :data-route-active="servicesRouteActive ? 'true' : 'false'">
            <span>{{ entry.label }}</span>
            <svg class="navigation-chevron" aria-hidden="true" viewBox="0 0 16 16">
              <path d="m4 6 4 4 4-4" />
            </svg>
          </NavigationMenuTrigger>

          <NavigationMenuContent class="services-dropdown">
            <p class="services-kicker">Explore our companies</p>
            <NavigationMenuLink
              v-for="service in entry.items"
              :key="service.to"
              as-child
              :active="isRouteActive(service.to)"
            >
              <RouterLink class="service-link" :to="service.to" @click="handleNavigate">
                <span>{{ service.label }}</span>
                <svg aria-hidden="true" viewBox="0 0 16 16">
                  <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" />
                </svg>
              </RouterLink>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </template>
    </NavigationMenuList>
  </NavigationMenuRoot>
</template>

<style>
.primary-navigation {
  position: relative;
}

.navigation-list {
  display: flex;
  padding: 0;
  margin: 0;
  align-items: center;
  gap: clamp(18px, 2.4vw, 34px);
  list-style: none;
}

.navigation-item,
.services-item {
  position: relative;
}

.navigation-link,
.navigation-trigger {
  position: relative;
  min-height: 44px;
  display: inline-flex;
  padding: 0;
  border: 0;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 650;
  text-decoration: none;
  transition-property: color, scale;
  transition-duration: 160ms;
  transition-timing-function: var(--ease-out);
}

.navigation-link::after,
.navigation-trigger::after {
  position: absolute;
  right: 0;
  bottom: 7px;
  left: 0;
  height: 2px;
  background: var(--earth);
  content: '';
  transform: scaleX(0);
  transform-origin: right;
  transition-property: transform;
  transition-duration: 180ms;
  transition-timing-function: var(--ease-out);
}

.navigation-link:hover,
.navigation-link[aria-current='page'],
.navigation-link[data-active],
.navigation-trigger:hover,
.navigation-trigger[data-state='open'],
.navigation-trigger[data-route-active='true'] {
  color: var(--brand-deep);
}

.navigation-link:hover::after,
.navigation-link[aria-current='page']::after,
.navigation-link[data-active]::after,
.navigation-trigger:hover::after,
.navigation-trigger[data-state='open']::after,
.navigation-trigger[data-route-active='true']::after {
  transform: scaleX(1);
  transform-origin: left;
}

.navigation-link:active,
.navigation-trigger:active {
  scale: 0.96;
}

.navigation-chevron {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  transition-property: transform;
  transition-duration: 180ms;
  transition-timing-function: var(--ease-out);
}

.navigation-trigger[data-state='open'] .navigation-chevron {
  transform: rotate(180deg);
}

.services-dropdown {
  position: absolute;
  z-index: 70;
  top: calc(100% + 8px);
  left: 50%;
  width: min(320px, calc(100vw - 32px));
  padding: 12px;
  border-radius: 14px;
  background: var(--surface);
  box-shadow:
    0 0 0 1px var(--line),
    0 18px 48px rgba(16, 28, 19, 0.16),
    0 3px 10px rgba(16, 28, 19, 0.08);
  transform: translateX(-50%);
  transform-origin: top center;
}

.services-dropdown[data-state='open'] {
  animation: dropdown-in 180ms var(--ease-out);
}

.services-dropdown[data-state='closed'] {
  animation: dropdown-out 120ms ease-in;
}

.services-kicker {
  padding: 7px 10px 10px;
  margin: 0;
  color: var(--earth);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.service-link {
  min-height: 50px;
  display: flex;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--ink);
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  transition-property: background-color, color, transform;
  transition-duration: 150ms;
  transition-timing-function: var(--ease-out);
}

.service-link:hover,
.service-link:focus-visible,
.service-link[data-active] {
  background: var(--rice-light);
  color: var(--brand-deep);
  transform: translateX(2px);
}

.service-link svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  transition-property: transform;
  transition-duration: 150ms;
  transition-timing-function: var(--ease-out);
}

.service-link:hover svg,
.service-link:focus-visible svg {
  transform: translateX(3px);
}

@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: translate(-50%, -5px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

@keyframes dropdown-out {
  from {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }

  to {
    opacity: 0;
    transform: translate(-50%, -3px) scale(0.99);
  }
}

@media (max-width: 860px) {
  .primary-navigation,
  .navigation-list,
  .navigation-item,
  .services-item {
    width: 100%;
  }

  .navigation-list {
    align-items: stretch;
    flex-direction: column;
    gap: 0;
  }

  .navigation-link,
  .navigation-trigger {
    width: 100%;
    min-height: 52px;
    border-top: 1px solid var(--line);
    justify-content: space-between;
    text-align: left;
  }

  .navigation-link::after,
  .navigation-trigger::after {
    display: none;
  }

  .services-dropdown {
    position: static;
    width: 100%;
    padding: 6px;
    border-radius: 10px;
    background: var(--rice-light);
    box-shadow: inset 0 0 0 1px var(--line);
    transform: none;
    transform-origin: top;
  }

  .services-dropdown[data-state='open'] {
    animation-name: mobile-dropdown-in;
  }

  .services-dropdown[data-state='closed'] {
    animation-name: mobile-dropdown-out;
  }

  .services-kicker {
    padding-inline: 12px;
  }

  .service-link {
    min-height: 48px;
  }
}

@keyframes mobile-dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes mobile-dropdown-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .navigation-link,
  .navigation-trigger,
  .navigation-chevron,
  .service-link,
  .service-link svg {
    transition-duration: 0.01ms;
  }

  .services-dropdown[data-state] {
    animation-duration: 0.01ms;
  }
}
</style>
