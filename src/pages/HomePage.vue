<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowUpRight, ArrowDown, Download, MoveUpRight, ExternalLink, MousePointer2, Crosshair, ArrowRight, FileDown } from 'lucide-vue-next'
import { profile, renderImages } from '../data/profile'
import HeroScene from '../components/three/HeroScene.vue'
import SpatialStudio from '../components/three/SpatialStudio.vue'
import SkillsConstellation from '../components/three/SkillsConstellation.vue'
import ProjectArtwork from '../components/ProjectArtwork.vue'

gsap.registerPlugin(ScrollTrigger)
let lenis: Lenis | undefined
let ctx: gsap.Context | undefined
let ticker: ((time:number)=>void) | undefined
const hoverX=ref(50),hoverY=ref(50),reveal=ref(false)
const showCursor=ref(false)
const pointerX=ref(0),pointerY=ref(0)
function onPortraitMove(e:PointerEvent){const r=(e.currentTarget as HTMLElement).getBoundingClientRect();hoverX.value=(e.clientX-r.left)/r.width*100;hoverY.value=(e.clientY-r.top)/r.height*100}
function pointerMove(e:PointerEvent){pointerX.value=e.clientX;pointerY.value=e.clientY}
function scrollToId(id:string){document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
onMounted(async()=>{
  await nextTick()
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if(!reduce){
    lenis=new Lenis({duration:1.08, smoothWheel:true, touchMultiplier:1.2})
    lenis.on('scroll',ScrollTrigger.update)
    ticker=(t:number)=>lenis?.raf(t*1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)
    ctx=gsap.context(()=>{
      gsap.from('.hero-reveal',{y:42,opacity:0,stagger:.12,duration:1.1,ease:'power3.out',delay:.3})
      document.querySelectorAll('[data-reveal]').forEach(el=>{gsap.from(el,{y:45,opacity:0,duration:.95,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 87%',once:true}})})
      gsap.to('.hero-giant-word',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}})
      gsap.to('.about-graphic-ring',{rotation:42,ease:'none',scrollTrigger:{trigger:'.about',start:'top bottom',end:'bottom top',scrub:true}})
    })
  }
  showCursor.value=window.matchMedia('(pointer:fine)').matches
  if(showCursor.value)window.addEventListener('pointermove',pointerMove,{passive:true})
  if(window.location.hash){window.setTimeout(()=>{const id=decodeURIComponent(window.location.hash.slice(1));document.getElementById(id)?.scrollIntoView({behavior:'auto'})},150)}
})
onUnmounted(()=>{ctx?.revert();if(ticker)gsap.ticker.remove(ticker);lenis?.destroy();window.removeEventListener('pointermove',pointerMove);ScrollTrigger.getAll().forEach(t=>t.kill())})
</script>
<template>
  <div class="home">
    <section id="home" class="hero" aria-labelledby="hero-name">
      <HeroScene />
      <div class="hero-ambient hero-ambient-left"></div><div class="hero-ambient hero-ambient-right"></div>
      <div class="container hero-layout">
        <div class="hero-content">
          <div class="hero-eyebrow hero-reveal"><span class="eyebrow-line"></span> PORTFOLIO / 2026 <span class="hero-eyebrow-divider">—</span> CIVIL ENGINEERING + DESIGN</div>
          <h1 id="hero-name" class="hero-title hero-giant-word"><span class="hero-reveal">VIJAYA</span><span class="hero-reveal">LAXMI<span class="title-period">.</span></span></h1>
          <div class="hero-sub hero-reveal"><div class="line-diamond">✳</div><h2>{{ profile.headline }}</h2></div>
          <p class="hero-description hero-reveal">{{ profile.introduction }}</p>
          <div class="hero-actions hero-reveal"><button class="btn-cream" type="button" @click="scrollToId('work')">Explore selected work <ArrowUpRight :size="17" /></button><a class="btn-underlined" :href="profile.resume" download>Download CV <Download :size="16" /></a></div>
        </div>
        <div class="hero-visual">
          <div class="portrait-orbit orbit-a"></div><div class="portrait-orbit orbit-b"></div>
          <div class="portrait-caption-top">FIG. 01 <span> / </span> THE DESIGNER</div>
          <div class="portrait-frame" @pointermove="onPortraitMove" @pointerenter="reveal=true" @pointerleave="reveal=false" @click="reveal=!reveal" :style="{ '--x': `${hoverX}%`, '--y': `${hoverY}%`, '--reveal-opacity': reveal?'1':'0' }" aria-label="Portrait of Vijayalaxmi Masuti. Move pointer or tap to reveal architectural wireframes.">
            <img :src="profile.portrait" :alt="`Portrait of ${profile.fullName}`" fetchpriority="high" />
            <div class="portrait-vignette"></div>
            <div class="portrait-reveal"><div class="reveal-architecture"><svg viewBox="0 0 500 620" aria-hidden="true"><g fill="none" stroke="#e3cd9e" stroke-width="1.2"><path d="M60 562V162L238 58L422 163V563L238 460Z"/><path d="M60 162L238 266L422 163M238 266V460M238 58V266M60 335L238 437L422 336M60 447L238 547L422 447M130 204V502M350 206V500"/><path d="M60 162L238 58L422 163M115 134L238 205L363 134M105 284L238 360L368 287" stroke-dasharray="5 7"/><rect x="163" y="301" width="76" height="134"/><circle cx="341" cy="293" r="32"/><path d="M60 562L17 590M422 563L477 596M238 460V599"/></g></svg></div><div class="reveal-tag">FORM / STRUCTURE / HUMAN</div></div>
          </div>
          <div class="portrait-bottom-label"><span>VM — 001</span><span>MOVE TO DISCOVER <Crosshair :size="14" /></span></div>
        </div>
      </div>
      <div class="hero-bottom container"><button type="button" class="scroll-cue" @click="scrollToId('about')"><span class="scroll-dot"><ArrowDown :size="17" /></span> SCROLL TO EXPLORE</button><div class="hero-meta">BASED IN BENGALURU, INDIA <span>/</span> OPEN TO RELOCATE <span class="meta-index">01—06</span></div></div>
      <div v-if="showCursor && reveal" class="portrait-custom-pointer" :style="{transform:`translate(${pointerX}px, ${pointerY}px)`}"><MousePointer2 :size="14" /></div>
    </section>

    <section id="about" class="about section-padded" aria-labelledby="about-title">
      <div class="container">
        <div class="section-topline" data-reveal><span>01 / THE PERSPECTIVE</span><span>THOUGHTFUL SPACES BEGIN WITH THINKING</span></div>
        <div class="about-grid">
          <div class="about-heading" data-reveal><p class="kicker"><span class="kicker-square"></span> THE APPROACH</p><h2 id="about-title" class="editorial-heading">Not just<br />how it <em>looks.</em><br />How it <em>works.</em></h2><div class="about-graphic-ring"><div class="ring-inner">FORM<br />+<br />FUNCTION</div></div></div>
          <div class="about-copy" data-reveal><span class="large-quote">“</span><p class="about-lead">I see every space as a conversation between <em>structure</em>, <em>purpose</em>, and the people who use it.</p><p>{{ profile.bio }}</p><p>My goal is to carry that technical foundation into interior design — creating environments that feel considered, useful and enduring.</p><div class="signature-block"><span>VIJAYALAXMI MASUTI</span><span>CIVIL ENGINEER / DESIGN ENTHUSIAST</span></div><a class="text-link" :href="profile.resume" download>Get to know my background <ArrowUpRight :size="18" /></a></div>
        </div>
      </div>
    </section>

    <section id="expertise" class="expertise section-padded" aria-labelledby="expertise-title">
      <div class="container">
        <div class="section-topline top-dark" data-reveal><span>02 / THE TOOLKIT</span><span>IDEAS WITH A TECHNICAL FOUNDATION</span></div>
        <div class="expertise-head" data-reveal><div><p class="kicker"><span class="kicker-square"></span> SKILLS & TOOLS</p><h2 id="expertise-title" class="editorial-heading">The art of<br /><em>understanding</em> space.</h2></div><p>From initial linework to spatial modelling — the methods behind my thinking.</p></div>
        <SkillsConstellation />
      </div>
    </section>

    <section id="work" class="work section-padded" aria-labelledby="work-title">
      <div class="container">
        <div class="section-topline" data-reveal><span>03 / SELECTED STUDIES</span><span>ENGINEERING THINKING IN PRACTICE</span></div>
        <div class="work-heading" data-reveal><div><p class="kicker"><span class="kicker-square"></span> THE WORK</p><h2 id="work-title" class="editorial-heading">Ideas made<br /><em>tangible.</em></h2></div><p>A residential visualization collection and two academic civil engineering studies — different aspects of a growing design practice.</p></div>
        <article class="featured-work" data-reveal aria-labelledby="featured-work-title">
          <div class="featured-work-header"><div><span class="work-tiny-label">FEATURED / ORIGINAL VISUAL WORK</span><h3 id="featured-work-title">Residential <em>Spaces.</em></h3><p>Five Enscape renders: expressive exterior forms, landscaped perspectives and considered interior material palettes.</p></div><RouterLink class="featured-work-link" to="/project/residential-visuals">EXPLORE ALL FIVE VIEWS <ArrowUpRight :size="20" /></RouterLink></div>
          <RouterLink to="/project/residential-visuals" class="featured-main-image" aria-label="Explore Vijayalaxmi’s residential visualization collection"><img :src="renderImages[0].src" :alt="renderImages[0].caption" width="2048" height="1152" loading="lazy" /><div class="featured-main-image-overlay"><span>01 / ARCHITECTURAL VISUALISATION</span><span>OPEN THE PROJECT <ArrowUpRight :size="21" /></span></div></RouterLink>
          <div class="featured-preview-grid"><RouterLink v-for="image in renderImages.slice(1,4)" :key="image.id" to="/project/residential-visuals" :aria-label="`View ${image.title} in project`"><img :src="image.preview" :alt="image.caption" width="960" height="540" loading="lazy" /><span>{{ image.category }} — {{ image.title }}</span></RouterLink></div>
          <div class="featured-work-footer"><span>05 RENDERS / EXTERIOR · INTERIOR · LANDSCAPE</span><RouterLink to="/project/residential-visuals">VIEW COMPLETE COLLECTION <ArrowRight :size="18" /></RouterLink></div>
        </article>
        <div class="academic-work-heading" data-reveal><span>ACADEMIC WORK / STRUCTURE & WATER</span><p>Engineering studies</p></div>
        <div class="projects-list">
          <article v-for="project in profile.projects.filter(p=>p.type!=='render')" :key="project.slug" class="project-row" data-reveal>
            <RouterLink class="project-art-link" :to="`/project/${project.slug}`" :aria-label="`Explore ${project.title}`"><ProjectArtwork :type="project.type" /><span class="project-image-cta">EXPLORE PROJECT <MoveUpRight :size="18" /></span></RouterLink>
            <div class="project-info"><div class="project-num">{{ project.number }} / {{ String(profile.projects.length).padStart(2,'0') }} <span>{{ project.year }}</span></div><p class="project-discipline">{{ project.discipline }}</p><h3>{{ project.title }}<em>{{ project.subtitle }}</em></h3><p>{{ project.summary }}</p><RouterLink :to="`/project/${project.slug}`" class="project-open" :aria-label="`Open ${project.title} details`"><ArrowUpRight :size="28" /></RouterLink></div>
          </article>
        </div>
      </div>
    </section>

    <section class="studio-section section-padded" aria-labelledby="studio-title">
      <div class="container">
        <div class="section-topline top-dark" data-reveal><span>04 / INTERACTIVE LAB</span><span>SPATIAL EXPERIMENT NO. 001</span></div>
        <div class="studio-head" data-reveal><div><p class="kicker"><span class="kicker-square"></span> AN EXPERIMENT IN SPACE</p><h2 id="studio-title" class="editorial-heading">Step inside<br /><em>the idea.</em></h2></div><div class="studio-intro"><p>An explorable miniature interior built entirely in real-time 3D. Discover how light, arrangement, and materials shape a room.</p><span>CREATIVE CODING DEMONSTRATION — NOT A CLIENT PROJECT</span></div></div>
        <div data-reveal><SpatialStudio mode="interior" /></div>
        <div class="studio-description"><div><Crosshair :size="17" /><span>THINK IN VOLUMES, NOT JUST LINES.</span></div><p>Drag, inspect, switch views, separate the components and see how a model can communicate space.</p></div>
      </div>
    </section>

    <section id="journey" class="journey section-padded" aria-labelledby="journey-title">
      <div class="container"><div class="section-topline" data-reveal><span>05 / THE JOURNEY</span><span>FROM ENGINEERING TO INTERIOR DESIGN</span></div>
        <div class="journey-grid"><div class="journey-left" data-reveal><p class="kicker"><span class="kicker-square"></span> MY PATH</p><h2 id="journey-title" class="editorial-heading">Built on<br /><em>curiosity.</em><br />Grounded in<br />practice.</h2><p>A technical education, early experience on site, and an evolving focus on thoughtful design.</p><span class="journey-decoration">V / M</span></div>
          <div class="timeline">
            <div class="timeline-caption" data-reveal>PROFESSIONAL EXPERIENCE</div>
            <div v-for="(item,i) in profile.experience" :key="i" class="timeline-entry" data-reveal><div class="timeline-date">{{ item.period }}</div><div><span class="timeline-type">{{ item.kind }}</span><h3>{{ item.role }}</h3><h4>{{ item.organization }}</h4><p>{{ item.description }}</p></div></div>
            <div class="timeline-caption" data-reveal>EDUCATION & TRAINING</div>
            <div v-for="(item,i) in profile.education" :key="i" class="timeline-entry" data-reveal><div class="timeline-date">{{ item.period }}</div><div><span class="timeline-type">EDUCATION / {{ String(i+1).padStart(2,'0') }}</span><h3>{{ item.credential }}</h3><h4>{{ item.institution }}</h4><p class="timeline-note">{{ item.note }}</p></div></div>
          </div>
        </div>
      </div>
    </section>

    <section class="philosophy" aria-labelledby="philosophy-title"><div class="philosophy-back">SPACE</div><div class="container philosophy-content" data-reveal><span>06 / A PERSONAL PRINCIPLE</span><h2 id="philosophy-title">“{{ profile.philosophy }}”</h2><div class="philosophy-line"></div><p>— VIJAYALAXMI MASUTI</p></div></section>

    <section id="contact" class="contact section-padded" aria-labelledby="contact-title"><div class="container"><div class="section-topline top-dark" data-reveal><span>07 / WHAT'S NEXT</span><span>NEW SPACES. NEW POSSIBILITIES.</span></div><div class="contact-grid"><div data-reveal><p class="kicker"><span class="kicker-square"></span> GET IN TOUCH</p><h2 id="contact-title" class="contact-title">Have a space<br />in <em>mind?</em><br /><span>Let's talk.</span></h2><p class="contact-description">{{ profile.availability }}</p><a class="contact-main-link" :href="`mailto:${profile.email}?subject=Let's%20Connect%20%E2%80%94%20Portfolio`">{{ profile.email }} <ArrowUpRight :size="29" /></a></div><div class="contact-side" data-reveal><div class="contact-disc"><span>OPEN FOR<br />OPPORTUNITIES</span><ArrowUpRight :size="46" /></div><div class="contact-data"><span>LOCATION</span><p>{{ profile.location }}</p><span>CONNECT</span><a :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn <ExternalLink :size="17" /></a><a :href="`tel:${profile.phone}`">{{ profile.phone }} <ArrowUpRight :size="17" /></a><span>DOCUMENTS</span><a :href="profile.resume" download>Download résumé <FileDown :size="17" /></a></div></div></div><div class="contact-bottom"><span>LET'S MAKE ROOM FOR WHAT'S NEXT.</span><button type="button" @click="scrollToId('home')">BACK TO THE TOP <ArrowRight :size="16" /></button></div></div></section>
  </div>
</template>
