<template>
  <Teleport to="#action-left-teleport">
    <button class="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      @click="router.push('/')">
      <component :is="ChevronLeft" />
    </button>
  </Teleport>
  <div class="flex flex-col flex-1">
    <div class="flex flex-row gap-2 items-center px-4 mb-2">
      <DatePicker v-model="data.time" mode="date" color="orange">
        <template #default="{ togglePopover }">
          <div
            class="flex flex-row gap-2 items-center text-gray-500 bg-gray-100 rounded-md border border-gray-200 px-4 py-2"
            @click="togglePopover">
            <component :is="CalendarSearch" class="size-6" />
            <span class="text-sm font-medium">{{ formatDateMonth(data.time.toISOString()) }}</span>
          </div>
        </template>
      </DatePicker>
      <SelectedOptionSlide :initialIndex="[...transactionType].findIndex(v => v.includes(selectedTransactionType))"
        v-model="selectedTransactionType" class="w-full bg-gray-100 rounded-md border border-gray-200 text-gray-500"
        :data="[...transactionType]" />
    </div>
    <div class="flex flex-col flex-1">
      <div class="space-y-5 p-4 w-full flex-1 overflow-auto">
        <FormRowSelector v-for="(item, i) in inputList" :key="i" v-bind="{
          label: item.label,
          helper: item.helper,
          input: item.input,
          number: item.number,
          placeholder: item.placeholder,
          formType: item.formType,
        }" v-model="item.model.value" v-model:selected="selectedFocus" @click="handleRowClick" />

        <BaseButton type="input" variant="fill" color="orange" class="w-full" @click="handleSaveTransaction">
          <div class="flex flex-row items-center justify-center space-x-2">
            <component :is="SaveIcon" class="w-4 h-4" />
            <span>Save</span>
          </div>
        </BaseButton>
      </div>
      <div class="w-full flex-1" v-if="tabsPanelState">
        <div v-for="(panel, i) in tabsPanelData" :key="`${panel.name}-${i}`">
          <TabsPanel v-if="panel.name == selectedFocus" :title="panel.name" :data="panel.data" @close="handleTabClose"
            @select="handleTabSelected" @edit="handleTabEdit" />
        </div>
      </div>
    </div>
  </div>
  <BottomSheet v-model:show="showEditCategory">
    <div class="space-y-5 relative">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold me-auto">Add / Edit Category</h2>
        <component class="text-gray-500" :is="CircleXIcon" @click="showEditCategoryToggle()" />
      </div>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import BaseButton from '@/components/BaseButton.vue';
import TabsPanel, { type TabData } from '@/components/TabsPanel.vue';
import FormRowSelector from '@/components/FormRowSelector.vue';
import { type ItemGroup } from '@/types';
import { CalendarSearch, ChevronLeft, CircleXIcon, SaveIcon } from 'lucide-vue-next';
import { computed, onMounted, reactive, ref, toRaw, toRef, watch, watchEffect } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAssetStore } from '@/stores/assetStore';
import { transactionType, useTransactionStore, type Transaction, type TransactionType } from '@/stores/transactionStore';
import { useRoute, useRouter } from 'vue-router';
import { localData } from '@/stores/localDataStore';
import { DatePicker } from 'v-calendar';
import { formatDateMonth } from '@/utils/format';
import SelectedOptionSlide from '@/components/SelectedOptionSlide.vue';
import BottomSheet from '@/components/BottomSheet.vue';
import { useToggle } from '@vueuse/core';

const router = useRouter()
const route = useRoute()

interface Panel {
  name: string
  data: TabData[]
}

// init store
const categoryStore = useCategoryStore()
const assetStore = useAssetStore()
const transactionStore = useTransactionStore()

// ref declares
const selectedFocus = ref('Total')
const tabsPanelState = ref(false)
const selectedTransactionType = ref<TransactionType>('Outcome')
const modelTotal = ref('')
const tabsPanelData = ref<Panel[]>([])
const [showEditCategory, showEditCategoryToggle] = useToggle()

// computed declares
const categories = computed(() => categoryStore.categories.filter(v => v.meta?.categoryType === selectedTransactionType.value))

const data = reactive<Transaction>({
  total: '',
  category: <ItemGroup>{},
  asset: <ItemGroup>{},
  notes: '',
  type: selectedTransactionType.value,
  time: new Date(),
  detail: ''
})

const inputList: Record<string, any>[] = [
  {
    label: "Total",
    placeholder: "Amount of Transaction",
    formType: 'input',
    model: computed({
      get: () => data.total ?? modelTotal.value,
      set: (val) => data.total = val.replace(/[^\d]/g, '')
    }),
    input: true,
    number: 'currency',
  },
  {
    label: "Category",
    placeholder: "Transportation, Foods, Etc ..",
    formType: 'input',
    model: computed({
      get: () => data.category.name ?? '',
      set: (val) => data.category.name = val
    }),
  },
  {
    label: "Asset",
    placeholder: "Source Balance",
    formType: 'input',
    model: computed({
      get: () => data.asset.name ?? '',
      set: (val) => data.asset.name = val
    }),
  },
  {
    label: "Notes",
    placeholder: "Transaction Notes",
    model: toRef(data, 'notes'),
    input: true,
    formType: 'input'
  },
  {
    label: "Detail (optional)",
    placeholder: "...",
    model: toRef(data, 'detail'),
    input: true,
    formType: 'textarea'
  },
]

watch(selectedTransactionType, (v) => {
  data.type = v
  tabsPanelData.value.forEach(v => {
    if (v.name === 'Category') {
      v.data = categories.value
      return
    }
  })
})

watchEffect(() => {
  // this used for triggering category or assets panel on tab event pressed
  handleRowClick(selectedFocus.value)
})

function handleRowClick(val: string) {
  selectedFocus.value = val
  switch (val) {
    case "Total":
      tabsPanelState.value = false
      return
    case "Category":
      tabsPanelState.value = true
      return
    case "Asset":
      tabsPanelState.value = true
      return
    case "Notes":
      tabsPanelState.value = false
      return
  }
}

const handleTabSelected = async (val: Record<string, any>) => {
  switch (selectedFocus.value) {
    case "Category": {
      data.category = { id: val.id, name: val.name }
      return;
    }
    case "Asset": {
      data.asset = { id: val.id, name: val.name }
      return;
    }
  }
}

const handleTabEdit = () => {
  showEditCategoryToggle()
}

const handleTabClose = () => {
  tabsPanelState.value = false
}

const handleSaveTransaction = async () => {
  // validation
  for (const [k, v] of Object.entries(data)) {
    switch (k) {
      case "category":
        if (!v || Object.keys(v).length === 0) {
          alert('category cannot be empty')
          return
        }
      case "asset":
        if (!v || Object.keys(v).length === 0) {
          alert('asset cannot be empty')
          return
        }
    }
  }
  // store
  if (route.query.action == 'edit' && data.id) {
    await transactionStore.update(data.id, toRaw(data))
  } else {
    data.time = new Date(localData.value.selectedDate!)
    await transactionStore.add(toRaw(data))
  }

  router.push('/')
}

onMounted(async () => {
  // load category and asset
  await categoryStore.fetchAll()
  await assetStore.fetchAll()
  // initial store
  tabsPanelData.value.push(
    { name: "Category", data: categoryStore.categories },
    { name: "Asset", data: assetStore.assets }
  )
  if (localData.value.selectedDate) {
    data.time = new Date(localData.value.selectedDate)
  }
  if (route.query.action == 'edit' && localData.value.selectedTransactionItem) {
    const it = localData.value.selectedTransactionItem
    data.category = it.category
    data.asset = it.asset
    data.id = it.id
    data.notes = it.notes
    data.time = it.time
    data.total = it.total
    data.type = it.type
    data.time = it.time
    data.detail = it.detail
  }
})
</script>
