<template>
  <div class="flex gap-2 flex-wrap">
    <span v-for="(item, idx) in items" :key="idx" :class="[
      'bg-gray-200 rounded-full text-gray-700 cursor-pointer hover:bg-gray-300 transition',
      sizeClasses,
    ]" @click="$emit('select', item)">
      {{ item }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

type SizeOption = "xs" | "sm" | "md"

interface Props {
  items: string[]
  size?: SizeOption
}

const props = defineProps<Props>()

defineEmits<{
  (e: "select", item: string): void
}>()

// Mapping ukuran ke kelas Tailwind
const sizeClasses = computed(() => {
  switch (props.size) {
    case "xs":
      return "px-2 py-0.5 text-xs"
    case "sm":
      return "px-3 py-1 text-sm"
    default: // md (default)
      return "px-4 py-1 text-base"
  }
})
</script>
