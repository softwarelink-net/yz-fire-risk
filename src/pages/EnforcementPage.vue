<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-xl font-semibold text-white">消防执法助手</h1>
      <p class="mt-1 text-sm text-slate-400">AI 辅助执法文书生成 · 法规知识库 · 裁量建议</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard title="在办案件列表" subtitle="yz_enforcement_cases">
        <ul class="space-y-3">
          <li
            v-for="c in dbStore.cases"
            :key="c.id"
            class="cursor-pointer rounded-lg border px-3 py-3 transition"
            :class="
              selected?.id === c.id
                ? 'border-fire-500/50 bg-fire-500/10'
                : 'border-slate-800 hover:border-slate-700'
            "
            @click="selected = c"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="font-mono text-sm text-fire-300">{{ c.case_number }}</p>
              <span class="badge bg-slate-800 text-slate-300">{{
                DOCUMENT_STATUS_LABELS[c.document_status]
              }}</span>
            </div>
            <p class="mt-1 text-sm text-slate-200">{{ c.unit_name }}</p>
            <p class="mt-0.5 text-xs text-slate-400">{{ c.violation_description }}</p>
          </li>
        </ul>
      </BaseCard>

      <BaseCard title="文书预览" :subtitle="selected ? selected.case_number : '请选择案件'">
        <div v-if="selected" class="space-y-4 text-sm">
          <div class="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <h4 class="font-medium text-slate-200">违法行为</h4>
            <p class="mt-2 text-slate-300">{{ selected.violation_description }}</p>
          </div>
          <div class="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <h4 class="font-medium text-slate-200">法律依据</h4>
            <p class="mt-2 font-mono text-fire-300">{{ selected.legal_basis }}</p>
          </div>
          <div class="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <h4 class="font-medium text-slate-200">建议处罚金额</h4>
            <p class="mt-2 font-display text-2xl font-semibold text-white">
              ¥ {{ selected.suggested_penalty?.toLocaleString() }}
            </p>
            <p class="mt-2 text-xs text-slate-500">
              AI 裁量建议：基于违法情节、历史记录与自由裁量基准自动生成（演示）
            </p>
          </div>
          <div class="rounded-lg border border-dashed border-fire-500/30 bg-fire-500/5 p-4">
            <p class="text-xs text-fire-300">📝 自动生成检查清单与处罚决定书草稿（演示占位）</p>
          </div>
        </div>
        <p v-else class="text-sm text-slate-500">请从左侧选择案件查看详情</p>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useDbStore } from '@/stores/db'
import { DOCUMENT_STATUS_LABELS, type EnforcementCase } from '@/utils/types'

const dbStore = useDbStore()
const selected = ref<EnforcementCase | null>(dbStore.cases[0] ?? null)
</script>
