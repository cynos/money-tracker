<template>
  <header class="flex items-center justify-between px-4 py-3 bg-white">
    <!-- Action Slot (Left) -->
    <div class="flex items-center space-x-2">
      <slot name="action-left" />
    </div>

    <!-- Title -->
    <h1 class="text-base font-semibold text-gray-900 text-center flex-1 truncate">
      {{ title }}
    </h1>

    <!-- Action Slot (Right) -->
    <div class="flex items-center space-x-2">
      <slot name="action-right" />
    </div>
  </header>
</template>

<script setup lang="ts">

defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>
