import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { title: 'Dashboard' },
    children: [],
  },
  {
    path: '/category',
    name: 'category',
    meta: { title: 'Category' },
    component: () => import('@/pages/CategoryPage.vue'),
  },
  {
    path: '/asset',
    name: 'asset',
    meta: { title: 'Assets' },
    component: () => import('@/pages/AssetPage.vue'),
  },
  {
    path: '/budget',
    name: 'budget',
    meta: { title: 'Budget' },
    component: () => import('@/pages/BudgetPage.vue'),
  },
  {
    path: '/transaction',
    name: 'transaction',
    meta: { title: 'Transaction' },
    component: () => import('@/pages/TransactionPage.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
