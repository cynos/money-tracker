<template>
  <div class="flex w-full items-center justify-center">
    <div class="flex flex-col items-center text-center text-slate-300">
      <component :is="icon" class="w-12 h-12 mb-3 text-slate-300" aria-hidden="true" />
      <p class="text-base font-medium">{{ message }}</p>
      <p v-if="description" class="text-sm text-slate-300 mt-1">
        {{ description }}
      </p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  message?: string
  description?: string
  icon?: Component
}>()

// default props
const icon = props.icon
const message = props.message ?? 'Tidak ada data'
const description = props.description ?? ''
</script>
