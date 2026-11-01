import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ProjectPage from '../pages/ProjectPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import { profile } from '../data/profile'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/project/:slug', name: 'project', component: ProjectPage, props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 88 }
    if (to.path !== from.path) return { top: 0 }
    return undefined
  }
})

router.afterEach((to) => {
  const work = profile.projects.find(item => item.slug === to.params.slug)
  document.title = to.name === 'home' ? 'Vijayalaxmi Masuti — Space, Structure & Design' : `${work?.title || 'Portfolio'} — Vijayalaxmi Masuti`
})

export default router
