<template>
  <div class="flex justify-between text-center w-full gap-4">
    <div class="flex-1">
      <div class="text-sm text-gray-600">{{ incomeTitle ?? 'income' }}</div>
      <div class="text-blue-500 font-semibold text-lg">
        {{ formatCurrency(income) }}
      </div>
    </div>
    <div class="flex-1">
      <div class="text-sm text-gray-600">{{ outcomeTitle ?? 'outcome' }}</div>
      <div class="text-red-500 font-semibold text-lg">
        {{ formatCurrency(outcome) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/utils/format';

defineProps<{
  income: number
  incomeTitle?: string
  outcome: number
  outcomeTitle?: string
}>()

</script>
