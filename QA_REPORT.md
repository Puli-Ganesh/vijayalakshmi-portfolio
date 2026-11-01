# QA report — 01 November 2026 update

## Changes delivered

- Integrated all five uploaded Enscape visualizations as optimized full-resolution 2048 × 1152 WebP images and preview variants.
- Added feature-led image presentation to homepage Work section.
- Added `/project/residential-visuals` with cinematic lead image, verified image-based descriptions and immersive visual essay.
- Built interactive gallery: All Views / Exterior / Interior filters, full-screen image viewer, arrows, Escape, focus return and focus containment.
- Preserved the original portrait, genuine CV download, existing academic project pages, responsive layout, Three.js scenes and contact links.
- Updated skills constellation to support a seventh Enscape skill visually (previous scene had only six objects).
- Updated project numbering / related project navigation / document title.
- Maintained clear distinction between user-provided work and procedural 3D demonstrations.

## Passed in local packaging environment

- `node scripts/validate.mjs`: PASS — required source files, original personal assets, scripts and Vercel config.
- Asset audit: PASS — all five main renders and five preview images exist, are decodable and match the expected 2048 × 1152 / 960 × 540 dimensions.
- `tsc --noEmit --target ES2022 --skipLibCheck src/data/profile.ts`: PASS — portfolio content source TypeScript.
- TypeScript syntax parsing of all `<script setup lang="ts">` and `.ts` files: PASS (not the same as full project type checking).
- SPA links/source refs: PASS — the portfolio includes its three project slugs and the visual collection source paths.

## Not verified / requires dependencies and browser

- `npm install`: BLOCKED — registry access unavailable in this environment. Offline install also failed because required package versions were not in the local cache.
- `npm run build`, `npm run dev`, `npm run preview`: NOT RUN successfully because dependencies were unavailable. Re-run all three locally before deployment.
- Browser / live WebGL / mobile interaction / actual Vercel deployment: NOT VERIFIED. Test before public launch.

## Recommended next checks

1. Node.js >= 20.19: `npm install && npm run validate && npm run build && npm run preview`.
2. Open `/` and `/project/residential-visuals`, then reload the latter directly.
3. Check desktop and phone widths; open all five images in the lightbox; test mouse, keyboard, touch and reduced-motion.
4. Visit `/project/residential-structure` and `/project/earthen-bund`, test procedural 3D controls and image fallback.
5. Deploy to Vercel only once the production build has completed.
