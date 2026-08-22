<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { computed } from 'vue'

import type { EnquiryInterestOption } from '~/types/content'

const props = withDefaults(
  defineProps<{
    options: readonly EnquiryInterestOption[]
    inputId?: string
    inputName?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    inputId: 'enquiry-interest',
    inputName: 'interest',
    required: false,
    disabled: false,
  },
)

const model = defineModel<string>({ required: true })
const selectedLabel = computed(() => props.options.find((option) => option.value === model.value)?.label)
</script>

<template>
  <SelectRoot v-model="model" :name="inputName" :required="required" :disabled="disabled">
    <SelectTrigger :id="inputId" class="select-trigger">
      <SelectValue :aria-label="selectedLabel" placeholder="Choose an enquiry type">
        {{ selectedLabel }}
      </SelectValue>
      <SelectIcon class="select-icon">
        <svg aria-hidden="true" viewBox="0 0 16 16">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent class="select-content" position="popper" :side-offset="8" :collision-padding="16">
        <SelectViewport class="select-viewport">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            class="select-item"
            :value="option.value"
            :text-value="option.label"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
            <SelectItemIndicator class="select-indicator">
              <svg aria-hidden="true" viewBox="0 0 16 16">
                <path d="m3.5 8 3 3 6-6" />
              </svg>
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style>
.select-trigger {
  position: relative;
  width: 100%;
  min-height: 52px;
  display: flex;
  padding: 12px 52px 12px 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  align-items: center;
  justify-content: flex-start;
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  text-align: left;
  transition-property: border-color, box-shadow, background-color;
  transition-duration: 150ms;
  transition-timing-function: var(--ease-out);
}

.select-trigger:hover {
  border-color: var(--leaf);
}

.select-trigger:focus-visible {
  border-color: var(--earth);
  outline: 3px solid var(--earth);
  outline-offset: 2px;
}

.select-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.select-icon {
  position: absolute;
  inset-inline-end: 18px;
  top: 50%;
  width: 18px;
  height: 18px;
  color: var(--brand-deep);
  pointer-events: none;
  transform: translateY(-50%);
}

.select-icon svg {
  width: 100%;
  height: 100%;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  transition-property: transform;
  transition-duration: 180ms;
  transition-timing-function: var(--ease-out);
}

.select-trigger[data-state='open'] .select-icon svg {
  transform: rotate(180deg);
}

.select-content {
  z-index: 100;
  width: var(--reka-select-trigger-width);
  max-height: min(360px, var(--reka-select-content-available-height));
  overflow: hidden;
  border-radius: 12px;
  background: var(--surface);
  box-shadow:
    0 0 0 1px var(--line),
    0 18px 48px rgba(16, 28, 19, 0.16),
    0 3px 10px rgba(16, 28, 19, 0.08);
  transform-origin: var(--reka-select-content-transform-origin);
}

.select-content[data-state='open'] {
  animation: select-in 160ms var(--ease-out);
}

.select-content[data-state='closed'] {
  animation: select-out 110ms ease-in;
}

.select-viewport {
  padding: 6px;
}

.select-item {
  position: relative;
  min-height: 44px;
  display: flex;
  padding: 9px 42px 9px 11px;
  border-radius: 7px;
  align-items: center;
  color: var(--ink);
  cursor: default;
  font-size: 0.9rem;
  outline: none;
  user-select: none;
  transition-property: background-color, color;
  transition-duration: 120ms;
  transition-timing-function: var(--ease-out);
}

.select-item[data-highlighted] {
  background: var(--rice-light);
  color: var(--brand-deep);
}

.select-item[data-disabled] {
  opacity: 0.48;
  pointer-events: none;
}

.select-indicator {
  position: absolute;
  inset-inline-end: 13px;
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  color: var(--brand-deep);
}

.select-indicator svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

@keyframes select-in {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes select-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(-2px) scale(0.99);
  }
}

@media (prefers-reduced-motion: reduce) {
  .select-trigger,
  .select-icon svg,
  .select-item {
    transition-duration: 0.01ms;
  }

  .select-content[data-state] {
    animation-duration: 0.01ms;
  }
}
</style>
