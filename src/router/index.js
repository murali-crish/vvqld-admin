import { createRouter, createWebHistory } from 'vue-router'
import ProfileSearch from '../components/ProfileSearch.vue'
import EventCreator from '../components/EventCreator.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/profiles'
    },
    {
      path: '/profiles',
      name: 'profiles',
      component: ProfileSearch
    },
    {
      path: '/events',
      name: 'events',
      component: EventCreator
    }
  ]
})

export default router
