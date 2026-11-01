<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ArrowUpRight, ArrowRight, Download } from 'lucide-vue-next'
import { profile, renderImages } from '../data/profile'
import ProjectArtwork from '../components/ProjectArtwork.vue'
import SpatialStudio from '../components/three/SpatialStudio.vue'
import RenderGallery from '../components/RenderGallery.vue'

const route = useRoute()
const project = computed(() => profile.projects.find(p => p.slug === route.params.slug))
const next = computed(() => {
  const index = profile.projects.findIndex(p => p.slug === project.value?.slug)
  return index === -1 ? undefined : profile.projects[(index + 1) % profile.projects.length]
})
function scrollUp() { window.scrollTo({ top: 0, behavior: 'auto' }) }
onMounted(scrollUp)
watch(() => route.params.slug, scrollUp)
</script>

<template>
  <div v-if="project" class="project-detail" :class="{ 'render-detail': project.type === 'render' }">
    <div class="container project-detail-intro">
      <RouterLink class="back-to-work" to="/#work"><ArrowLeft :size="16" /> BACK TO SELECTED WORK</RouterLink>
      <div class="project-detail-meta"><span>{{ project.discipline }}</span><span>{{ project.number }} / {{ String(profile.projects.length).padStart(2,'0') }} — {{ project.year }}</span></div>
      <h1>{{ project.title }}<br /><em>{{ project.subtitle }}</em></h1>
      <div class="detail-summary"><p>{{ project.summary }}</p><span>{{ project.type==='render' ? 'ORIGINAL VISUAL WORK / 2026' : 'AN ACADEMIC STUDY' }}</span></div>
    </div>

    <div v-if="project.type==='render'" class="render-detail-cover">
      <img :src="renderImages[0].src" :alt="renderImages[0].caption" width="2048" height="1152" fetchpriority="high" />
      <div class="render-detail-cover-caption"><span>RESIDENTIAL VISUALIZATIONS</span><span>01 / 05 — {{ renderImages[0].title }}</span></div>
    </div>
    <div v-else class="project-full-art"><ProjectArtwork :type="project.type === 'structure' ? 'structure' : 'landscape'" :detail="true" /></div>

    <div class="container project-analysis">
      <div class="analysis-side"><span>01 / OVERVIEW</span><h2>{{ project.type === 'render' ? 'Exploring' : 'Understanding' }}<br /><em>{{ project.type === 'render' ? 'the space.' : 'the process.' }}</em></h2></div>
      <div><p class="analysis-lead">{{ project.overview }}</p><div class="process-list"><div v-for="(step,i) in project.processes" :key="step"><span>{{ String(i+1).padStart(2,'0') }}</span><span>{{ step }}</span><ArrowUpRight :size="16" /></div></div></div>
    </div>

    <div v-if="project.type==='render'" class="render-visual-section">
      <div class="container">
        <div class="render-chapter-line"><span>02 / ORIGINAL RENDER COLLECTION</span><span>SELECT AN IMAGE TO EXPLORE</span></div>
        <RenderGallery />
      </div>
    </div>
    <section v-else-if="project.type==='structure'" class="project-study-demo"><div class="container"><div class="demo-heading"><span>02 / INTERACTIVE EXPLORATION</span><h2>Read the <em>structure.</em></h2><p>Illustrative interactive 3D structural frame. This is a procedural demonstration inspired by the subject of the project, not a reconstruction of the original Revit model.</p></div><SpatialStudio mode="structure" compact /></div></section>
    <div v-else class="container dam-notes"><div><span>02 / DESIGN APPROACH</span><h2>Designed for<br /><em>water, land & people.</em></h2></div><p>Seasonal rainfall and stream collection, irrigation needs, and groundwater recharge form the foundation of the academic proposal. The diagram above is illustrative; no original field photographs, survey data or drawing sheets were supplied.</p></div>

    <div class="container project-disclaimer"><span>MEDIA NOTE</span><p>{{ project.visualDisclaimer }}</p></div>
    <div class="container project-next"><span>CONTINUE EXPLORING</span><RouterLink v-if="next" :to="`/project/${next.slug}`"><span>{{ next.title }}<em>{{ next.subtitle }}</em></span><ArrowRight :size="36" /></RouterLink><a :href="profile.resume" download>VIEW ORIGINAL CV <Download :size="18" /></a></div>
  </div>
  <div v-else class="missing-project"><span>404 / NOT FOUND</span><h1>This study does not exist.</h1><RouterLink to="/#work">Explore selected work <ArrowUpRight :size="19" /></RouterLink></div>
</template>
