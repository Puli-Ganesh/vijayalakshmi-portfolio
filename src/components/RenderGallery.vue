<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, Expand, X, MoveUpRight } from 'lucide-vue-next'
import { renderImages } from '../data/profile'

const tabs = ['ALL', 'EXTERIOR', 'INTERIOR'] as const
const activeIndex = ref<number | null>(null)
const category = ref<'ALL' | 'EXTERIOR' | 'INTERIOR'>('ALL')
const closeButton = ref<HTMLButtonElement | null>(null)
let priorFocus: HTMLElement | null = null
let priorBodyOverflow = ''
const selected = computed(() => activeIndex.value === null ? undefined : renderImages[activeIndex.value])
const visible = computed(() => renderImages.filter(image => category.value === 'ALL' || (category.value === 'EXTERIOR' ? image.category !== 'INTERIOR' : image.category === 'INTERIOR')))
function openImage(id: string) {
  const index = renderImages.findIndex(item => item.id === id)
  if (index === -1) return
  priorFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  activeIndex.value = index
}
function closeImage() { activeIndex.value = null }
function changeImage(direction: number) {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value + direction + renderImages.length) % renderImages.length
}
function handleKeydown(event: KeyboardEvent) {
  if (activeIndex.value === null) return
  if (event.key === 'Escape') { event.preventDefault(); closeImage() }
  if (event.key === 'ArrowLeft') { event.preventDefault(); changeImage(-1) }
  if (event.key === 'ArrowRight') { event.preventDefault(); changeImage(1) }
  // Keep keyboard focus inside the image viewer.
  if (event.key === 'Tab') {
    const controls = Array.from(document.querySelectorAll<HTMLElement>('.visual-lightbox button:not([disabled])'))
    const first = controls[0], last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
}
watch(activeIndex, async (index, oldIndex) => {
  if (index !== null && oldIndex === null) {
    priorBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    closeButton.value?.focus()
  } else if (index === null && oldIndex !== null) {
    document.body.style.overflow = priorBodyOverflow
    await nextTick()
    priorFocus?.focus()
  }
})
onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => { document.removeEventListener('keydown', handleKeydown); if (activeIndex.value !== null) document.body.style.overflow = priorBodyOverflow })
</script>

<template>
  <section class="render-gallery" aria-label="Residential visualization image gallery">
    <div class="render-gallery-tools">
      <div><span class="work-tiny-label">VISUAL ESSAYS / 2026</span><h2>Five perspectives.<br /><em>One visual collection.</em></h2></div>
      <div class="gallery-tabs" role="group" aria-label="Filter renders">
        <button v-for="tab in tabs" :key="tab" type="button" :class="{active:category===tab}" :aria-pressed="category===tab" @click="category=tab">{{ tab === 'ALL' ? 'ALL VIEWS' : tab }}</button>
      </div>
    </div>
    <div class="render-gallery-grid">
      <figure v-for="(image,index) in visible" :key="image.id" class="render-gallery-item" :class="`gallery-item-${image.id}`">
        <button type="button" class="render-image-button" :aria-label="`Open full-screen render: ${image.title}`" @click="openImage(image.id)">
          <img :src="image.src" :alt="image.caption" loading="lazy" decoding="async" width="2048" height="1152" />
          <span class="render-image-zoom"><Expand :size="19" /> VIEW FULLSCREEN</span>
        </button>
        <figcaption><span>{{ String(index+1).padStart(2,'0') }} / {{ image.category }}</span><strong>{{ image.title }}</strong><p>{{ image.caption }}</p></figcaption>
      </figure>
    </div>
    <p class="render-gallery-credit">ORIGINAL VISUAL WORK · IMAGES PROVIDED BY VIJAYALAXMI MASUTI · ENSCAPE RENDERS</p>
  </section>

  <Teleport to="body">
    <div v-if="selected" class="visual-lightbox" role="dialog" aria-modal="true" :aria-label="`Fullscreen render: ${selected.title}`" @click.self="closeImage">
      <div class="lightbox-top"><span>VM / VISUAL ARCHIVE — {{ String((activeIndex ?? 0)+1).padStart(2,'0') }} / {{ renderImages.length.toString().padStart(2,'0') }}</span><button ref="closeButton" type="button" class="lightbox-close" aria-label="Close image viewer" @click="closeImage"><X :size="22" /><span>CLOSE</span></button></div>
      <div class="lightbox-stage"><button type="button" class="lightbox-arrow" aria-label="Previous image" @click="changeImage(-1)"><ArrowLeft :size="25" /></button><img :key="selected.id" :src="selected.src" :alt="selected.caption" width="2048" height="1152" /><button type="button" class="lightbox-arrow" aria-label="Next image" @click="changeImage(1)"><ArrowRight :size="25" /></button></div>
      <div class="lightbox-bottom"><div><span>{{ selected.category }} / ENSCAPE</span><h3>{{ selected.title }}</h3><p>{{ selected.caption }}</p></div><div class="lightbox-number"><span>USE ← → KEYS TO EXPLORE</span><MoveUpRight :size="20" /></div></div>
    </div>
  </Teleport>
</template>
