<template>
  <div
    class="app-with-banner flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4"
  >
    <GlobalStickyBanner />
    <div class="max-w-md text-center">
      <p class="font-display text-6xl font-bold text-fire-500">403</p>
      <h1 class="mt-4 text-xl font-semibold text-slate-100">无权访问该页面</h1>
      <p class="mt-2 text-sm text-slate-400">当前角色权限不足，请联系系统管理员或切换账号。</p>
      <div class="mt-6 flex justify-center gap-3">
        <RouterLink to="/dashboard" class="btn-primary">返回驾驶舱</RouterLink>
        <RouterLink to="/login" class="btn-secondary">重新登录</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GlobalStickyBanner from '@/components/GlobalStickyBanner.vue'
</script>
