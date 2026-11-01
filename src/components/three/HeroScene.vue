<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { safePixelRatio, supportsWebGL } from '../../utils/webgl'
const root = ref<HTMLElement | null>(null)
const supported = ref(true)
let renderer: THREE.WebGLRenderer | undefined
let scene: THREE.Scene | undefined
let camera: THREE.PerspectiveCamera | undefined
let frame = 0
let observer: ResizeObserver | undefined
let visibility = true
let viewportObserver: IntersectionObserver | undefined
let pointer = { x: 0, y: 0 }
let sculpture: THREE.Group | undefined
let disposed = false
const noMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
function move(e: PointerEvent) {
  pointer = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 }
}
function create() {
  if (!root.value || !supportsWebGL()) { supported.value = false; return }
  try {
    const width = root.value.clientWidth, height = root.value.clientHeight
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(34, width / Math.max(height, 1), .1, 200)
    camera.position.set(0, 2.5, 15)
    renderer = new THREE.WebGLRenderer({ antialias: window.innerWidth > 850, alpha: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(safePixelRatio())
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    root.value.appendChild(renderer.domElement)
    scene.add(new THREE.AmbientLight(0xb5a789, 1.1))
    const key = new THREE.DirectionalLight(0xd9b88f, 2.8); key.position.set(4, 8, 8); scene.add(key)
    sculpture = new THREE.Group(); scene.add(sculpture)
    const thin = new THREE.MeshBasicMaterial({ color: 0x8a9b89, wireframe: true, transparent: true, opacity: .16, depthWrite: false })
    const metal = new THREE.MeshStandardMaterial({ color: 0x8e8876, metalness: .82, roughness: .35, transparent: true, opacity: .3 })
    for (let i = 0; i < 13; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(.13, 2.5 + i * .1, .13), i % 4 === 0 ? metal : thin)
      bar.position.set((i % 5 - 2) * 1.7, .4 + i * .06, Math.floor(i / 5) * -1.55)
      sculpture.add(bar)
    }
    for (let i = 0; i < 5; i++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(9.2, .05, 4.3), thin)
      slab.position.y = -1.1 + i * 1.17
      sculpture.add(slab)
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.35, .013, 3, 160), new THREE.MeshBasicMaterial({ color: 0xc9a984, transparent: true, opacity: .23 }))
    ring.rotation.x = Math.PI * .22; ring.rotation.y = .3; ring.position.set(1.3,.7, -1); sculpture.add(ring)
    const grid = new THREE.GridHelper(33, 28, 0x8c877a, 0x4a655d); (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = .13; grid.position.y = -2.1; scene.add(grid)
    const starsGeometry = new THREE.BufferGeometry()
    const coords = new Float32Array(110 * 3)
    for (let i=0;i<110;i++) { coords[i*3] = (Math.random()-.5)*20; coords[i*3+1]=(Math.random()-.5)*11; coords[i*3+2]=-5-Math.random()*5 }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(coords,3))
    scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color:0xd2bd9b, size:.03, transparent:true, opacity:.48 })))
    observer = new ResizeObserver(() => {
      if (!root.value || !renderer || !camera) return
      const w = Math.max(root.value.clientWidth, 1), h = Math.max(root.value.clientHeight,1)
      camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); renderer.setPixelRatio(safePixelRatio())
    })
    observer.observe(root.value)
    viewportObserver = new IntersectionObserver(entries => { visibility = Boolean(entries[0]?.isIntersecting) }, { threshold:0 })
    viewportObserver.observe(root.value)
    window.addEventListener('pointermove', move, { passive:true })
    tick()
  } catch (e) { console.warn('3D hero unavailable; static composition remains.', e); supported.value=false; dispose() }
}
function tick() {
  if (disposed) return
  frame = requestAnimationFrame(tick)
  if (!renderer || !camera || !scene || !sculpture || !visibility || document.hidden) return
  if (!noMotion()) { sculpture.rotation.y += (pointer.x * .075 - sculpture.rotation.y) * .025; sculpture.rotation.x += (-pointer.y*.035 - sculpture.rotation.x)*.025 }
  renderer.render(scene,camera)
}
function dispose() {
  disposed=true; cancelAnimationFrame(frame); observer?.disconnect(); viewportObserver?.disconnect(); window.removeEventListener('pointermove', move)
  scene?.traverse((obj) => { if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) { obj.geometry.dispose(); const mats = Array.isArray(obj.material) ? obj.material : [obj.material]; mats.forEach(m => m.dispose()) } })
  renderer?.dispose(); renderer?.domElement.remove(); renderer=undefined
}
onMounted(create)
onUnmounted(dispose)
</script>
<template><div ref="root" class="hero-three" aria-hidden="true"><div v-if="!supported" class="hero-lines-fallback"></div></div></template>
