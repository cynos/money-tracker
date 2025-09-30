<template>
  <ManageableItems :addSubItemAble="true" :data="assets" :fetchAll="assetStore.fetchAll" :getById="assetStore.getById"
    :add="assetStore.add" :update="assetStore.update" :updateItem="assetStore.updateItem" :remove="assetStore.remove"
    :removeItem="assetStore.removeItem">
    <template v-slot:space="{ data }">
      <div class="flex flex-col text-right px-3 w-full overflow-hidden" v-if="data.meta?.balance">
        <p class="text-xs text-slate-500 font-medium">Balance:</p>
        <p class="text-red-400 font-medium text-sm truncate">{{ formatCurrency(data.meta?.balance) }}</p>
      </div>
    </template>
    <template v-slot:form="{ data }">
      <FormRowSelector input number="plain" label="Balance" name="meta.balance"
        :model-value="`${data?.meta?.balance ?? ''}`" />
    </template>
  </ManageableItems>
</template>

<script setup lang="ts">
import FormRowSelector from '@/components/FormRowSelector.vue';
import ManageableItems from '@/components/ManageableItems.vue';
import { useAssetStore } from '@/stores/assetStore';
import { formatCurrency } from '@/utils/format';
import { onMounted, computed } from 'vue';

const assetStore = useAssetStore()

const assets = computed(() => assetStore.assets.map(e => ({
  ...e,
  subName: `${e.items?.length ?? 0} Items`,
  items: e.items?.map(it => ({
    ...it, subName: formatCurrency(it.meta?.balance || 0)
  }))
})))

onMounted(() => {
  assetStore.fetchAll()
})
</script>
