<template>
  <div class="px-4 py-3">
    <TabsNav :current="activeLabel" :tabs="tabLabels" @active="handleActive" />
  </div>

  <div class="px-4 pb-[4rem] flex flex-col flex-1 space-y-3 overflow-y-auto">
    <component :is="currentTab" />
  </div>
</template>

<script setup lang="ts">
import TabsNav from '@/components/TabsNav.vue'
import { ref, computed } from 'vue'
import { defineAsyncComponent } from 'vue'

// mapping label -> fungsi import
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tabComponents: Record<string, () => Promise<any>> = {
  Daily: () => import('@/pages/DashboardTabs/DailyTab.vue'),
  Calendar: () => import('@/pages/DashboardTabs/CalendarTab.vue'),
  Report: () => import('@/pages/DashboardTabs/ReportTab.vue'),
}

// daftar tab hanya label (buat TabsNav)
const tabLabels = Object.keys(tabComponents)

const activeLabel = ref(tabLabels[0])

const currentTab = computed(() => {
  const loader = tabComponents[activeLabel.value]
  return loader ? defineAsyncComponent(loader) : null
})

function handleActive(label: string) {
  activeLabel.value = label
}
</script>
