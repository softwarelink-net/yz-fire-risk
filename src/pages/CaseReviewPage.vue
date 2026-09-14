<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-xl font-semibold text-white">案卷智能评查</h1>
      <p class="mt-1 text-sm text-slate-400">OCR 解析 + 规则校验 · 程序与法条引用自动检测</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard
        v-for="c in dbStore.cases"
        :key="c.id"
        :title="c.case_number"
        :subtitle="c.unit_name || ''"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-400">文书状态</span>
            <span class="badge bg-slate-800 text-slate-300">{{
              DOCUMENT_STATUS_LABELS[c.document_status]
            }}</span>
          </div>
          <ul class="space-y-2">
            <li
              v-for="check in runChecks(c)"
              :key="check.rule"
              class="flex items-start gap-2 rounded-lg border border-slate-800 px-3 py-2 text-sm"
            >
              <span :class="check.pass ? 'text-green-400' : 'text-fire-400'">
                {{ check.pass ? '✓' : '✗' }}
              </span>
              <div>
                <p class="text-slate-200">{{ check.rule }}</p>
                <p class="text-xs text-slate-500">{{ check.detail }}</p>
              </div>
            </li>
          </ul>
          <p class="text-xs text-slate-500">
            评查得分：{{ score(c) }}/100 · 基于规则引擎模拟（演示）
          </p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import { useDbStore } from '@/stores/db'
import { DOCUMENT_STATUS_LABELS, type EnforcementCase } from '@/utils/types'

const dbStore = useDbStore()

function runChecks(c: EnforcementCase) {
  const hasLegal = !!c.legal_basis && c.legal_basis.includes('Art.')
  const hasPenalty = (c.suggested_penalty ?? 0) > 0
  const hasDesc = !!c.violation_description && c.violation_description.length > 5
  const signed = c.document_status === 'Approved' || c.document_status === 'Issued'
  return [
    {
      rule: '违法行为描述完整',
      pass: hasDesc,
      detail: hasDesc ? '描述字段已填写' : '缺少违法行为具体描述',
    },
    {
      rule: '法律条款引用规范',
      pass: hasLegal,
      detail: hasLegal ? '已引用消防法相关条款' : '法条引用格式异常',
    },
    {
      rule: '处罚金额在裁量区间',
      pass: hasPenalty && (c.suggested_penalty ?? 0) <= 10000,
      detail: `建议金额 ¥${c.suggested_penalty}`,
    },
    {
      rule: '审批签章齐全',
      pass: signed,
      detail: signed ? '已通过审批' : '缺少审批签章（草稿/审核中）',
    },
  ]
}

function score(c: EnforcementCase) {
  const checks = runChecks(c)
  return Math.round((checks.filter((x) => x.pass).length / checks.length) * 100)
}
</script>
