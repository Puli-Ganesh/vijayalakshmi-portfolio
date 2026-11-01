import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const required=['package.json','index.html','src/main.ts','src/App.vue','src/data/profile.ts','src/pages/HomePage.vue','src/pages/ProjectPage.vue','src/pages/NotFoundPage.vue','src/components/three/SpatialStudio.vue','src/components/three/HeroScene.vue','src/components/three/SkillsConstellation.vue','src/components/RenderGallery.vue','src/scenes/createSpatialScene.ts','src/styles/main.css','public/images/vijayalaxmi-portrait.webp','public/resume/vijayalaxmi-masuti-resume.pdf','vercel.json','README.md']
let fail=false
for(const p of required){const full=path.join(root,p);const ok=fs.existsSync(full)&&fs.statSync(full).size>0;console.log(`${ok?'PASS':'FAIL'}  ${p}`);if(!ok)fail=true}
const renderNames=['exterior-front','exterior-street','exterior-aerial','bedroom-interior','kitchen-interior']
for (const name of renderNames) for (const suffix of ['.webp','-preview.webp']) {
 const rel=`public/images/visual-work/${name}${suffix}`
 const full=path.join(root,rel)
 const ok=fs.existsSync(full) && fs.statSync(full).size>0
 console.log(`${ok?'PASS':'FAIL'}  User render ${rel}`)
 if(!ok)fail=true
}
const profileSource=fs.readFileSync(path.join(root,'src/data/profile.ts'),'utf8')
const detailSource=fs.readFileSync(path.join(root,'src/pages/ProjectPage.vue'),'utf8')
const homeSource=fs.readFileSync(path.join(root,'src/pages/HomePage.vue'),'utf8')
for(const [label,ok] of [
 ['Real work project slug',profileSource.includes("slug: 'residential-visuals'")],
 ['Real work project detail page',detailSource.includes('<RenderGallery />')],
 ['Real work homepage preview',homeSource.includes('featured-work')],
 ['Original academic structure project',profileSource.includes("slug: 'residential-structure'")],
 ['Original academic dam project',profileSource.includes("slug: 'earthen-bund'")],
]) {console.log(`${ok?'PASS':'FAIL'}  ${label}`); if(!ok)fail=true}
const packageInfo=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'))
for(const script of ['dev','build','preview','validate']) {const ok=Boolean(packageInfo.scripts[script]);console.log(`${ok?'PASS':'FAIL'}  npm script ${script}`);if(!ok)fail=true}
const vercel=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'))
console.log(`${vercel.outputDirectory==='dist'?'PASS':'FAIL'}  Vercel output dist`)
if(vercel.outputDirectory!=='dist')fail=true
for(const key of ['mailto:', 'webgl', 'orbit', 'Explode', 'resume']){
 const files=['src/pages/HomePage.vue','src/components/three/SpatialStudio.vue','src/components/three/HeroScene.vue','src/App.vue'].map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n').toLowerCase()
 const ok=files.includes(key.toLowerCase());console.log(`${ok?'PASS':'WARN'}  Feature presence: ${key}`)
}
console.log(fail?'Source validation found errors.':'Source and asset validation passed. This is NOT a substitute for npm run build or browser testing.')
process.exit(fail?1:0)
