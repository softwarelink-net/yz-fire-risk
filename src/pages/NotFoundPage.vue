<template>
  <div
    class="app-with-banner flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4"
  >
    <GlobalStickyBanner />
    <div class="max-w-md text-center">
      <p class="font-display text-6xl font-bold text-slate-600">404</p>
      <h1 class="mt-4 text-xl font-semibold text-slate-100">页面不存在</h1>
      <p class="mt-2 text-sm text-slate-400">请检查地址或返回系统首页。</p>
      <div class="mt-6 flex justify-center gap-3">
        <RouterLink to="/" class="btn-primary">返回首页</RouterLink>
        <RouterLink to="/login" class="btn-secondary">登录</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GlobalStickyBanner from '@/components/GlobalStickyBanner.vue'
</script>
