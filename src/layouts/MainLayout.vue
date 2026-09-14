<template>
  <div class="app-with-banner flex min-h-screen bg-slate-950">
    <GlobalStickyBanner />

    <aside
      :class="[
        'fixed left-0 top-10 z-40 flex h-[calc(100vh-40px)] flex-col border-r border-slate-800 bg-panel-950 text-slate-200 transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
      ]"
    >
      <div class="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fire-500 text-sm font-bold text-white shadow-glow"
        >
          扬
        </div>
        <div v-show="!collapsed" class="min-w-0">
          <p class="truncate font-display text-sm font-semibold text-white">扬州消防 · YFR-DSS</p>
          <p class="truncate font-mono text-[10px] text-fire-300">yz-fire-risk</p>
        </div>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto p-3">
        <RouterLink
          v-for="item in visibleNav"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
          :class="
            isActive(item.to)
              ? 'bg-fire-600/25 text-white ring-1 ring-fire-500/40'
              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
          "
          :title="item.label"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0 opacity-90" />
          <span v-show="!collapsed" class="truncate">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="border-t border-slate-800 p-3">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
          @click="collapsed = !collapsed"
        >
          <Bars3Icon class="h-5 w-5" />
          <span v-show="!collapsed">{{ collapsed ? '展开' : '收起菜单' }}</span>
        </button>
      </div>
    </aside>

    <div
      :class="[
        'flex min-h-[calc(100vh-40px)] flex-1 flex-col transition-all duration-300',
        collapsed ? 'ml-[72px]' : 'ml-64',
      ]"
    >
      <header
        class="sticky top-10 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 backdrop-blur"
      >
        <div>
          <p class="font-mono text-xs text-slate-500">当前位置</p>
          <h2 class="text-sm font-semibold text-slate-100">{{ pageTitle }}</h2>
        </div>
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="relative rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-fire-300"
            title="隐患预警"
            @click="$router.push('/hazard-governance')"
          >
            <BellAlertIcon class="h-5 w-5" />
            <span
              v-if="dbStore.stats.openHazards > 0"
              class="absolute right-1 top-1 h-2 w-2 rounded-full bg-fire-500"
            />
          </button>
          <div class="flex items-center gap-3 border-l border-slate-800 pl-4">
            <div class="text-right">
              <p class="text-sm font-medium text-slate-100">{{ userStore.displayName }}</p>
              <span
                v-if="userStore.role"
                class="badge mt-0.5"
                :class="ROLE_BADGE_COLORS[userStore.role]"
              >
                {{ userStore.roleLabel }}
              </span>
            </div>
            <button type="button" class="btn-secondary !px-3 !py-1.5 text-xs" @click="onLogout">
              退出
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 bg-slate-950 p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Bars3Icon,
  BellAlertIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GlobalStickyBanner from '@/components/GlobalStickyBanner.vue'
import { useDbStore } from '@/stores/db'
import { useUserStore } from '@/stores/user'
import { ROLE_BADGE_COLORS, ROLE_ROUTES, type UserRole } from '@/utils/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const dbStore = useDbStore()
const collapsed = ref(false)

const navItems = [
  { to: '/dashboard', label: '综合态势驾驶舱', icon: ChartBarIcon },
  { to: '/risk-analysis', label: '风险智能研判', icon: ExclamationTriangleIcon },
  { to: '/hazard-governance', label: '隐患治理闭环', icon: ClipboardDocumentCheckIcon },
  { to: '/enforcement', label: '消防执法助手', icon: ShieldCheckIcon },
  { to: '/case-review', label: '案卷智能评查', icon: DocumentMagnifyingGlassIcon },
  { to: '/settings', label: '系统配置', icon: Cog6ToothIcon },
]

const visibleNav = computed(() => {
  const role = userStore.role as UserRole
  const allowed = ROLE_ROUTES[role] ?? []
  return navItems.filter((item) => allowed.includes(item.to))
})

const pageTitle = computed(() => (route.meta.title as string) || '控制台')

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function onLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
