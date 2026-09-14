<template>
  <div class="app-with-banner min-h-screen bg-geo-grid text-white">
    <GlobalStickyBanner />

    <header class="border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-fire-500 font-display text-lg font-bold shadow-glow"
          >
            扬
          </div>
          <div>
            <p class="font-display text-lg font-semibold">YFR-DSS</p>
            <p class="text-xs text-slate-400">扬州消防火灾风险研判决策辅助系统</p>
          </div>
        </div>
        <nav class="hidden items-center gap-6 text-sm md:flex">
          <RouterLink to="/tender" class="text-slate-300 hover:text-white">招标公告</RouterLink>
          <RouterLink to="/login" class="btn-primary">登录演示系统</RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 py-16 animate-fade-in">
      <section class="text-center">
        <p class="font-mono text-sm uppercase tracking-widest text-fire-400">
          Yangzhou Fire Risk Decision Support System
        </p>
        <h1 class="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          从被动响应到
          <span class="bg-gradient-to-r from-fire-400 to-orange-400 bg-clip-text text-transparent">
            主动预防
          </span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          覆盖风险研判、隐患闭环、执法辅助、态势展示与案卷评查五大模块，预算 140.9 万元，部署于扬州市政务云。
        </p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <RouterLink to="/login" class="btn-primary px-8 py-3 text-base">进入演示系统</RouterLink>
          <RouterLink to="/tender" class="btn-secondary px-8 py-3 text-base">查看招标详情</RouterLink>
        </div>
      </section>

      <section class="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-fire-500/30 hover:shadow-glow"
        >
          <component :is="feature.icon" class="h-8 w-8 text-fire-400" />
          <h3 class="mt-4 font-display text-lg font-semibold">{{ feature.title }}</h3>
          <p class="mt-2 text-sm text-slate-400">{{ feature.desc }}</p>
        </div>
      </section>

      <section class="mt-20 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
        <h2 class="font-display text-2xl font-semibold">演示账号</h2>
        <p class="mt-2 text-sm text-slate-400">登录后可体验 RBAC 权限与 ECharts 态势驾驶舱</p>
        <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="acc in accounts"
            :key="acc.user"
            class="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-left"
          >
            <p class="text-sm font-medium text-slate-200">{{ acc.role }}</p>
            <p class="mt-1 font-mono text-xs text-fire-300">{{ acc.user }} / {{ acc.pass }}</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
      <p>扬州市消防救援支队 · JSZC-321000-JZCG-G2026-0093 · 纯前端技术演示</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline'
import GlobalStickyBanner from '@/components/GlobalStickyBanner.vue'

const features = [
  {
    title: '风险智能研判',
    desc: '五大维度动态评分：事故、隐患、设施、治理、暴露风险。',
    icon: ExclamationTriangleIcon,
  },
  {
    title: '隐患治理闭环',
    desc: '发现→核实→派发→整改→复核→归档全流程跟踪。',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: '消防执法助手',
    desc: 'AI 辅助执法文书生成与裁量建议，对接消防法规知识库。',
    icon: ShieldCheckIcon,
  },
  {
    title: '综合态势展示',
    desc: 'GIS 图层、119 接处警数据流与全市风险态势可视化。',
    icon: ChartBarIcon,
  },
  {
    title: '案卷智能评查',
    desc: 'OCR 解析与规则校验，自动检测程序与法条引用错误。',
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    title: '等保三级 + 密评',
    desc: '微服务架构，容器化部署，满足政务云安全合规要求。',
    icon: ShieldCheckIcon,
  },
]

const accounts = [
  { role: '超级管理员', user: 'admin', pass: 'admin123' },
  { role: '消防主管', user: 'mgr_zhang', pass: 'mgr123' },
  { role: '消防监督员', user: 'agent_li', pass: 'agent123' },
  { role: '决策领导', user: 'chief_wang', pass: 'chief123' },
]
</script>
