<template>
  <article>
    <div class="card !p-8">
      <p class="font-mono text-xs font-medium uppercase tracking-wider text-fire-400">
        招标公告摘要（公开信息）
      </p>
      <h1 class="mt-2 font-display text-2xl font-bold text-slate-100">
        扬州市消防救援支队2026年度火灾风险研判和隐患治理决策辅助系统项目采购公告
      </h1>
      <dl class="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-slate-500">项目发包方</dt>
          <dd class="font-medium text-slate-100">扬州市消防救援支队本级</dd>
        </div>
        <div>
          <dt class="text-slate-500">项目编号</dt>
          <dd class="font-mono font-medium text-fire-300">JSZC-321000-JZCG-G2026-0093</dd>
        </div>
        <div>
          <dt class="text-slate-500">发布时间</dt>
          <dd class="font-medium text-slate-100">2026年09月01日</dd>
        </div>
        <div>
          <dt class="text-slate-500">预算金额</dt>
          <dd class="font-medium text-orange-300">1,409,000.00 元</dd>
        </div>
      </dl>
      <p class="mt-6 text-sm leading-relaxed text-slate-300">
        扬州市消防救援支队计划采购一套火灾风险研判和隐患治理决策辅助系统。技术要点涵盖风险智能研判预警、隐患治理协同闭环、消防执法助手、综合态势展示与决策分析、行政处罚案卷智能评查五大核心模块；需满足等保三级和商用密码应用安全性评估要求，并与驯火系统、防消联勤信息系统、消防设施联网监测平台、119接处警系统完成数据对接。本演示站仅基于公开标讯信息做技术推演展示。
      </p>
      <div class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="badge bg-slate-800 text-slate-300 ring-1 ring-slate-700"
          >{{ tag }}</span
        >
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const tags = ['扬州消防', '风险研判', '隐患治理', '决策辅助', '政府采购', '执法助手']
</script>
