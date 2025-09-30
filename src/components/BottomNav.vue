<template>
  <nav class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
    <ul class="flex justify-around py-2">
      <li v-for="item in navItems" :key="item.href">
        <RouterLink :to="item.href" class="flex flex-col items-center text-xs">
          <component :is="item.icon" :class="[
            'w-5 h-5 mb-1',
            currentRoute === item.label ? 'text-slate-700' : 'text-slate-500 '
          ]" :stroke-width="currentRoute === item.label ? 2.2 : 1.8" />
          <span :class="[
            currentRoute === item.label ? 'text-slate-700 font-medium' : 'text-slate-500'
          ]">
            {{ item.label }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { Home, ListTodoIcon, CircleDollarSignIcon, WalletIcon } from 'lucide-vue-next'

const route = useRoute()

const currentRoute = computed(() => route.meta.title)

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/budget', label: 'Budget', icon: CircleDollarSignIcon },
  { href: '/category', label: 'Category', icon: ListTodoIcon },
  { href: '/asset', label: 'Assets', icon: WalletIcon },
]
</script>
