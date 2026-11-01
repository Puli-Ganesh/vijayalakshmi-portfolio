<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/layout/SiteHeader.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import { profile } from './data/profile'

const route = useRoute()
const introActive = ref(false)
const introProgress = ref(0)
let timer: number | undefined
let finishTimer: number | undefined
function finishIntro() {
  introProgress.value = 100
  introActive.value = false
  if (timer) window.clearInterval(timer)
  if (finishTimer) window.clearTimeout(finishTimer)
  try { sessionStorage.setItem('vm-intro-seen', '1') } catch { /* private browsing */ }
}
onMounted(() => {
  const seen = (() => { try { return sessionStorage.getItem('vm-intro-seen') === '1' } catch { return false } })()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!seen && !reduce && route.path === '/') {
    introActive.value = true
    timer = window.setInterval(() => { introProgress.value = Math.min(100, introProgress.value + 5) }, 70)
    finishTimer = window.setTimeout(finishIntro, 1750)
  }
})
onUnmounted(() => { if (timer) window.clearInterval(timer); if (finishTimer) window.clearTimeout(finishTimer) })
watch(() => route.fullPath, () => { if (introActive.value) finishIntro() })
</script>

<template>
  <a href="#main" class="skip-to-content">Skip to content</a>
  <div v-if="introActive" class="intro-overlay" aria-label="Portfolio loading introduction" role="status">
    <div class="intro-rule"></div>
    <div class="intro-center">
      <span class="intro-mini">A PERSONAL DESIGN PORTFOLIO</span>
      <span class="intro-monogram">{{ profile.monogram }}</span>
      <span class="intro-sub">Form follows feeling.</span>
      <div class="intro-progress"><span :style="{ width: introProgress + '%' }"></span></div>
      <span class="intro-num">{{ String(introProgress).padStart(2, '0') }}%</span>
    </div>
    <button class="intro-skip" type="button" @click="finishIntro">Skip intro <span aria-hidden="true">↗</span></button>
  </div>
  <SiteHeader />
  <main id="main"><RouterView v-slot="{ Component }"><Transition name="page" mode="out-in"><component :is="Component" /></Transition></RouterView></main>
  <SiteFooter />
</template>
