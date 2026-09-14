<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-xl font-semibold text-white">系统配置</h1>
        <p class="mt-1 text-sm text-slate-400">仅超级管理员可访问 · 用户 / 参数 / 数据库</p>
      </div>
      <BaseButton variant="danger" @click="onReset">重置本地数据库</BaseButton>
    </div>

    <BaseCard title="系统参数" subtitle="yz_system_configs">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-slate-800 text-xs text-slate-400">
            <tr>
              <th class="px-3 py-2">Key</th>
              <th class="px-3 py-2">Value</th>
              <th class="px-3 py-2">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in dbStore.configs"
              :key="c.key"
              class="border-b border-slate-800/70"
            >
              <td class="px-3 py-2 font-mono text-fire-300">{{ c.key }}</td>
              <td class="px-3 py-2 text-slate-100">{{ c.value }}</td>
              <td class="px-3 py-2 text-slate-400">{{ c.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <BaseCard title="用户列表" subtitle="yz_users · RBAC">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-slate-800 text-xs text-slate-400">
            <tr>
              <th class="px-3 py-2">用户名</th>
              <th class="px-3 py-2">姓名</th>
              <th class="px-3 py-2">部门</th>
              <th class="px-3 py-2">角色</th>
              <th class="px-3 py-2">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in dbStore.users" :key="u.id" class="border-b border-slate-800/70">
              <td class="px-3 py-2 font-mono text-fire-300">{{ u.username }}</td>
              <td class="px-3 py-2 text-slate-100">{{ u.real_name }}</td>
              <td class="px-3 py-2 text-slate-400">{{ u.department }}</td>
              <td class="px-3 py-2">
                <span class="badge" :class="ROLE_BADGE_COLORS[u.role]">{{
                  ROLE_LABELS[u.role]
                }}</span>
              </td>
              <td class="px-3 py-2 text-green-300">{{ u.is_active ? '启用' : '停用' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useDbStore } from '@/stores/db'
import { ROLE_BADGE_COLORS, ROLE_LABELS } from '@/utils/types'

const dbStore = useDbStore()

function onReset() {
  if (confirm('确定重置本地 SQLite 数据库？所有演示修改将丢失。')) {
    dbStore.doReset()
  }
}
</script>
