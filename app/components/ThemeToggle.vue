<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type ThemeMode = 'system' | 'light' | 'dark'
type ResolvedTheme = 'light' | 'dark'

const themeModes: readonly ThemeMode[] = ['system', 'light', 'dark']
const themeMode = ref<ThemeMode>('system')
const resolvedTheme = ref<ResolvedTheme>('light')
const announcement = ref('')
let colorSchemeQuery: MediaQueryList | undefined

useHead(() => ({
  meta: [
    {
      name: 'theme-color',
      content: resolvedTheme.value === 'dark' ? '#101411' : '#fbf9f3',
    },
  ],
}))

const nextThemeMode = computed<ThemeMode>(() => {
  const currentIndex = themeModes.indexOf(themeMode.value)
  return themeModes[(currentIndex + 1) % themeModes.length] ?? 'system'
})

const themeLabel = computed(() => {
  const current = capitalize(themeMode.value)
  return `Theme: ${current}. Switch to ${capitalize(nextThemeMode.value)} mode`
})

function capitalize(value: ThemeMode | ResolvedTheme): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

function isThemeMode(value: string | undefined | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode !== 'system') return mode
  return colorSchemeQuery?.matches ? 'dark' : 'light'
}

function updateThemeColor(nextTheme: ResolvedTheme): void {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', nextTheme === 'dark' ? '#101411' : '#fbf9f3')
}

function applyThemeMode(nextMode: ThemeMode, persist = false): void {
  const nextTheme = resolveTheme(nextMode)

  themeMode.value = nextMode
  resolvedTheme.value = nextTheme
  document.documentElement.dataset.themeMode = nextMode
  document.documentElement.dataset.theme = nextTheme
  updateThemeColor(nextTheme)

  if (persist) {
    localStorage.setItem('heekmah-theme', nextMode)
  }
}

function handleSystemThemeChange(): void {
  if (themeMode.value === 'system') {
    applyThemeMode('system')
  }
}

function cycleThemeMode(): void {
  applyThemeMode(nextThemeMode.value, true)
  announcement.value = `${capitalize(themeMode.value)} theme selected${themeMode.value === 'system' ? `, currently using ${resolvedTheme.value}` : ''}.`
}

onMounted(() => {
  colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const storedMode = localStorage.getItem('heekmah-theme')
  const initialMode = isThemeMode(storedMode)
    ? storedMode
    : isThemeMode(document.documentElement.dataset.themeMode)
      ? document.documentElement.dataset.themeMode
      : 'system'

  applyThemeMode(initialMode)
  colorSchemeQuery.addEventListener('change', handleSystemThemeChange)
})

onBeforeUnmount(() => {
  colorSchemeQuery?.removeEventListener('change', handleSystemThemeChange)
})
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="themeLabel"
    :title="themeLabel"
    :data-mode="themeMode"
    @click="cycleThemeMode"
  >
    <svg
      class="theme-icon sun-icon"
      :data-visible="themeMode === 'light'"
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle cx="10" cy="10" r="3.25" stroke="currentColor" stroke-width="1.5" />
      <path
        d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M16 4l-1.4 1.4M5.4 14.6L4 16"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="1.5"
      />
    </svg>
    <svg
      class="theme-icon moon-icon"
      :data-visible="themeMode === 'dark'"
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M16.7 12.4A7.25 7.25 0 0 1 7.6 3.3a7.25 7.25 0 1 0 9.1 9.1Z"
        stroke="currentColor"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>
    <svg
      class="theme-icon system-icon"
      :data-visible="themeMode === 'system'"
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <rect x="3.25" y="4" width="13.5" height="10" rx="1.75" stroke="currentColor" stroke-width="1.5" />
      <path d="M10 14v2.5M7.5 16.5h5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" />
    </svg>
  </button>
  <span class="theme-announcement" aria-live="polite">{{ announcement }}</span>
</template>

<style scoped>
.theme-toggle {
  position: relative;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
  box-shadow: var(--shadow-border);
  color: var(--brand-deep);
  cursor: pointer;
  transition-property: background-color, border-color, box-shadow, scale;
  transition-duration: 180ms;
  transition-timing-function: var(--ease-out);
}

.theme-toggle:hover {
  box-shadow: var(--shadow-border-hover);
}

.theme-toggle:active {
  scale: 0.96;
}

.theme-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  filter: blur(4px);
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.25);
  transition-property: opacity, filter, transform;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

.theme-icon[data-visible='true'] {
  opacity: 1;
  filter: blur(0);
  transform: translate(-50%, -50%) scale(1);
}

.theme-announcement {
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

@media (prefers-reduced-motion: reduce) {
  .theme-toggle,
  .theme-icon {
    transition-duration: 0.01ms;
  }
}
</style>
