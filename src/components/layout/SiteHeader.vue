<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowUpRight, Menu, X } from 'lucide-vue-next'
import { profile } from '../../data/profile'
const route = useRoute()
const router = useRouter()
const open = ref(false)
const active = ref('home')
const links = [
  { label: 'Home', id: 'home' }, { label: 'About', id: 'about' }, { label: 'Expertise', id: 'expertise' },
  { label: 'Work', id: 'work' }, { label: 'Journey', id: 'journey' }, { label: 'Contact', id: 'contact' }
]
let observer: IntersectionObserver | undefined
function navigate(id: string) {
  open.value = false
  if (route.path !== '/') { void router.push({ path: '/', hash: `#${id}` }); return }
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
}
function escapeKey(e: KeyboardEvent) { if (e.key === 'Escape') open.value = false }
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) active.value = e.target.id })
  }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 })
  links.forEach(l => { const el = document.getElementById(l.id); if (el) observer?.observe(el) })
  document.addEventListener('keydown', escapeKey)
})
watch(() => route.path, () => {
  open.value = false
  observer?.disconnect()
  window.setTimeout(() => links.forEach(l => { const el = document.getElementById(l.id); if (el) observer?.observe(el) }), 250)
})
onUnmounted(() => { observer?.disconnect(); document.removeEventListener('keydown', escapeKey) })
</script>
<template>
  <header class="site-header">
    <div class="header-inner">
      <button type="button" @click="navigate('home')" class="brand" :aria-label="'Go to ' + profile.fullName + ' home'">
        <span class="brand-mark">VM<span class="brand-asterisk">✳</span></span>
        <span class="brand-name">VIJAYALAXMI<br />MASUTI</span>
      </button>
      <nav class="desktop-nav" aria-label="Main navigation">
        <button v-for="link in links" :key="link.id" type="button" @click="navigate(link.id)" :class="['nav-link', { 'nav-active': active === link.id && route.path === '/' }]">{{ link.label }}</button>
      </nav>
      <a class="header-cta" :href="`mailto:${profile.email}?subject=Portfolio%20Enquiry`">LET'S TALK <ArrowUpRight :size="15" /></a>
      <button class="menu-toggle" type="button" :aria-expanded="open" aria-controls="mobile-navigation" :aria-label="open ? 'Close navigation' : 'Open navigation'" @click="open = !open"><X v-if="open" :size="24" /><Menu v-else :size="24" /></button>
    </div>
    <nav v-if="open" id="mobile-navigation" class="mobile-navigation" aria-label="Mobile navigation">
      <button v-for="(link, i) in links" :key="link.id" type="button" @click="navigate(link.id)"><span>0{{ i + 1 }}</span>{{ link.label }}<ArrowUpRight :size="18" /></button>
      <a :href="profile.resume" download @click="open = false">Download CV <ArrowUpRight :size="18" /></a>
    </nav>
  </header>
</template>
