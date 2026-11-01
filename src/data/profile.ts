/** Personal information verified against the supplied CV dated 06 October 2026.
 * The 2026 visualization collection is represented by five images provided by the portfolio owner.
 * Procedural 3D studio and academic diagrams are DEMONSTRATIONS, not claimed client work.
 */
export const renderImages = [
  { id: 'exterior-front', src: '/images/visual-work/exterior-front.webp', preview: '/images/visual-work/exterior-front-preview.webp', title: 'Sculpted elevation', category: 'EXTERIOR', caption: 'Street-facing residential elevation with layered volumes, recessed balconies and planting.' },
  { id: 'exterior-street', src: '/images/visual-work/exterior-street.webp', preview: '/images/visual-work/exterior-street-preview.webp', title: 'Street perspective', category: 'EXTERIOR', caption: 'A closer perspective of the home’s pink-toned façade and projecting white frames.' },
  { id: 'exterior-aerial', src: '/images/visual-work/exterior-aerial.webp', preview: '/images/visual-work/exterior-aerial-preview.webp', title: 'Garden from above', category: 'LANDSCAPE', caption: 'Elevated view revealing the adjacent green space, timber fencing and landscape arrangement.' },
  { id: 'bedroom-interior', src: '/images/visual-work/bedroom-interior.webp', preview: '/images/visual-work/bedroom-interior-preview.webp', title: 'Quiet retreat', category: 'INTERIOR', caption: 'Bedroom visualization with layered curtains, soft neutral finishes and suspended lighting.' },
  { id: 'kitchen-interior', src: '/images/visual-work/kitchen-interior.webp', preview: '/images/visual-work/kitchen-interior-preview.webp', title: 'Material contrast', category: 'INTERIOR', caption: 'Kitchen visualization featuring dark cabinetry, marble-style surfaces and warm wood details.' }
] as const

export const profile = {
  fullName: 'Vijayalaxmi Masuti',
  displayFirst: 'VIJAYA',
  displayLast: 'LAXMI.',
  monogram: 'VM',
  profession: 'Civil Engineer · Aspiring Interior Designer',
  location: 'Koramangala, Bengaluru',
  availability: 'Open to interior design opportunities · Willing to relocate across India',
  email: 'vijayalaxmimasuti28@gmail.com',
  phone: '07338595455',
  linkedin: 'https://www.linkedin.com/in/vijayalaxmi-masuti-1877aa357/',
  portrait: '/images/vijayalaxmi-portrait.webp',
  portraitSmall: '/images/vijayalaxmi-portrait-small.webp',
  resume: '/resume/vijayalaxmi-masuti-resume.pdf',
  eyebrow: 'CIVIL ENGINEERING  /  SPATIAL DESIGN',
  headline: 'Between structure and space.',
  introduction: 'I bring a civil engineer’s understanding of how things are built to the creative process of imagining how they can be experienced. My practice spans construction drawings, 3D visualisation and the details that make spaces work.',
  bio: 'Trained in civil engineering and drawn to interior design, I work at the intersection of technical precision and thoughtful space planning. Through AutoCAD, SketchUp and foundational Revit knowledge, I translate plans into clear spatial ideas, informed by drawing interpretation, quantity estimation and on-site exposure.',
  philosophy: 'A beautiful space should also make sense — in plan, in material, and in the way people move through it.',
  skills: [
    { id: 'drafting', name: 'AutoCAD', label: 'TECHNICAL DRAFTING', description: '2D and 3D drafting, plans, working drawings and the interpretation of construction documents.', category: 'Software', related: 'residential-structure' },
    { id: 'modeling', name: 'SketchUp', label: 'SPATIAL MODELLING', description: '3D modelling, early spatial studies, space planning and visual presentations.', category: 'Software', related: 'residential-structure' },
    { id: 'revit', name: 'Revit', label: 'BIM FOUNDATIONS', description: 'Foundational software knowledge, including a residential 3D visualisation as described in the CV.', category: 'Software', related: 'residential-structure' },
    { id: 'structures', name: 'ETABS v19', label: 'STRUCTURAL ANALYSIS', description: 'Academic building analysis of bending moments, shear forces and axial forces.', category: 'Engineering', related: 'residential-structure' },
    { id: 'planning', name: 'Space Planning', label: 'DESIGN THINKING', description: 'Bringing function, circulation, and clear layout decisions into spatial design.', category: 'Design', related: 'residential-structure' },
    { id: 'rendering', name: 'Enscape', label: 'ARCHITECTURAL RENDERS', description: 'Five residential exterior and interior render images submitted for this portfolio.', category: 'Visualisation', related: 'residential-visuals' },
    { id: 'execution', name: 'BOQ & Site', label: 'BUILDABILITY', description: 'Quantity estimation, BOQ preparation, drawing interpretation and site execution basics.', category: 'Practice', related: 'earthen-bund' }
  ],
  experience: [
    { role: 'Construction / Civil Engineering Intern', organization: 'AVS Projects', period: 'Jan — Apr 2026', kind: 'EXPERIENCE', description: 'Developed AutoCAD drafting and construction drawing interpretation skills while observing ongoing site activities and gaining an introduction to site supervision.' }
  ],
  education: [
    { credential: 'Bachelor of Engineering · Civil', institution: 'Basaveshwar Engineering College', period: '2022 — 2026', note: '6.58 CGPA' },
    { credential: 'CACM · Construction Management', institution: 'Construction Management Training Institute (CMTI), Bengaluru', period: 'Jul — Oct 2026', note: 'Training' },
    { credential: 'Pre-University Course', institution: 'Bapuji Independent PU College, Badagand', period: '2020 — 2022', note: '81.5%' },
    { credential: 'SSLC', institution: 'Holy Saint English Medium High School, Bilagi', period: '2019 — 2020', note: '79.8%' }
  ],
  projects: [
    {
      slug: 'residential-visuals', number: '01', title: 'Residential Spaces', subtitle: 'Exterior & interior visualizations', discipline: 'ARCHITECTURAL VISUALISATION / ENSCAPE', year: '2026 / VISUAL WORK',
      summary: 'Five original shared renders exploring residential elevations, outdoor spaces, bedroom atmosphere and kitchen materials.',
      overview: 'A visual collection spanning three exterior perspectives and two interior views. The images explore geometric massing, tonal contrast, landscaping, material textures and interior lighting. They are presented as supplied, with no invented client, construction status or modeling process.',
      processes: ['Residential elevation perspectives', 'Landscape and site composition', 'Bedroom lighting and furnishings', 'Kitchen finishes and material contrast'],
      type: 'render' as const,
      visualDisclaimer: 'Five Enscape-named render images were supplied by the portfolio owner. Original editable models, client brief and construction records were not provided; the live 3D studio elsewhere on this site is a separate illustrative demo.'
    },
    {
      slug: 'residential-structure', number: '02', title: 'Residential Building', subtitle: 'Analysis & structural design', discipline: 'STRUCTURAL DESIGN / 3D VISUALISATION', year: 'ACADEMIC PROJECT', summary: 'An exploration of residential structural design, combining AutoCAD planning, ETABS analysis and 3D Revit visualisation.', overview: 'Prepared the building plan in AutoCAD and imported it into ETABS v19 for structural analysis. Evaluated bending moments, shear forces and axial forces in key structural members, then used Revit to create a visual model for presentation.', processes: ['AutoCAD building planning', 'ETABS v19 structural analysis', 'IS 456 and IS 875 manual design checks', 'Revit 3D visualisation'], type: 'structure' as const, visualDisclaimer: 'Interactive conceptual structure below illustrates the design disciplines involved. The original AutoCAD/Revit files were not supplied.'
    },
    {
      slug: 'earthen-bund', number: '03', title: 'New Tank', subtitle: 'Earthen dam / bund', discipline: 'WATER RESOURCE / CIVIL DESIGN', year: 'ACADEMIC PROJECT', summary: 'An earthen water-retention design for seasonal irrigation, surface-water collection and groundwater recharge.', overview: 'Developed an earthen bund concept to collect seasonal rainfall and stream water. The design addressed irrigation water availability and groundwater recharge for nearby agricultural land.', processes: ['Water harvesting concept', 'Earthen bund planning', 'Seasonal irrigation focus', 'Groundwater recharge considerations'], type: 'landscape' as const, visualDisclaimer: 'The graphic is a portfolio illustration, not a construction drawing or photograph of a completed dam.'
    }
  ],
  languages: ['English', 'Kannada', 'Hindi']
} as const

export type PortfolioProject = (typeof profile.projects)[number]
