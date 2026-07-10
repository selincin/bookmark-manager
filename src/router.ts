import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import ArchivedBookmarksView from './views/ArchivedBookmarksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView
    },
    {
      path: '/archived',
      name: 'archived',
      component: ArchivedBookmarksView
    }
  ]
})

export default router