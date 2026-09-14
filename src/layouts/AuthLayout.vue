<template>
  <div class="app-with-banner min-h-screen bg-geo-grid">
    <GlobalStickyBanner />
    <div class="flex min-h-screen items-center justify-center px-4 py-16">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import GlobalStickyBanner from '@/components/GlobalStickyBanner.vue'
</script>
