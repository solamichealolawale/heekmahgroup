<script setup lang="ts">
defineProps<{
  src: string
}>()

const imageFailed = ref(false)
</script>

<template>
  <span class="brand-mark-shell" aria-hidden="true">
    <NuxtImg
      v-if="!imageFailed"
      class="brand-mark-image"
      :src="src"
      alt=""
      width="44"
      height="44"
      decoding="async"
      @error="imageFailed = true"
    />
    <span v-else class="brand-mark-fallback">H</span>
  </span>
</template>

<style scoped>
.brand-mark-shell {
  display: grid;
  overflow: hidden;
  place-items: center;
}

.brand-mark-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  outline: none;
}

.brand-mark-fallback {
  color: #5cad35;
  font-family: var(--font-display);
  font-size: 1.55em;
  font-weight: 800;
  letter-spacing: -0.12em;
  line-height: 1;
}
</style>
