<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-xl font-semibold text-white">隐患治理闭环</h1>
        <p class="mt-1 text-sm text-slate-400">
          状态机：发现 → 核实 → 派发 → 整改 → 复核 → 归档
        </p>
      </div>
      <div class="flex gap-2 text-sm">
        <span class="badge bg-fire-500/20 text-fire-300">待闭环 {{ dbStore.stats.openHazards }}</span>
        <span class="badge bg-rose-600/20 text-rose-300">重大 {{ dbStore.stats.criticalHazards }}</span>
      </div>
    </div>

    <BaseCard title="隐患台账" subtitle="yz_hazards">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-slate-800 text-xs text-slate-400">
            <tr>
              <th class="px-3 py-2">编号</th>
              <th class="px-3 py-2">位置</th>
              <th class="px-3 py-2">类别</th>
              <th class="px-3 py-2">严重度</th>
              <th class="px-3 py-2">状态</th>
              <th class="px-3 py-2">发现人</th>
              <th class="px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="h in dbStore.hazards"
              :key="h.id"
              class="border-b border-slate-800/70 hover:bg-slate-800/30"
            >
              <td class="px-3 py-2 font-mono text-fire-300">{{ h.hazard_code }}</td>
              <td class="max-w-[200px] px-3 py-2">
                <p class="truncate text-slate-200">{{ h.location }}</p>
                <p class="truncate text-xs text-slate-500">{{ h.description }}</p>
              </td>
              <td class="px-3 py-2 text-slate-300">{{ h.category }}</td>
              <td class="px-3 py-2">
                <span class="badge" :class="severityClass(h.severity)">{{
                  HAZARD_SEVERITY_LABELS[h.severity]
                }}</span>
              </td>
              <td class="px-3 py-2">
                <span class="badge bg-slate-800 text-slate-300">{{
                  HAZARD_STATUS_LABELS[h.status]
                }}</span>
              </td>
              <td class="px-3 py-2 text-slate-400">{{ h.found_by_name || '—' }}</td>
              <td class="px-3 py-2">
                <select
                  v-if="nextStatus(h.status)"
                  class="input-field !py-1 text-xs"
                  :value="h.status"
                  @change="onStatusChange(h.id, ($event.target as HTMLSelectElement).value as HazardStatus)"
                >
                  <option v-for="s in statusFlow" :key="s" :value="s">
                    {{ HAZARD_STATUS_LABELS[s] }}
                  </option>
                </select>
                <span v-else class="text-xs text-slate-500">已完结</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import { useDbStore } from '@/stores/db'
import {
  HAZARD_SEVERITY_LABELS,
  HAZARD_STATUS_LABELS,
  type HazardSeverity,
  type HazardStatus,
} from '@/utils/types'

const dbStore = useDbStore()

const statusFlow: HazardStatus[] = [
  'Found',
  'Verified',
  'Dispatched',
  'Rectifying',
  'Rectified',
  'Verified_Close',
  'Archived',
]

function nextStatus(current: HazardStatus): HazardStatus | null {
  if (['Archived', 'Verified_Close', 'Rejected'].includes(current)) return null
  return current
}

function onStatusChange(id: number, status: HazardStatus) {
  dbStore.patchHazardStatus(id, status)
}

function severityClass(s: HazardSeverity) {
  const map: Record<HazardSeverity, string> = {
    Minor: 'bg-slate-700 text-slate-200',
    Major: 'bg-amber-500/20 text-amber-300',
    Critical: 'bg-fire-600/30 text-fire-200',
  }
  return map[s]
}
</script>
