<template>
  <div
    v-if="booting"
    class="app-with-banner flex min-h-screen items-center justify-center bg-panel-950 text-white"
  >
    <GlobalStickyBanner />
    <div class="text-center">
      <div
        class="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-fire-500"
      />
      <p class="mt-4 text-sm text-slate-300">正在初始化本地消防风险数据库…</p>
    </div>
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GlobalStickyBanner from '@/components/GlobalStickyBanner.vue'
import { useDbStore } from '@/stores/db'
import { useUserStore } from '@/stores/user'

const booting = ref(true)
const dbStore = useDbStore()
const userStore = useUserStore()

onMounted(async () => {
  try {
    await dbStore.init()
    userStore.restoreSession()
  } catch (e) {
    console.error('Boot failed', e)
  } finally {
    booting.value = false
  }
})
</script>
