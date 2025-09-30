<template>
  <div class="divide-y divide-gray-100">
    <div v-for="(item, index) in items" :key="index" class="flex flex-row py-2" @click="emit('selected', item)">
      <div v-for="(col, colIndex) in columns" :key="colIndex" class="px-2" :class="[
        col.align === 'right' ? 'text-right' : 'text-left',
        col.class ?? '',
        col.width ? `w-${col.width}` : `flex-1`
      ]">
        <slot :name="col.key" :item="item">
          <div class="text-sm text-gray-700 truncate">
            {{ item[col.key] }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
export type Column = {
  key: string
  width?: string // E.g. '20%', '30%', etc
  class?: string
  align?: 'left' | 'right'
}

const emit = defineEmits<{
  (e: 'selected', item: Record<string, any>): Record<string, any>
}>()

defineProps<{
  columns: Column[]
  items: Record<string, any>[]
}>()
</script>
