<template>
  <div class="w-full">
    <!-- Progress bar -->
    <div class="relative w-full h-7 bg-gray-100 flex items-center">
      <div class="h-full bg-orange-400 transition-all duration-500" :style="{ width: percent + '%' }">
      </div>
      <div class="absolute left-2 text-black font-semibold">
        {{ percent }} %
      </div>
    </div>

    <!-- Values under bar -->
    <div class="flex justify-between text-gray-600 text-sm mt-2">
      <span :class="leftClass">Rp. {{ formatCurrency(leftValue) }}</span>
      <span :class="rightClass">Rp. {{ formatCurrency(rightValue) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue"

defineProps<{
  percent: number
  leftValue: number
  rightValue: number
  leftClass?: string
  rightClass?: string
}>()

/**
 * Format number ke format rupiah
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID").format(value)
}
</script>
