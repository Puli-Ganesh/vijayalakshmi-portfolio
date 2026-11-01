<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
</script>

<template>
  <div class="missing-project">
    <span>404 / NOT FOUND</span>
    <h1>A little outside the blueprint.</h1>
    <p>The page you're looking for wasn't found.</p>

    <RouterLink to="/">
      Return to the portfolio
      <ArrowUpRight :size="18" />
    </RouterLink>
  </div>
</template>