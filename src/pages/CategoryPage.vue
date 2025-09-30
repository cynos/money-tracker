<template>
  <ManageableItems :addSubItemAble="true" :data="categories" :fetchAll="categoryStore.fetchAll"
    :getById="categoryStore.getById" :add="categoryStore.add" :update="categoryStore.update"
    :updateItem="categoryStore.updateItem" :remove="categoryStore.remove" :removeItem="categoryStore.removeItem">
    <template #form>
      <FormRowSelector label="Category Type" name="meta.categoryType" v-model="(selectedCategoryType as string)">
        <template v-slot:customInputTitle>
          <h4 class="font-medium mb-3 text-slate-500 text-md">Select category type</h4>
        </template>
        <template v-slot:customInput>
          <SelectedOptionSlide :initialIndex="categoryTypeList.findIndex(c => c === selectedCategoryType)"
            v-model="selectedCategoryType" class="rounded border bg-white border border-gray-200 text-gray-500"
            :data="categoryTypeList" />
        </template>
      </FormRowSelector>
    </template>
    <template #filterBottomSheet>
      <div class="flex flex-col space-y-4">
        <div class="bg-gray-50 rounded-md border border-gray-200 p-4">
          <div class="flex items-center text-gray-600 mb-2 space-x-1">
            <component :is="FolderOpen" class="stroke-gray-400 size-4" />
            <span class="text-sm">Category Type :</span>
          </div>
          <SelectedOptionSlide :initialIndex="categoryTypeList.findIndex(c => c === selectedCategoryType)"
            v-model="selectedCategoryType" class="rounded border bg-white border border-gray-200 text-gray-500"
            :data="[...transactionType]" />
        </div>
        <div class="bg-gray-50 rounded border border-gray-200 p-4">
          <div class="flex items-center text-gray-600 mb-2 space-x-1">
            <component :is="ArrowUpZA" class="stroke-gray-400 size-4" />
            <span class="text-sm">Sort By:</span>
          </div>
          <div class="flex flex-row items-center text-gray-600 mb-2 space-x-1">
            <DropdownList v-model="sortFilter" :options="sortFilterList" mode="standard" direction="up" />
            <div class="flex flex-row space-x-1 p-3 rounded border border-gray-200 bg-white"
              @click="sortFilterDirection = sortFilterDirection === 'ASC' ? 'DSC' : 'ASC'">
              <component :is="sortFilterDirection === 'ASC' ? ArrowDownAZ : ArrowUpAz" class="stroke-gray-400 size-4" />
              <span class="text-xs">{{ sortFilterDirection }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ManageableItems>
</template>

<script setup lang="ts">
import DropdownList, { type Option } from '@/components/DropdownList.vue';
import FormRowSelector from '@/components/FormRowSelector.vue';
import ManageableItems from '@/components/ManageableItems.vue';
import SelectedOptionSlide from '@/components/SelectedOptionSlide.vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { transactionType, type TransactionType } from '@/stores/transactionStore';
import { ArrowDownAZ, ArrowUpAz, ArrowUpZA, FolderOpen } from 'lucide-vue-next';
import { computed, onMounted, ref, watchEffect } from 'vue';

const categoryStore = useCategoryStore()

const categoryTypeList = [...transactionType]
const selectedCategoryType = ref<TransactionType>('Outcome')
const sortFilterList: Option[] = [
  { label: "Name", value: "Name" },
  { label: "Date", value: "Date" },
]
const sortFilter = ref<string>(sortFilterList[0].label)
const sortFilterDirection = ref('ASC')
const categories = computed(() => {
  const filtered = categoryStore.categories.filter(v => v.meta?.categoryType === selectedCategoryType.value)
  const direction = sortFilterDirection.value === "ASC" ? 1 : -1
  return filtered.sort((a, b) => {
    if (sortFilter.value === "Name") {
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" }) * direction
    }
    if (sortFilter.value === "Date") {
      return (a.createdAt!.toISOString().localeCompare(b.createdAt!.toISOString())) * direction
    }
    return 0
  })
})

watchEffect(() => {
  categoryStore.categories.map(e => {
    e.subName = `${e.items?.length ?? 0} Items`
    return e
  })
})

onMounted(() => {
  categoryStore.fetchAll()
})
</script>
