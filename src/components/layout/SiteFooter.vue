<script setup lang="ts">
import { ArrowUpRight, ArrowUp } from 'lucide-vue-next'
import { profile } from '../../data/profile'
function top() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
</script>
<template>
  <footer class="site-footer">
    <div class="container footer-top"><span class="footer-mark">VM<span>✳</span></span><span class="footer-side">DEFINED BY THE DETAILS.<br />DESIGNED FOR THE HUMAN EXPERIENCE.</span></div>
    <div class="container footer-bottom">
      <span>© {{ new Date().getFullYear() }} {{ profile.fullName }}. All rights reserved.</span>
      <div><a :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight :size="13" /></a><a :href="`mailto:${profile.email}`">Email <ArrowUpRight :size="13" /></a><button type="button" @click="top">Back to top <ArrowUp :size="13" /></button></div>
      <span>Built with curiosity & precision.</span>
    </div>
  </footer>
</template>
