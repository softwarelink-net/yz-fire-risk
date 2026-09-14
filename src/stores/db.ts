import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getStats,
  initDatabase,
  listCases,
  listConfigs,
  listHazards,
  listRisks,
  listUnits,
  listUsers,
  resetDatabase,
  updateHazardStatus,
} from '@/utils/db'
import type { EnforcementCase, FireUnit, Hazard, HazardStatus, RiskRecord, SystemConfig, User } from '@/utils/types'

export const useDbStore = defineStore('db', () => {
  const initialized = ref(false)
  const loading = ref(false)
  const units = ref<FireUnit[]>([])
  const risks = ref<RiskRecord[]>([])
  const hazards = ref<Hazard[]>([])
  const cases = ref<EnforcementCase[]>([])
  const configs = ref<SystemConfig[]>([])
  const users = ref<User[]>([])
  const stats = ref(emptyStats())

  function emptyStats() {
    return {
      unitCount: 0,
      avgRiskScore: 0,
      openHazards: 0,
      criticalHazards: 0,
      pendingCases: 0,
      riskLevelCounts: { Low: 0, Medium: 0, High: 0, Critical: 0 } as Record<string, number>,
      hazardStatusCounts: {} as Record<string, number>,
      highRiskUnits: 0,
    }
  }

  async function init() {
    if (initialized.value) return
    loading.value = true
    try {
      await initDatabase()
      refreshAll()
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  function refreshAll() {
    units.value = listUnits()
    risks.value = listRisks()
    hazards.value = listHazards()
    cases.value = listCases()
    configs.value = listConfigs()
    users.value = listUsers()
    stats.value = getStats()
  }

  function patchHazardStatus(id: number, status: HazardStatus) {
    updateHazardStatus(id, status)
    refreshAll()
  }

  function doReset() {
    resetDatabase()
    refreshAll()
  }

  return {
    initialized,
    loading,
    units,
    risks,
    hazards,
    cases,
    configs,
    users,
    stats,
    init,
    refreshAll,
    patchHazardStatus,
    doReset,
  }
})
