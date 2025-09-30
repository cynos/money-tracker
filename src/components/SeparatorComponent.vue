<template>
  <div :class="[
    'bg-gray-200 dark:bg-gray-700',
    vertical ? 'w-px h-full' : 'h-px w-full',
    className
  ]" role="separator" />
</template>

<script setup lang="ts">
defineProps<{
  vertical?: boolean
  className?: string
}>()
</script>
