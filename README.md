# Vijayalaxmi Masuti — A portfolio between structure and space

A complete Vue 3 + TypeScript + Vite portfolio with original interactive Three.js scenes, GSAP / ScrollTrigger motion, Lenis smooth scrolling, Tailwind CSS v4, and responsive custom design. Includes the actual supplied portrait and resume, a gallery of the five real Enscape renders supplied by the portfolio owner, dedicated project routes, a skills constellation, a structural visualization, and an interactive spatial studio.

## Quick start

**Requirements:** Node.js 20.19+ and npm, plus an internet connection during installation.

```bash
npm install
npm run dev
npm run build
npm run preview
```

Then open the URL shown by Vite. The production site is emitted to `dist/`.

## Deploy to Vercel

1. Upload this directory into a Git repository (or import it directly in Vercel).
2. Create a Vercel project from that repository; framework Vite.
3. The provided `vercel.json` configures `npm run build`, the `dist` output directory and a rewrite for Vue Router history mode.
4. Deploy. All three project URLs, including `/project/residential-visuals`, should resolve through the rewrite.
5. No secrets, API keys or backend are needed. Contact action uses the visitor's email application (`mailto:`), and **does not falsely claim to submit a server form**.

## Edit actual professional content

`src/data/profile.ts` is the central source of truth for identity, contact details, academic projects, education, skills and internships. All supplied facts were drawn from the attached CV. Update this file instead of editing individual components.

### Replace assets

- Portrait: `public/images/vijayalaxmi-portrait.webp`, the smaller variant is `public/images/vijayalaxmi-portrait-small.webp`.
- PDF: `public/resume/vijayalaxmi-masuti-resume.pdf` (this is the user-provided resume).
- Add real renders or project files only when those are available. The academic projects currently use **original illustrative SVG drawings** defined in `src/components/ProjectArtwork.vue`, not claims of final project photographs.
- The 3D interior and building frames are **procedural design demonstrations**. They are not a reconstruction of the original ETABS / Revit files, which were not supplied.

## Design / architecture

- `src/pages/`: home, full project details and 404 screen.
- `src/components/layout/`: desktop/mobile navigation and footer.
- `src/components/three/`: interactive WebGL hero, skills sculpture and 3D studio.
- `src/scenes/createSpatialScene.ts`: actual Three.js geometry, materials, groups and lighting.
- `src/styles/main.css`: design system / mobile breakpoints / reduced-motion preferences.
- `src/router/`: Vue Router history-mode routes.
- `src/composables/`: reusable motion-preference hook.
- `src/utils/webgl.ts`: capability detection and device-pixel-ratio limit.
- `scripts/validate.mjs`: offline source/asset checks (`npm run validate`).

## Interactions

**Hero:** photographic depth, pointer-follow mask revealing an original architectural wireframe, touch/tap alternative.

**Skills:** procedural Three.js objects linked to accessible HTML skill selection and descriptions.

**Studio:** physically lit room, on-canvas orbit + zoom, select a furniture or structural element, 4 camera presets, night/day lighting, exploded/assembled component view and reset.

**Project routes:** one image-based Residential Spaces gallery using five owner-submitted Enscape renders, plus two academic studies grounded in the actual CV. The academic residential study has a separate illustrative structural frame; the dam project has an explicitly illustrative topographic diagram.

**Graceful degradation:** Every section has meaningful HTML content independent of WebGL. The 3D visuals fall back without crashing the Vue app if WebGL initialization fails. The site does not depend on an unavailable image CDN or a missing remote 3D file.

**Motion:** short skippable intro, once per session; ScrollTrigger reveals and subtle camera parallax; reduced-motion accessibility preference honored for main page motion. Three.js loops pause when off screen or tab is hidden, and dispose resources on unmount.

## Checks to perform in a browser after installing

1. `npm run validate`, `npm run build`, and `npm run preview`.
2. Confirm browser console has no critical errors.
3. Test Home, About, Expertise, Work, Journey and Contact navigation at desktop and mobile widths.
4. Test direct page refreshes of all three project routes on deployed Vercel site.
5. Try orbit, zoom, preset views, day/night, explode, reassemble, reset in the 3D studio.
6. Test a restricted WebGL browser: text, résumé, project art and contact link must remain accessible.
7. Check touch/tap portrait reveal, keyboard focus, reduced-motion preference and resume download.

## Limitations / provenance

The initial project was built from the owner’s portrait and two-page CV. The November update adds five Enscape images provided by the owner. Reference videos and original editable 3D project models were not provided in either batch, so the procedural interactive 3D environments remain illustrative demonstrations. No invented employers, qualifications, completed construction, clients or fabricated project metrics were added. The original CV remains linked.

The site uses Google Fonts with system fallbacks. For a fully offline deployment, self-host licensed replacements or rely on the system fallback.

## November 2026 update — user-submitted visual portfolio

The updated portfolio now includes a dedicated **Residential Spaces — Exterior & Interior Visualizations** project featuring the five Enscape images supplied by Vijayalaxmi. This is the featured project on the Work section, with a dedicated route:

- `/project/residential-visuals` — real Enscape render collection, editorial image layouts, exterior/interior filters, fullscreen lightbox, Escape/arrow-key controls, readable descriptions.
- `/project/residential-structure` — academic engineering project, retains the conceptual 3D demonstration.
- `/project/earthen-bund` — academic water resource project, retains the illustrative diagram.

### The five included views

| File in `public/images/visual-work/` | Content |
| --- | --- |
| `exterior-front.webp` | Front residential elevation and street context |
| `exterior-street.webp` | Exterior street perspective |
| `exterior-aerial.webp` | Elevated landscape / garden view |
| `bedroom-interior.webp` | Bedroom visualization |
| `kitchen-interior.webp` | Kitchen visualization |

Each also has a `-preview.webp` variant for faster loading. The 2048 × 1152 full-size images are recompressed from the uploaded PNGs without cropping or AI modification. Image credits, captions and categories are editable in **`renderImages`** in `src/data/profile.ts`. The gallery lives in `src/components/RenderGallery.vue` and its responsive styles are appended to `src/styles/main.css`.

**Provenance:** These five images came from the owner's November 1, 2026 upload. No source model (.skp/.rvt/.glb), technical drawing, client brief, construction status, or walkthrough video was supplied with them. The website intentionally displays the actual renders, not a fabricated navigable copy of the building. `Enscape` is now listed as a portfolio-rendering tool because the supplied files were named Enscape renders; this is additional evidence beyond the earlier CV.

### Updated browser checklist

After installing dependencies, open the homepage Work section and confirm the large exterior photograph plus three preview thumbnails appear. Open Residential Spaces and confirm that all five images load, the filters work, the fullscreen overlay opens and closes, Escape closes it, left/right arrows navigate, and focus returns to the initiating button. Verify `/project/residential-visuals` by refreshing the URL in Vercel. Confirm the two original academic projects and interactive 3D rooms remain available.

**Build status of this updated release:** `node scripts/validate.mjs` and standalone TypeScript syntax/source checks passed in the packaging environment. A full `npm run build` requires dependency installation, which could not complete in the restricted packaging environment. No passing production build or live browser QA is claimed.
