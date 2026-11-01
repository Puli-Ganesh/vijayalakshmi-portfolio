<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import { ArrowUpRight, Expand, RotateCcw, Sun, Moon, Move3D, Maximize2 } from 'lucide-vue-next'
import { createSpatialScene, type SceneMode, type SpatialWorld } from '../../scenes/createSpatialScene'
import { safePixelRatio, supportsWebGL } from '../../utils/webgl'
const props = withDefaults(defineProps<{ mode?: SceneMode; compact?: boolean }>(), { mode:'interior', compact:false })
const container=ref<HTMLElement|null>(null)
const webgl=ref(true)
const error=ref('')
const selected=ref('Move around to explore the details')
const exploded=ref(false)
const night=ref(false)
const activeView=ref('Isometric')
let world:SpatialWorld|undefined
let renderer:THREE.WebGLRenderer|undefined
let camera:THREE.PerspectiveCamera|undefined
let controls:OrbitControls|undefined
let observer:ResizeObserver|undefined
let viewportObserver:IntersectionObserver|undefined
let raf=0,visible=true,disposed=false
let startDrag={x:0,y:0}
let currentHighlight:THREE.Mesh|undefined
let originalHighlightMaterial:THREE.MeshStandardMaterial|undefined
const originalLocations=new Map<THREE.Group,THREE.Vector3>()
const views={ Isometric:[12,10,15], Front:[.1,6,16], Top:[.01,22,.01], Detail:[5,5,7] } as const
const viewNames = Object.keys(views) as (keyof typeof views)[]
function moveCamera(view:keyof typeof views) {
  if(!camera||!controls)return
  activeView.value=view
  const [x,y,z]=views[view]
  gsap.to(camera.position,{x,y,z,duration:1.35,ease:'power3.inOut',overwrite:true,onUpdate:()=>controls?.update()})
  gsap.to(controls.target,{x:0,y:1.25,z:0,duration:1.35,ease:'power3.inOut',overwrite:true})
}
function explode() {
  exploded.value=!exploded.value
  world?.groups.forEach((g,i)=>{
    const origin=originalLocations.get(g)
    if(!origin)return
    const delta=exploded.value ? new THREE.Vector3((i-2)*1.15,i*.70,(i%2===0 ? -.45 : .65)) : new THREE.Vector3()
    gsap.to(g.position,{x:origin.x+delta.x,y:origin.y+delta.y,z:origin.z+delta.z,duration:1.18,ease:'power3.inOut',overwrite:true})
  })
  selected.value=exploded.value ? 'Exploded assembly — structural layers separated' : 'Assembled spatial study'
}
function lights() {
  night.value=!night.value
  if(!world)return
  world.scene.background=new THREE.Color(night.value ? 0x0a111b : (props.mode==='interior' ? 0x172321 : 0x192526))
  world.scene.fog=new THREE.Fog(world.scene.background as THREE.Color,17,36)
  gsap.to(world.lights.sun,{intensity:night.value ? .24 : 3,duration:.8})
  gsap.to(world.lights.warm,{intensity:night.value ? 31 : props.mode==='interior' ? 18 : 7,duration:.8})
}
function reset() {
  if(exploded.value)explode()
  if(night.value)lights()
  moveCamera('Isometric')
  selected.value='Move around to explore the details'
}
function clickCanvas(event:PointerEvent) {
  if(!renderer||!camera||!container.value||!world)return
  if(Math.hypot(event.clientX-startDrag.x,event.clientY-startDrag.y)>5)return
  const bounds=renderer.domElement.getBoundingClientRect()
  const point=new THREE.Vector2(((event.clientX-bounds.left)/bounds.width)*2-1,-((event.clientY-bounds.top)/bounds.height)*2+1)
  const ray=new THREE.Raycaster();ray.setFromCamera(point,camera)
  const hits=ray.intersectObjects(world.groups,true)
  if(currentHighlight && originalHighlightMaterial){
    (currentHighlight.material as THREE.Material).dispose(); currentHighlight.material=originalHighlightMaterial
    currentHighlight=undefined; originalHighlightMaterial=undefined
  }
  const hit=hits.find(h=>h.object.userData.label)
  if(hit){selected.value=String(hit.object.userData.label);if(hit.object instanceof THREE.Mesh && hit.object.material instanceof THREE.MeshStandardMaterial) {
    // Clone once per selection so shared materials of other objects remain unchanged.
    originalHighlightMaterial=hit.object.material
    hit.object.material=hit.object.material.clone();hit.object.material.emissive.set(0x594326)
    currentHighlight=hit.object
  }}
}
function down(e:PointerEvent){startDrag={x:e.clientX,y:e.clientY}}
function tick(){
  if(disposed)return
  raf=requestAnimationFrame(tick)
  if(!visible||document.hidden||!renderer||!world||!camera)return
  controls?.update();renderer.render(world.scene,camera)
}
function setup(){
  if(!container.value||!supportsWebGL()){webgl.value=false;error.value='WebGL is unavailable on this device.';return}
  try{
    const w=Math.max(container.value.clientWidth,1),h=Math.max(container.value.clientHeight,1)
    world=createSpatialScene(props.mode)
    camera=new THREE.PerspectiveCamera(38,w/h,.15,80);camera.position.set(...views.Isometric)
    renderer=new THREE.WebGLRenderer({antialias:window.innerWidth>750,alpha:false,powerPreference:'high-performance'})
    renderer.setPixelRatio(safePixelRatio());renderer.setSize(w,h)
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap
    renderer.domElement.style.touchAction='pan-y'
    renderer.domElement.setAttribute('aria-label','Interactive 3D spatial study; use drag to orbit and wheel or pinch to zoom')
    container.value.appendChild(renderer.domElement)
    controls=new OrbitControls(camera,renderer.domElement)
    controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=6;controls.maxDistance=30;controls.maxPolarAngle=Math.PI*.49;controls.target.set(0,1.25,0);controls.enablePan=false
    controls.enableZoom=true;controls.update()
    world.groups.forEach(g=>originalLocations.set(g,g.position.clone()))
    renderer.domElement.addEventListener('pointerdown',down)
    renderer.domElement.addEventListener('pointerup',clickCanvas)
    observer=new ResizeObserver(()=>{
      if(!container.value||!renderer||!camera)return
      const width=Math.max(container.value.clientWidth,1),height=Math.max(container.value.clientHeight,1)
      camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);renderer.setPixelRatio(safePixelRatio())
    });observer.observe(container.value)
    viewportObserver=new IntersectionObserver((entries)=>visible=Boolean(entries[0]?.isIntersecting))
    viewportObserver.observe(container.value)
    tick()
  }catch(e){webgl.value=false;error.value='Interactive 3D could not start; the portfolio still works.';console.warn(error.value,e);cleanup()}
}
function cleanup(){
  disposed=true;cancelAnimationFrame(raf);observer?.disconnect();viewportObserver?.disconnect()
  if(camera)gsap.killTweensOf(camera.position);if(controls)gsap.killTweensOf(controls.target)
  world?.groups.forEach(g=>gsap.killTweensOf(g.position))
  if(currentHighlight && originalHighlightMaterial){(currentHighlight.material as THREE.Material).dispose();currentHighlight.material=originalHighlightMaterial}
  if(world){gsap.killTweensOf(world.lights.sun);gsap.killTweensOf(world.lights.warm);world.scene.traverse(obj=>{
    if(obj instanceof THREE.Mesh){obj.geometry.dispose();if(!world?.allMaterials.includes(obj.material as THREE.Material)){const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose())}}})
    world.allMaterials.forEach(m=>m.dispose())
  }
  controls?.dispose();renderer?.domElement.removeEventListener('pointerdown',down);renderer?.domElement.removeEventListener('pointerup',clickCanvas)
  renderer?.dispose();renderer?.domElement.remove()
}
onMounted(setup)
onUnmounted(cleanup)
</script>
<template>
  <div class="studio-panel" :class="{ 'studio-compact': compact }">
    <div class="studio-topbar"><div class="studio-eyebrow"><span class="live-dot"></span> INTERACTIVE 3D / {{ mode === 'interior' ? 'SPATIAL STUDIO' : 'STRUCTURAL STUDY' }}</div><span class="studio-top-right">ORIGINAL PROCEDURAL DEMO <ArrowUpRight :size="14" /></span></div>
    <div class="studio-stage" ref="container">
      <div v-if="!webgl" class="studio-fallback"><div class="fallback-grid"></div><div class="fallback-shape">⌑</div><h3>Architectural study</h3><p>{{ error }}</p><p>The rest of the portfolio remains available.</p></div>
      <div v-if="webgl" class="scene-hint">DRAG TO ORBIT <span>·</span> SCROLL TO ZOOM <span>·</span> TAP AN OBJECT</div>
      <div class="scene-coordinates">X 04.52<br />Y 12.30<br />Z 01.47</div>
    </div>
    <div class="studio-controls">
      <div class="view-selector" aria-label="3D camera views"><button v-for="v in viewNames" :key="v" :class="{chosen:activeView===v}" type="button" @click="moveCamera(v)" :disabled="!webgl">{{ v }}</button></div>
      <div class="scene-buttons">
        <button type="button" :aria-pressed="exploded" :disabled="!webgl" @click="explode" :title="exploded?'Assemble model':'Explode model'"><Move3D :size="16" /><span>{{ exploded ? 'Assemble' : 'Explode' }}</span></button>
        <button type="button" :aria-pressed="night" :disabled="!webgl" @click="lights" :title="night?'Day lighting':'Night lighting'"><Sun v-if="night" :size="16" /><Moon v-else :size="16" /><span>{{ night ? 'Day' : 'Night' }}</span></button>
        <button type="button" :disabled="!webgl" @click="reset" title="Reset camera and scene"><RotateCcw :size="16" /><span>Reset</span></button>
      </div>
    </div>
    <div class="studio-status"><span><Expand :size="13" /> {{ selected }}</span><span><Maximize2 :size="13" /> VIEWPORT / REAL-TIME</span></div>
  </div>
</template>
