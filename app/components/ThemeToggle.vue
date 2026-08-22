<script setup lang="ts">
type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')
let colorSchemeQuery: MediaQueryList | undefined

useHead(() => ({
  meta: [
    {
      name: 'theme-color',
      content: theme.value === 'dark' ? '#101411' : '#fbf9f3',
    },
  ],
}))

function updateThemeColor(nextTheme: Theme): void {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', nextTheme === 'dark' ? '#101411' : '#fbf9f3')
}

function applyTheme(nextTheme: Theme, persist = false): void {
  theme.value = nextTheme
  document.documentElement.dataset.theme = nextTheme
  updateThemeColor(nextTheme)

  if (persist) {
    localStorage.setItem('heekmah-theme', nextTheme)
  }
}

function handleSystemThemeChange(event: MediaQueryListEvent): void {
  if (!localStorage.getItem('heekmah-theme')) {
    applyTheme(event.matches ? 'dark' : 'light')
  }
}

function toggleTheme(): void {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark', true)
}

onMounted(() => {
  colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const currentTheme = document.documentElement.dataset.theme
  applyTheme(currentTheme === 'dark' ? 'dark' : 'light')
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
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <svg
      class="theme-icon sun-icon"
      :data-visible="theme === 'light'"
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
      :data-visible="theme === 'dark'"
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
  </button>
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
</style>
