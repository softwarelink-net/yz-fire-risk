import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/pages/LandingPage.vue'),
    meta: { public: true },
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'LoginPage',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { public: true },
      },
    ],
  },
  {
    path: '/tender',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'Tender',
        component: () => import('@/pages/tender/ProjectDetails.vue'),
        meta: { public: true },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: {
          title: '综合态势驾驶舱',
          roles: ['R_SUPER', 'R_MGR', 'R_AGENT', 'R_LEAD'],
        },
      },
      {
        path: 'risk-analysis',
        name: 'RiskAnalysis',
        component: () => import('@/pages/RiskAnalysisPage.vue'),
        meta: {
          title: '风险智能研判',
          roles: ['R_SUPER', 'R_MGR', 'R_LEAD'],
        },
      },
      {
        path: 'hazard-governance',
        name: 'HazardGovernance',
        component: () => import('@/pages/HazardGovernancePage.vue'),
        meta: {
          title: '隐患治理闭环',
          roles: ['R_SUPER', 'R_MGR', 'R_AGENT'],
        },
      },
      {
        path: 'enforcement',
        name: 'Enforcement',
        component: () => import('@/pages/EnforcementPage.vue'),
        meta: {
          title: '消防执法助手',
          roles: ['R_SUPER', 'R_MGR', 'R_AGENT'],
        },
      },
      {
        path: 'case-review',
        name: 'CaseReview',
        component: () => import('@/pages/CaseReviewPage.vue'),
        meta: {
          title: '案卷智能评查',
          roles: ['R_SUPER', 'R_MGR'],
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/SettingsPage.vue'),
        meta: {
          title: '系统配置',
          roles: ['R_SUPER'],
        },
      },
    ],
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/pages/ForbiddenPage.vue'),
    meta: { public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { public: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (!userStore.ready) {
    userStore.restoreSession()
  }

  const isPublic = to.meta.public === true
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const isTender = to.path === '/tender' || to.path.startsWith('/tender/')
  const isLanding = to.path === '/'

  if (isTender || isLanding) {
    return true
  }

  if (to.path === '/login' && userStore.isAuthenticated) {
    return '/dashboard'
  }

  if (isPublic && !requiresAuth) {
    return true
  }

  if (requiresAuth && !userStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  const roles = to.meta.roles as string[] | undefined
  if (roles && userStore.role && !roles.includes(userStore.role)) {
    return '/403'
  }

  return true
})

export default router
