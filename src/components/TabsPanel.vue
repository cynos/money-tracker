<template>
  <div class="bg-white overflow-x-auto">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-black text-white text-sm font-semibold">
      <span>{{ title }}</span>
      <div class="flex items-center gap-2">
        <button @click="$emit('edit')">
          <component :is="PencilIcon" />
        </button>
        <button @click="$emit('close')">
          <component :is="LucideXCircle" />
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="grid grid-cols-3 text-xs font-medium">
      <div v-for="(tab, index) in data" :key="`${tab.name}-${index}`" class="basis-1/3 text-center p-2 cursor-pointer"
        :class="[
          activeTab === tab.id ? 'bg-slate-100 text-red-500' : tab.sub ? 'bg-gray-100' : 'bg-white text-gray-700'
        ]" @click="tab.name != '' && !tab.empty && selectedTab(tab.id!)">
        <div class="flex flex-col items-center justify-center h-[4rem]">
          <div class="text-xl"> {{ tab.icon }} </div>
          <div>{{ tab.name }}</div>
          <!-- <div class="text-xs" v-if="!tab.sub && !tab.empty && tab.items!">
            {{ activeTab === tab.id ? '▲' : '▼' }}
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { LucideXCircle, PencilIcon } from 'lucide-vue-next';
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue'

interface internalTabData extends TabData {
  sub?: boolean
  empty?: boolean
}

export interface TabData {
  id?: string
  name: string
  icon?: string
  items?: TabData[]
}

const props = defineProps<{
  title: string
  data: internalTabData[]
}>()

const cols: number = 3
const activeTab = ref('')
const data = ref([...props.data])

watch(() => props.data, (v) => {
  data.value = [...v]
})

function selectedTab(id: string): void {
  activeTab.value = id
  const selectedTabData = data.value.find(cat => cat.id == id) as Record<string, any>
  emit('select', selectedTabData)
  data.value = data.value.filter(cat => !cat.sub && !cat.empty)
  for (let i = 0; i < data.value.length; i++) {
    const item = data.value[i]
    if (item.id == id && item.items!) {
      const tabRowPosition = Math.floor(i / cols + 1)
      const tabColRest = getEmptyColumns(data.value, cols)
      const indexInsert = cols * tabRowPosition
      if (tabColRest > 0) {
        for (let i = 0; i < tabColRest; i++) {
          data.value.push(<internalTabData>{ empty: true })
        }
      }
      const subLength = getEmptyColumns(item.items!, cols)
      for (let i = 0; i < subLength; i++) {
        item.items?.unshift(<internalTabData>{})
      }
      item.items?.forEach(v => {
        data.value.splice(indexInsert, 0, <internalTabData>{ ...v, sub: true })
      })
    }
  }
}

onMounted(() => {
  data.value = data.value.filter(val => {
    if (val.id) {
      return true
    }
  })
})

const emit = defineEmits<{
  (e: 'select', value: Record<string, any>): void
  (e: 'edit'): void
  (e: 'close'): void
}>()

function getEmptyColumns<T>(data: T[], columnsPerRow: number): number {
  return (columnsPerRow - (data.length % columnsPerRow)) % columnsPerRow
}

</script>
