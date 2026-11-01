<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { profile } from '../../data/profile'
import { safePixelRatio, supportsWebGL } from '../../utils/webgl'
import { ArrowUpRight } from 'lucide-vue-next'
const mount=ref<HTMLElement|null>(null)
const index=ref(0)
const selected=computed(()=>profile.skills[index.value]!)
let scene:THREE.Scene|undefined,renderer:THREE.WebGLRenderer|undefined,camera:THREE.PerspectiveCamera|undefined
let group:THREE.Group|undefined,ro:ResizeObserver|undefined,io:IntersectionObserver|undefined,frame=0,visible=true,dead=false
let forms:THREE.Mesh[]=[]
const ready=ref(false)
const places=[[-3.2,1.35,0],[-1.4,1.85,-1],[1.05,1.0,-.8],[3.25,1.35,-.4],[-3.0,-1.55,0],[-.4,-1.45,-.3],[2.65,-1.45,.3]]
function choose(i:number){index.value=i}
function init(){
  if(!mount.value||!supportsWebGL())return
  try{
    const w=Math.max(1,mount.value.clientWidth),h=Math.max(1,mount.value.clientHeight)
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(40,w/h,.1,60);camera.position.z=12
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:window.innerWidth>850,powerPreference:'low-power'})
    renderer.setPixelRatio(safePixelRatio());renderer.setSize(w,h);renderer.setClearColor(0,0);mount.value.appendChild(renderer.domElement)
    scene.add(new THREE.AmbientLight(0xd0c1a8,1.1));const light=new THREE.PointLight(0xe8c28e,120);light.position.set(2,5,6);scene.add(light)
    group=new THREE.Group();scene.add(group)
    const shapes=[new THREE.IcosahedronGeometry(.62,1),new THREE.OctahedronGeometry(.7),new THREE.DodecahedronGeometry(.6),new THREE.TorusKnotGeometry(.42,.13,84,8,2,3),new THREE.TorusGeometry(.64,.13,8,42),new THREE.SphereGeometry(.58,16,12),new THREE.BoxGeometry(.92,.92,.92)]
    for(let i=0;i<profile.skills.length;i++){
      const geo=shapes[i]!
      const mat=new THREE.MeshStandardMaterial({color:i===0?0xd1b18b:0x8da99c,metalness:.65,roughness:.28,wireframe:i===3,transparent:true,opacity:.88})
      const mesh=new THREE.Mesh(geo,mat);mesh.position.set(...(places[i]! as [number,number,number]));mesh.userData.index=i;group.add(mesh);forms.push(mesh)
      const halo=new THREE.Mesh(new THREE.TorusGeometry(.89,.008,3,48),new THREE.MeshBasicMaterial({color:0xcbb691,transparent:true,opacity:.25}))
      halo.position.copy(mesh.position);halo.rotation.x=.8;group.add(halo)
    }
    const linePoints=places.map(p=>new THREE.Vector3(...(p as [number,number,number])))
    const lineGeo=new THREE.BufferGeometry().setFromPoints(linePoints)
    group.add(new THREE.Line(lineGeo,new THREE.LineBasicMaterial({color:0x718981,transparent:true,opacity:.28})))
    renderer.domElement.addEventListener('click',onClick)
    ro=new ResizeObserver(()=>{if(!mount.value||!camera||!renderer)return;const wi=Math.max(mount.value.clientWidth,1),he=Math.max(mount.value.clientHeight,1);camera.aspect=wi/he;camera.updateProjectionMatrix();renderer.setSize(wi,he);renderer.setPixelRatio(safePixelRatio())});ro.observe(mount.value)
    io=new IntersectionObserver(e=>{visible=Boolean(e[0]?.isIntersecting)});io.observe(mount.value)
    ready.value=true;tick()
  }catch(e){console.warn('Skills visual fallback enabled.',e);destroy()}
}
function onClick(e:MouseEvent){if(!renderer||!camera)return;const r=renderer.domElement.getBoundingClientRect(),p=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(p,camera);const hit=ray.intersectObjects(forms)[0];if(hit)choose(Number(hit.object.userData.index))}
function tick(){if(dead)return;frame=requestAnimationFrame(tick);if(!renderer||!scene||!camera||!group||!visible||document.hidden)return
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  forms.forEach((f,i)=>{if(!reduced){f.rotation.y+=i===index.value?.006:.002;f.rotation.x+=.002}const s=i===index.value?1.2:.84;f.scale.lerp(new THREE.Vector3(s,s,s),.055);const m=f.material as THREE.MeshStandardMaterial;m.emissive.setHex(i===index.value?0x463521:0x000000)})
  renderer.render(scene,camera)
}
function destroy(){dead=true;cancelAnimationFrame(frame);ro?.disconnect();io?.disconnect();renderer?.domElement.removeEventListener('click',onClick);scene?.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){o.geometry.dispose();const m=Array.isArray(o.material)?o.material:[o.material];m.forEach(x=>x.dispose())}});renderer?.dispose();renderer?.domElement.remove()}
onMounted(init);onUnmounted(destroy)
</script>
<template>
  <div class="skills-experience">
    <div class="skill-sculpture" ref="mount"><span class="orbital-label orbital-label-1">STRUCTURE / FORM</span><span class="orbital-label orbital-label-2">DIGITAL CRAFT</span><span v-if="!ready" class="skills-orbit-fallback">✳</span></div>
    <div class="skill-detail">
      <div class="small-label">SELECT A DISCIPLINE <span>— {{ String(index+1).padStart(2,'0') }} / {{ String(profile.skills.length).padStart(2,'0') }}</span></div>
      <div class="skill-selector" role="group" aria-label="Select a skill"><button v-for="(skill,i) in profile.skills" :key="skill.id" type="button" :aria-pressed="i===index" :class="{selected:i===index}" @click="choose(i)">{{ skill.name }} <span v-if="i===index">↗</span></button></div>
      <div class="skill-copy" aria-live="polite"><span>{{ selected.label }}</span><h3>{{ selected.name }}</h3><p>{{ selected.description }}</p><RouterLink :to="`/project/${selected.related}`">View a related study <ArrowUpRight :size="17" /></RouterLink></div>
    </div>
  </div>
</template>
