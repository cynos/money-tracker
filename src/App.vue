<template>
  <FixedWidth width="920px">
    <TopHeader :title="<string>(route.meta.title)">
      <template #action-left>
        <div id="action-left-teleport"></div>
      </template>
      <template #action-right>
        <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <component :is="AlignJustifyIcon" />
        </button>
      </template>
    </TopHeader>
    <RouterView />
    <BottomNav />
  </FixedWidth>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import FixedWidth from '@/components/FixedWidth.vue';
import TopHeader from '@/components/TopHeader.vue';
import { AlignJustifyIcon } from 'lucide-vue-next';
import { useDBStore } from './stores/dbStore';
import BottomNav from './components/BottomNav.vue';

onMounted(async () => {
  const dbStore = useDBStore()
  await dbStore.initDB()
})

const route = useRoute()
</script>
