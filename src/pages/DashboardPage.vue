<template>
  <div class="space-y-6">
    <section
      class="relative overflow-hidden rounded-2xl border border-fire-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-6 text-white shadow-glow"
    >
      <div
        class="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-fire-500/20 blur-3xl"
      />
      <div
        class="pointer-events-none absolute bottom-0 left-1/4 h-32 w-56 rounded-full bg-orange-400/10 blur-2xl"
      />
      <div class="relative">
        <p class="font-mono text-sm text-fire-300">扬州市消防救援支队 · YFR-DSS</p>
        <h1 class="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          综合态势驾驶舱
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-slate-300">
          汇聚单位风险评分、隐患闭环进度与执法案件状态，支撑决策层宏观研判与基层闭环处置。
        </p>
        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            v-for="kpi in kpis"
            :key="kpi.label"
            class="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-fire-400/20"
          >
            <p class="text-xs text-slate-400">{{ kpi.label }}</p>
            <p class="mt-1 font-display text-2xl font-semibold tabular-nums text-fire-100">
              {{ kpi.value }}
            </p>
            <p class="font-mono text-[11px] text-slate-500">{{ kpi.hint }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard title="单位风险等级分布" subtitle="Low / Medium / High / Critical">
        <VChart class="h-72 w-full" :option="riskPieOption" autoresize />
      </BaseCard>
      <BaseCard title="隐患治理漏斗" subtitle="按处理状态统计">
        <VChart class="h-72 w-full" :option="hazardFunnelOption" autoresize />
      </BaseCard>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <BaseCard class="lg:col-span-2" title="隐患状态分布" subtitle="闭环进度一览">
        <VChart class="h-64 w-full" :option="hazardBarOption" autoresize />
      </BaseCard>
      <BaseCard title="五大风险维度均值" subtitle="全市加权平均">
        <VChart class="h-64 w-full" :option="radarOption" autoresize />
      </BaseCard>
    </div>

    <BaseCard title="重点单位风险排行" subtitle="按综合风险评分降序">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-slate-800 text-xs text-slate-400">
            <tr>
              <th class="px-3 py-2">单位名称</th>
              <th class="px-3 py-2">地址</th>
              <th class="px-3 py-2">综合评分</th>
              <th class="px-3 py-2">风险等级</th>
              <th class="px-3 py-2">事故</th>
              <th class="px-3 py-2">隐患</th>
              <th class="px-3 py-2">设施</th>
              <th class="px-3 py-2">治理</th>
              <th class="px-3 py-2">暴露</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in dbStore.risks"
              :key="row.id"
              class="border-b border-slate-800/70 transition hover:bg-slate-800/40"
            >
              <td class="px-3 py-2.5 font-medium text-slate-100">{{ row.unit_name }}</td>
              <td class="max-w-[180px] truncate px-3 py-2.5 text-slate-400">{{ row.unit_address }}</td>
              <td class="px-3 py-2.5">
                <span class="font-display text-lg font-semibold tabular-nums" :style="{ color: riskColor(row.risk_level) }">
                  {{ row.risk_score }}
                </span>
              </td>
              <td class="px-3 py-2.5">
                <span class="badge" :class="riskBadgeClass(row.risk_level)">
                  {{ RISK_LEVEL_LABELS[row.risk_level] }}
                </span>
              </td>
              <td class="px-3 py-2.5 tabular-nums text-slate-300">{{ row.accident_risk_score }}</td>
              <td class="px-3 py-2.5 tabular-nums text-slate-300">{{ row.hidden_danger_risk_score }}</td>
              <td class="px-3 py-2.5 tabular-nums text-slate-300">{{ row.facility_risk_score }}</td>
              <td class="px-3 py-2.5 tabular-nums text-slate-300">{{ row.governance_risk_score }}</td>
              <td class="px-3 py-2.5 tabular-nums text-slate-300">{{ row.exposure_risk_score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard title="待处置隐患">
        <ul class="space-y-3">
          <li
            v-for="h in openHazards"
            :key="h.id"
            class="rounded-lg border border-slate-800 px-3 py-2"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="font-mono text-sm text-fire-300">{{ h.hazard_code }}</p>
              <span class="badge shrink-0" :class="severityClass(h.severity)">{{
                HAZARD_SEVERITY_LABELS[h.severity]
              }}</span>
            </div>
            <p class="mt-1 text-sm text-slate-200">{{ h.location }}</p>
            <p class="mt-0.5 text-xs text-slate-400">{{ h.description }}</p>
            <span class="badge mt-2 bg-slate-800 text-slate-300">{{
              HAZARD_STATUS_LABELS[h.status]
            }}</span>
          </li>
          <li v-if="!openHazards.length" class="text-sm text-slate-500">暂无待处置隐患</li>
        </ul>
      </BaseCard>
      <BaseCard title="在办执法案件">
        <ul class="space-y-3">
          <li
            v-for="c in pendingCases"
            :key="c.id"
            class="rounded-lg border border-slate-800 px-3 py-2"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="font-mono text-sm text-fire-300">{{ c.case_number }}</p>
              <span class="badge bg-slate-800 text-slate-300">{{
                DOCUMENT_STATUS_LABELS[c.document_status]
              }}</span>
            </div>
            <p class="mt-1 text-xs text-slate-300">{{ c.unit_name }}</p>
            <p class="mt-0.5 text-xs text-slate-500">{{ c.violation_description }}</p>
          </li>
        </ul>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, FunnelChart, PieChart, RadarChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useDbStore } from '@/stores/db'
import {
  DOCUMENT_STATUS_LABELS,
  HAZARD_SEVERITY_LABELS,
  HAZARD_STATUS_LABELS,
  RISK_LEVEL_COLORS,
  RISK_LEVEL_LABELS,
  type HazardSeverity,
  type RiskLevel,
} from '@/utils/types'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  FunnelChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
])

const dbStore = useDbStore()

const kpis = computed(() => [
  { label: '监管单位', value: String(dbStore.stats.unitCount), hint: '重点场所' },
  { label: '平均风险分', value: String(dbStore.stats.avgRiskScore), hint: '0-100 综合评分' },
  { label: '待闭环隐患', value: String(dbStore.stats.openHazards), hint: `重大 ${dbStore.stats.criticalHazards}` },
  { label: '高危单位', value: String(dbStore.stats.highRiskUnits), hint: `在办案件 ${dbStore.stats.pendingCases}` },
])

const openHazards = computed(() =>
  dbStore.hazards.filter((h) => !['Archived', 'Verified_Close'].includes(h.status)).slice(0, 5),
)

const pendingCases = computed(() =>
  dbStore.cases.filter((c) => c.document_status !== 'Issued').slice(0, 5),
)

const riskPieOption = computed(() => {
  const counts = dbStore.stats.riskLevelCounts
  const levels: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical']
  return {
    backgroundColor: 'transparent',
    color: levels.map((l) => RISK_LEVEL_COLORS[l]),
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#94a3b8' } },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        label: { color: '#cbd5e1' },
        data: levels.map((level) => ({
          name: RISK_LEVEL_LABELS[level],
          value: counts[level] || 0,
        })),
      },
    ],
  }
})

const hazardFunnelOption = computed(() => {
  const statusOrder = ['Found', 'Verified', 'Dispatched', 'Rectifying', 'Rectified', 'Verified_Close']
  const counts = dbStore.stats.hazardStatusCounts
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    color: ['#E63946', '#f97316', '#eab308', '#38bdf8', '#22c55e', '#64748b'],
    series: [
      {
        type: 'funnel',
        left: '10%',
        width: '80%',
        minSize: '20%',
        maxSize: '100%',
        sort: 'none',
        gap: 4,
        label: {
          show: true,
          color: '#e2e8f0',
          formatter: (p: { name: string; value: number }) =>
            `${HAZARD_STATUS_LABELS[p.name as keyof typeof HAZARD_STATUS_LABELS] || p.name}: ${p.value}`,
        },
        data: statusOrder.map((s) => ({
          name: s,
          value: counts[s] || 0,
        })),
      },
    ],
  }
})

const hazardBarOption = computed(() => {
  const counts = dbStore.stats.hazardStatusCounts
  const statuses = Object.keys(counts)
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 24, bottom: 48 },
    xAxis: {
      type: 'category',
      data: statuses.map((s) => HAZARD_STATUS_LABELS[s as keyof typeof HAZARD_STATUS_LABELS] || s),
      axisLabel: { color: '#94a3b8', rotate: 30, fontSize: 10 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    series: [
      {
        type: 'bar',
        barWidth: 24,
        itemStyle: {
          color: '#E63946',
          borderRadius: [6, 6, 0, 0],
        },
        data: statuses.map((s) => counts[s]),
      },
    ],
  }
})

const radarOption = computed(() => {
  const risks = dbStore.risks
  const avg = (key: keyof typeof risks[0]) => {
    if (!risks.length) return 0
    return Math.round(
      (risks.reduce((s, r) => s + (Number(r[key]) || 0), 0) / risks.length) * 10,
    ) / 10
  }
  return {
    backgroundColor: 'transparent',
    tooltip: {},
    radar: {
      indicator: [
        { name: '事故风险', max: 35 },
        { name: '隐患风险', max: 35 },
        { name: '设施风险', max: 25 },
        { name: '治理风险', max: 15 },
        { name: '暴露风险', max: 15 },
      ],
      axisName: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#334155' } },
      splitArea: { areaStyle: { color: ['rgba(30,41,59,0.3)', 'rgba(15,23,42,0.5)'] } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              avg('accident_risk_score'),
              avg('hidden_danger_risk_score'),
              avg('facility_risk_score'),
              avg('governance_risk_score'),
              avg('exposure_risk_score'),
            ],
            name: '全市均值',
            areaStyle: { color: 'rgba(230, 57, 70, 0.25)' },
            lineStyle: { color: '#E63946' },
            itemStyle: { color: '#E63946' },
          },
        ],
      },
    ],
  }
})

function riskColor(level: RiskLevel) {
  return RISK_LEVEL_COLORS[level]
}

function riskBadgeClass(level: RiskLevel) {
  const map: Record<RiskLevel, string> = {
    Low: 'bg-green-500/20 text-green-300',
    Medium: 'bg-yellow-500/20 text-yellow-300',
    High: 'bg-orange-500/20 text-orange-300',
    Critical: 'bg-fire-500/20 text-fire-300 ring-1 ring-fire-400/40',
  }
  return map[level]
}

function severityClass(s: HazardSeverity) {
  const map: Record<HazardSeverity, string> = {
    Minor: 'bg-slate-700 text-slate-200',
    Major: 'bg-amber-500/20 text-amber-300',
    Critical: 'bg-fire-600/30 text-fire-200 ring-1 ring-fire-400/40',
  }
  return map[s]
}
</script>
