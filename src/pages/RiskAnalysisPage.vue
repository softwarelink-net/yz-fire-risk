<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-xl font-semibold text-white">风险智能研判</h1>
      <p class="mt-1 text-sm text-slate-400">五大维度动态指标体系 · 单位/区域/行业多维评分</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard
        v-for="risk in dbStore.risks"
        :key="risk.id"
        :title="risk.unit_name || '未知单位'"
        :subtitle="`${RISK_LEVEL_LABELS[risk.risk_level]} · 综合 ${risk.risk_score}`"
      >
        <VChart class="h-56 w-full" :option="buildRadar(risk)" autoresize />
      </BaseCard>
    </div>

    <BaseCard title="风险阈值配置" subtitle="yz_system_configs">
      <div class="grid gap-4 sm:grid-cols-3">
        <div
          v-for="cfg in thresholdConfigs"
          :key="cfg.key"
          class="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
        >
          <p class="font-mono text-xs text-fire-300">{{ cfg.key }}</p>
          <p class="mt-2 font-display text-2xl font-semibold text-white">{{ cfg.value }}</p>
          <p class="mt-1 text-xs text-slate-400">{{ cfg.description }}</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { RadarComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useDbStore } from '@/stores/db'
import { RISK_LEVEL_LABELS, type RiskRecord } from '@/utils/types'

use([CanvasRenderer, RadarChart, RadarComponent, TooltipComponent])

const dbStore = useDbStore()

const thresholdConfigs = computed(() =>
  dbStore.configs.filter((c) => c.key.startsWith('risk_') || c.key === 'max_rectification_days'),
)

function buildRadar(risk: RiskRecord) {
  return {
    backgroundColor: 'transparent',
    tooltip: {},
    radar: {
      indicator: [
        { name: '事故', max: 35 },
        { name: '隐患', max: 35 },
        { name: '设施', max: 25 },
        { name: '治理', max: 15 },
        { name: '暴露', max: 15 },
      ],
      axisName: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: '#334155' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              risk.accident_risk_score ?? 0,
              risk.hidden_danger_risk_score ?? 0,
              risk.facility_risk_score ?? 0,
              risk.governance_risk_score ?? 0,
              risk.exposure_risk_score ?? 0,
            ],
            areaStyle: { color: 'rgba(230, 57, 70, 0.2)' },
            lineStyle: { color: '#E63946' },
            itemStyle: { color: '#E63946' },
          },
        ],
      },
    ],
  }
}
</script>
