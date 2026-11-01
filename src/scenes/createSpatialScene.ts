import * as THREE from 'three'

export type SceneMode = 'interior' | 'structure'
export interface SpatialWorld {
  scene: THREE.Scene
  groups: THREE.Group[]
  cameraTarget: THREE.Vector3
  lights: { sun: THREE.DirectionalLight; warm: THREE.PointLight }
  allMaterials: THREE.Material[]
}

/** All room and structure geometry is a clearly labeled portfolio *demonstration*.
 * It does not claim to reconstruct the applicant's missing original model files.
 */
export function createSpatialScene(mode: SceneMode): SpatialWorld {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(mode === 'interior' ? 0x172321 : 0x192526)
  scene.fog = new THREE.Fog(scene.background as THREE.Color, 17, 36)
  const groups: THREE.Group[] = []
  const allMaterials: THREE.Material[] = []
  const materials = {
    limestone: mat(0xe5ddd0, .93), oak: mat(0x9b7051, .69), warmOak: mat(0xbe8d68,.66),
    forest: mat(0x506a60,.77), wall: mat(0xe8dfd2,.88), concrete: mat(0x8f9b91,.92),
    charcoal: mat(0x343b3a,.77), pale: mat(0xf3e9d9,.83), glass: new THREE.MeshPhysicalMaterial({ color:0xb6d5d1, metalness:.08, roughness:.1, transmission:.18, transparent:true, opacity:.42 }),
    brass: new THREE.MeshStandardMaterial({ color:0xc9ae78, metalness:.7, roughness:.25 }), fabric: mat(0xc0bdad,.96),
    teal: mat(0x3a6a65,.8), earth: mat(0xbbb398,.91), darkEarth: mat(0x6b7965,.92)
  }
  Object.values(materials).forEach(m => allMaterials.push(m))
  function mat(color: THREE.ColorRepresentation, roughness: number) { return new THREE.MeshStandardMaterial({ color, roughness }) }
  function assembly(name:string): THREE.Group { const g = new THREE.Group(); g.name=name; scene.add(g); groups.push(g); return g }
  function box(parent:THREE.Group, label:string, w:number,h:number,d:number, x:number,y:number,z:number, material:THREE.Material) {
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material)
    mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; mesh.userData.label=label; parent.add(mesh); return mesh
  }
  function cyl(parent:THREE.Group,label:string,r:number,height:number,x:number,y:number,z:number,material:THREE.Material,r2=r) {
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r2,height,20),material)
    mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.label=label;parent.add(mesh);return mesh
  }
  const ground=assembly('01 · Foundation')
  box(ground,'Elevated foundation', 11.2,.28,7.4,0,-.24,0,materials.concrete)
  box(ground,'Oak floor',10.5,.12,6.75,0,-.025,0,materials.oak)
  if(mode==='interior') {
    const shell=assembly('02 · Architectural shell')
    box(shell,'Rear wall',10.5,4.0,.16,0,2,-3.30,materials.wall)
    box(shell,'Left wall',.16,4.0,6.7,-5.18,2,0,materials.wall)
    box(shell,'Right wall',.16,4.0,6.7,5.18,2,0,materials.wall)
    box(shell,'Interior partition',.13,3.35,3.6,.45,1.7,-1.55,materials.wall)
    // Rear windows / stylized openings framed with glass
    for(const x of [-3.6,2.7]) {
      box(shell,'Framed glazing',2.15,1.65,.07,x,2.5,-3.16,materials.glass)
      box(shell,'Window frame',2.24,.09,.14,x,3.37,-3.08,materials.charcoal)
      box(shell,'Window frame',2.24,.09,.14,x,1.64,-3.08,materials.charcoal)
      box(shell,'Window mullion',.08,1.72,.14,x,2.51,-3.08,materials.charcoal)
    }
    const living=assembly('03 · Living room')
    box(living,'Area rug',3.7,.055,2.3,-2.4,.074,.3,materials.fabric)
    box(living,'Sofa base',2.8,.52,.93,-2.65,.48,-1.7,materials.forest)
    box(living,'Sofa back',2.8,.85,.25,-2.65,.9,-2.22,materials.forest)
    box(living,'Sofa left arm',.3,.65,.98,-4.08,.67,-1.7,materials.forest)
    box(living,'Sofa right arm',.3,.65,.98,-1.22,.67,-1.7,materials.forest)
    for(const x of [-3.5,-2.65,-1.8])box(living,'Seat cushion',.76,.1,.8,x,.79,-1.64,materials.fabric)
    box(living,'Coffee table top',2.1,.12,.93,-2.4,.53,.20,materials.limestone)
    for(const x of [-3.19,-1.62]) for(const z of [-.11,.51]) cyl(living,'Table leg',.04,.45,x,.275,z,materials.brass)
    box(living,'Media console',2.1,.52,.49,-2.0,.34,2.84,materials.warmOak)
    box(living,'Wall art',1.08,.7,.06,-3.25,2.15,-3.16,materials.forest)
    cyl(living,'Side table',.35,.14,-4.35,.56,.48,materials.brass)
    cyl(living,'Side table pedestal',.055,.5,-4.35,.25,.48,materials.brass)
    const kitchen=assembly('04 · Dining details')
    box(kitchen,'Dining table',1.6,.11,.98,2.3,.78,-1.85,materials.warmOak)
    for(const x of [1.66,2.94])for(const z of [-2.13,-1.55])cyl(kitchen,'Dining table leg',.045,.72,x,.36,z,materials.charcoal)
    for(const x of [1.4,3.35]) {
      box(kitchen,'Dining chair',.45,.12,.44,x,.45,-1.85,materials.forest)
      box(kitchen,'Dining chair back',.12,.75,.48,x+ (x<2 ? -.18 : .18),.72,-1.85,materials.forest)
    }
    const bedroom=assembly('05 · Bedroom zone')
    box(bedroom,'Bed platform',2.55,.34,2.25,2.95,.36,1.1,materials.oak)
    box(bedroom,'Upholstered mattress',2.41,.20,2.05,2.95,.65,1.06,materials.pale)
    box(bedroom,'Headboard',2.52,1.05,.18,2.95,.87,.02,materials.forest)
    for(const x of [2.35,3.55])box(bedroom,'Pillow',.87,.16,.5,x,.83,.34,materials.fabric)
    box(bedroom,'Throw blanket',2.39,.065,.66,2.95,.79,1.79,materials.teal)
    box(bedroom,'Wardrobe',1.2,2.3,.55,4.37,1.16,2.68,materials.warmOak)
    box(bedroom,'Wardrobe inlay',.04,2.18,.57,4.36,1.18,2.68,materials.charcoal)
    const decor=assembly('06 · Lighting & planting')
    cyl(decor,'Decorative lamp',.29,.07,-4.35,1.74,.48,materials.pale,.12)
    cyl(decor,'Lamp shaft',.025,1.1,-4.35,1.13,.48,materials.brass)
    cyl(decor,'Potted plant',.26,.46,4.43,.29,-2.2,materials.limestone,.18)
    for(let i=0;i<7;i++) {
      const stem=cyl(decor,'Decorative plant',.035,.95,4.43,.94,-2.2,materials.forest)
      stem.rotation.z=(i-3)*.20
    }
    const fixture=cyl(decor,'Pendant light',.32,.22,2.35,2.8,-1.85,materials.brass,.13)
    fixture.rotation.z=.07
  } else {
    const structure=assembly('02 · Columns and beams')
    for(let x=-4;x<=4;x+=2)for(let z=-2.4;z<=2.4;z+=2.4) {
      box(structure,'Reinforced concrete column',.27,6.1,.27,x,3,z,materials.concrete)
    }
    const floors=assembly('03 · Structural floor plates')
    for(let i=0;i<3;i++) {
      const y=.32+i*2.15
      box(floors,`Floor slab level ${i+1}`,9.0,.23,5.25,0,y,0,materials.limestone)
      for(let x=-4;x<=4;x+=2)box(floors,'Longitudinal beam',.22,.34,5.3,x,y-.21,0,materials.darkEarth)
      for(let z=-2.4;z<=2.4;z+=2.4)box(floors,'Transverse beam',9.0,.34,.22,0,y-.21,z,materials.darkEarth)
    }
    const facade=assembly('04 · Diagrammatic massing')
    for(let i=0;i<2;i++) {
      const y=1.3+i*2.15
      box(facade,'Glazed bay',1.4,1.65,.05,-2.8,y,-2.43,materials.glass)
      box(facade,'Glazed bay',1.4,1.65,.05,2.5,y,-2.43,materials.glass)
      box(facade,'Facade fin',.1,1.7,.12,-1.6,y,-2.5,materials.brass)
    }
    const stairs=assembly('05 · Access / vertical circulation')
    for(let i=0;i<12;i++)box(stairs,'Stair tread',.88,.14,.36,3.4,.11+i*.16,1.9-i*.31,materials.warmOak)
  }
  const ambient=new THREE.AmbientLight(0xe9e4d6,1.35)
  scene.add(ambient)
  const sun=new THREE.DirectionalLight(0xffe3b5,3.0)
  sun.position.set(-7,12,9); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024)
  sun.shadow.camera.left=-13;sun.shadow.camera.right=13;sun.shadow.camera.top=13;sun.shadow.camera.bottom=-13;sun.shadow.bias=-.00015
  scene.add(sun)
  const warm=new THREE.PointLight(0xffb57a,mode==='interior' ? 18 : 7, 16)
  warm.position.set(-2,4,1);scene.add(warm)
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({ opacity:.19 }))
  shadow.rotation.x=-Math.PI/2;shadow.position.y=-.45;shadow.receiveShadow=true;scene.add(shadow)
  return { scene,groups,cameraTarget:new THREE.Vector3(0,1.3,0), lights:{sun,warm}, allMaterials }
}
