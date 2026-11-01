<script setup lang="ts">
defineProps<{ type: 'structure' | 'landscape'; detail?: boolean }>()
</script>
<template>
  <div class="project-art" :class="[`art-${type}`, { 'art-detail': detail }]" aria-label="Original diagrammatic project illustration" role="img">
    <div class="art-grid" aria-hidden="true"></div>
    <svg v-if="type === 'structure'" class="building-art" viewBox="0 0 900 590" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="slab" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e5d6bd" stop-opacity=".72"/><stop offset="1" stop-color="#a8b7ac" stop-opacity=".17"/></linearGradient><linearGradient id="pillar" x1="0" x2="1"><stop stop-color="#fbf2df" stop-opacity=".62"/><stop offset="1" stop-color="#607d75" stop-opacity=".18"/></linearGradient></defs>
      <g stroke="#e2ddca" stroke-width="2" stroke-linejoin="round">
        <path d="M180 420L459 534L745 409L464 291Z" fill="url(#slab)"/>
        <path d="M180 343L459 457L745 332L464 214Z" fill="url(#slab)"/>
        <path d="M180 267L459 381L745 256L464 139Z" fill="url(#slab)"/>
        <path d="M180 190L459 304L745 179L464 62Z" fill="url(#slab)"/>
        <g fill="url(#pillar)">
          <path d="M183 192L201 199L201 425L183 418Z"/><path d="M455 302L473 309L473 534L455 527Z"/><path d="M727 184L745 177L745 410L727 417Z"/><path d="M462 68L479 61L479 292L462 299Z"/>
          <path d="M320 249L337 256L337 483L320 475Z"/><path d="M592 250L609 243L609 469L592 477Z"/>
        </g>
      </g>
      <g stroke="#d2b98c" stroke-width="1.2" opacity=".9"><path d="M97 240V421M97 240L140 223M97 421L140 438"/><path d="M767 446L829 420M767 446L465 577M829 420L527 551"/></g>
      <g fill="#ded7c5" font-size="13" font-family="monospace" letter-spacing="3"><text x="69" y="205">+12.00</text><text x="84" y="450">±0.00</text><text x="708" y="471">AXIS B</text><text x="480" y="569">GRID 04</text></g>
      <circle cx="464" cy="62" r="5" fill="#d9b892"/><path d="M464 62L517 32H642" stroke="#d9b892" stroke-width="1"/><text x="535" y="24" fill="#e9d8bd" font-size="12" font-family="monospace" letter-spacing="2">STRUCTURAL FRAME</text>
    </svg>
    <svg v-else class="terrain-art" viewBox="0 0 900 590" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="water" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#b5dbcd" stop-opacity=".8"/><stop offset="1" stop-color="#3b776e" stop-opacity=".3"/></linearGradient><linearGradient id="earth" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#cfbb8e" stop-opacity=".88"/><stop offset="1" stop-color="#637c61" stop-opacity=".42"/></linearGradient></defs>
      <path d="M73 348C161 263 239 246 324 291S501 365 596 283S750 229 831 269" stroke="#cbb68c" stroke-width="2"/>
      <path d="M60 394C163 305 246 299 325 337S510 420 615 333S762 269 850 313" stroke="#cfbf9e" stroke-opacity=".7" stroke-width="1.5"/>
      <path d="M30 452C160 368 257 363 343 393S514 487 630 389S792 332 874 366" stroke="#cfbf9e" stroke-opacity=".5" stroke-width="1.5"/>
      <path d="M80 314C184 205 269 217 351 250S537 311 622 239S758 175 837 220" stroke="#cfbf9e" stroke-opacity=".6" stroke-width="1.5"/>
      <path d="M153 240C225 192 309 181 381 214S559 267 643 211S755 154 793 166" stroke="#cfbf9e" stroke-opacity=".4" stroke-width="1.5"/>
      <path d="M153 323C225 253 328 278 426 315S584 317 663 259L716 280C636 352 520 387 414 365S256 317 153 362Z" fill="url(#water)" stroke="#a8d0c2" stroke-width="1.5"/>
      <path d="M133 368L297 338L647 420L782 359L787 401L648 480L293 402L133 412Z" fill="url(#earth)" stroke="#f6e5be" stroke-width="1.8"/>
      <path d="M133 368L297 338L647 420L782 359" stroke="#e7d0a0" stroke-width="5"/>
      <path d="M297 338L293 402M647 420V480" stroke="#b8a476" stroke-opacity=".8" stroke-width="2"/>
      <g stroke="#d5e4c9" stroke-width="1" stroke-dasharray="6 7"><path d="M138 322L300 292L657 375L784 315"/><path d="M182 442L304 423L654 501L802 433"/></g>
      <g fill="#e7ead9" font-family="monospace" font-size="14" letter-spacing="2"><text x="90" y="162">SEASONAL WATER CATCHMENT</text><text x="554" y="535">EARTHEN BUND SECTION</text></g>
      <path d="M305 283L315 222H464M631 446L692 515H809" stroke="#e7d5ae" stroke-width="1.2"/><circle cx="305" cy="283" r="4" fill="#e7d5ae"/><circle cx="631" cy="446" r="4" fill="#e7d5ae"/>
    </svg>
    <span class="art-corner art-corner-left">DESIGN STUDY / {{ type === 'structure' ? 'FRAME' : 'TOPOGRAPHY' }}</span>
    <span class="art-corner art-corner-right">NOT TO SCALE</span>
  </div>
</template>
