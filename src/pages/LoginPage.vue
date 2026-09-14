<template>
  <div class="w-full max-w-md">
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fire-500/20 font-display text-2xl font-bold text-fire-300 ring-1 ring-fire-400/40"
      >
        扬
      </div>
      <h1 class="font-display text-2xl font-bold text-white">扬州消防 · YFR-DSS</h1>
      <p class="mt-2 text-sm text-slate-300">火灾风险研判和隐患治理决策辅助系统 · 纯前端演示</p>
    </div>

    <form
      class="rounded-2xl border border-fire-500/20 bg-slate-900/90 p-6 shadow-glow backdrop-blur"
      @submit.prevent="onSubmit"
    >
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium text-slate-300">用户名</label>
        <input
          v-model="username"
          class="input-field"
          autocomplete="username"
          placeholder="请输入用户名"
        />
      </div>
      <div class="mb-2">
        <label class="mb-1.5 block text-sm font-medium text-slate-300">密码</label>
        <input
          v-model="password"
          type="password"
          class="input-field"
          autocomplete="current-password"
          placeholder="请输入密码"
        />
      </div>
      <p v-if="error" class="mb-3 text-sm text-rose-400">{{ error }}</p>
      <BaseButton type="submit" class="mt-2 w-full" :loading="loading" size="lg">
        登录系统
      </BaseButton>

      <div class="mt-5 rounded-lg border border-slate-700/80 bg-slate-950/60 p-3 text-xs text-slate-400">
        <p class="mb-2 font-medium text-slate-300">演示账号（点击填入）</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="demo in demos"
            :key="demo.username"
            type="button"
            class="rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-left transition hover:border-fire-500/50 hover:text-fire-300"
            @click="fillDemo(demo)"
          >
            <span class="font-medium text-slate-200">{{ demo.label }}</span>
            <span class="block font-mono text-[10px] text-slate-500">{{ demo.username }}</span>
          </button>
        </div>
      </div>

      <p class="mt-4 text-center text-xs text-slate-500">
        <RouterLink to="/tender" class="text-fire-400 hover:underline">
          查看项目公开详情（免登录）
        </RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const demos = [
  { label: '超级管理员', username: 'admin', password: 'admin123' },
  { label: '消防主管', username: 'mgr_zhang', password: 'mgr123' },
  { label: '消防监督员', username: 'agent_li', password: 'agent123' },
  { label: '决策领导', username: 'chief_wang', password: 'chief123' },
]

function fillDemo(demo: { username: string; password: string }) {
  username.value = demo.username
  password.value = demo.password
  error.value = ''
}

function onSubmit() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  try {
    const result = userStore.login(username.value, password.value)
    if (!result.ok) {
      error.value = result.message
      return
    }
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } finally {
    loading.value = false
  }
}
</script>
