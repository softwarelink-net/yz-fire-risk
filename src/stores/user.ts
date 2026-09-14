import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { canAccessRoute, findUserByCredentials, getUserById } from '@/utils/db'
import { ROLE_LABELS, type User, type UserRole } from '@/utils/types'

const SESSION_KEY = 'yz_fire_risk_session'
const AUTH_TOKEN_KEY = 'auth_token'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const ready = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const role = computed<UserRole | null>(() => user.value?.role ?? null)
  const roleLabel = computed(() => (role.value ? ROLE_LABELS[role.value] : ''))
  const displayName = computed(() => user.value?.real_name ?? user.value?.username ?? '')

  function restoreSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (!raw || !token) {
        ready.value = true
        return
      }
      const { userId } = JSON.parse(raw) as { userId: number }
      const found = getUserById(userId)
      user.value = found
      if (!found) {
        localStorage.removeItem(SESSION_KEY)
        localStorage.removeItem(AUTH_TOKEN_KEY)
      }
    } catch {
      localStorage.removeItem(SESSION_KEY)
      localStorage.removeItem(AUTH_TOKEN_KEY)
    } finally {
      ready.value = true
    }
  }

  function login(username: string, password: string): { ok: boolean; message: string } {
    const found = findUserByCredentials(username.trim(), password)
    if (!found) {
      return { ok: false, message: '用户名或密码错误' }
    }
    user.value = found
    const token = `yz_${found.id}_${Date.now()}`
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: found.id }))
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    return { ok: true, message: '登录成功' }
  }

  function logout() {
    user.value = null
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  function hasAccess(path: string): boolean {
    if (!user.value) return false
    return canAccessRoute(user.value.role, path)
  }

  return {
    user,
    ready,
    isAuthenticated,
    role,
    roleLabel,
    displayName,
    restoreSession,
    login,
    logout,
    hasAccess,
  }
})
