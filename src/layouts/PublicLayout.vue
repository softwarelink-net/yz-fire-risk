<template>
  <div class="app-with-banner min-h-screen bg-slate-950">
    <GlobalStickyBanner />
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div>
          <p class="font-mono text-xs font-medium uppercase tracking-wider text-fire-400">
            公开信息
          </p>
          <h1 class="font-display text-lg text-slate-100">项目详情 · 免密访问</h1>
        </div>
        <RouterLink to="/login" class="btn-primary text-sm">进入系统</RouterLink>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import GlobalStickyBanner from '@/components/GlobalStickyBanner.vue'
</script>
