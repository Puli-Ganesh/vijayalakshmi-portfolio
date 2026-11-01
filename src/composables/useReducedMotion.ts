import { onMounted, onUnmounted, ref } from 'vue'
export function useReducedMotion() {
  const reducedMotion = ref(false)
  let media: MediaQueryList | undefined
  const update = () => { reducedMotion.value = Boolean(media?.matches) }
  onMounted(() => { media = window.matchMedia('(prefers-reduced-motion: reduce)'); update(); media.addEventListener('change', update) })
  onUnmounted(() => media?.removeEventListener('change', update))
  return reducedMotion
}
