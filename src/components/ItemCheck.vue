<script setup lang="ts">
import type { ItemGroup } from "@/types"
import { computed } from "vue"

interface FlatItem {
  id: string
  name: string
}

// props data categories
const props = defineProps<{
  data: ItemGroup[]
  formName?: string
}>()

// v-model binding (dua arah otomatis)
const checkedList = defineModel<string[]>({ required: true })

// flatten data (parent + sub items)
const flatData = computed<FlatItem[]>(() => {
  function walk(list: ItemGroup[]): FlatItem[] {
    return list.flatMap(g => [
      { id: g.id, name: g.name },
      ...(g.items ? walk(g.items) : []),
    ])
  }
  return walk(props.data)
})
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <div v-for="item in flatData" :key="item.id"
      class="inline-flex items-center border border-slate-200 bg-slate-50 rounded-md px-3 py-2">
      <input type="checkbox" :id="item.id" :name="props.formName" :value="item.id" v-model="checkedList"
        class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
      <label :for="item.id" class="ml-2 text-sm font-medium text-slate-700">
        {{ item.name }}
      </label>
    </div>
  </div>
</template>
