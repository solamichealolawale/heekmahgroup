<script setup lang="ts">
import type { MediaAsset } from '~/types/content'
import wordpressMedia from '~/data/wordpress-media.json'

const props = withDefaults(
  defineProps<{
    asset: MediaAsset
    sizes: string
    loading?: 'eager' | 'lazy'
    fetchPriority?: 'auto' | 'high' | 'low'
    preload?: boolean
  }>(),
  {
    loading: 'lazy',
    fetchPriority: 'auto',
    preload: false,
  },
)

const isLocalAsset = computed(() => props.asset.src.startsWith('/'))
const fallbackMedia = wordpressMedia as Record<string, { readonly attachmentId: number; readonly srcSet: string }>
const responsiveSrcSet = computed(() => props.asset.srcSet || fallbackMedia[props.asset.src]?.srcSet)
</script>

<template>
  <NuxtImg
    v-if="isLocalAsset"
    :src="asset.src"
    :alt="asset.alt"
    :width="asset.width"
    :height="asset.height"
    :loading="loading"
    :fetchpriority="fetchPriority"
    :preload="preload ? { fetchPriority } : false"
    decoding="async"
  />
  <img
    v-else
    :src="asset.src"
    :srcset="responsiveSrcSet || undefined"
    :sizes="responsiveSrcSet ? sizes : undefined"
    :alt="asset.alt"
    :width="asset.width"
    :height="asset.height"
    :loading="loading"
    :fetchpriority="fetchPriority"
    decoding="async"
  />
</template>
