export type UserRole = 'R_SUPER' | 'R_MGR' | 'R_AGENT' | 'R_LEAD'

export interface User {
  id: number
  username: string
  password_hash: string
  role: UserRole
  real_name: string
  department: string | null
  phone: string | null
  is_active: number
  created_at?: string
}

export interface SystemConfig {
  key: string
  value: string
  description: string | null
  updated_at: string
}

export interface FireUnit {
  id: number
  name: string
  address: string
  contact_person: string | null
  contact_phone: string | null
  fire_rating: string | null
  last_inspection_date: string | null
  coordinates_lat: number | null
  coordinates_lng: number | null
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

export interface RiskRecord {
  id: number
  unit_id: number
  risk_score: number
  risk_level: RiskLevel
  accident_risk_score: number | null
  hidden_danger_risk_score: number | null
  facility_risk_score: number | null
  governance_risk_score: number | null
  exposure_risk_score: number | null
  last_calculated_at: string
  notes: string | null
  unit_name?: string
  unit_address?: string
}

export type HazardSeverity = 'Minor' | 'Major' | 'Critical'

export type HazardStatus =
  | 'Found'
  | 'Verified'
  | 'Dispatched'
  | 'Rectifying'
  | 'Rectified'
  | 'Verified_Close'
  | 'Archived'
  | 'Rejected'

export interface Hazard {
  id: number
  hazard_code: string
  location: string
  description: string
  category: string | null
  severity: HazardSeverity
  status: HazardStatus
  found_by: number | null
  found_at: string
  dispatch_to: number | null
  dispatched_at: string | null
  rectified_by: number | null
  rectified_at: string | null
  verified_by: number | null
  verified_at: string | null
  archive_date: string | null
  found_by_name?: string
}

export type DocumentStatus = 'Draft' | 'Reviewing' | 'Approved' | 'Issued'

export interface EnforcementCase {
  id: number
  case_number: string
  unit_id: number | null
  inspector_id: number | null
  violation_description: string | null
  legal_basis: string | null
  suggested_penalty: number | null
  document_status: DocumentStatus
  created_at: string
  updated_at: string
  unit_name?: string
  inspector_name?: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  R_SUPER: '系统超级管理员',
  R_MGR: '消防监督主管',
  R_AGENT: '消防监督员',
  R_LEAD: '决策层领导',
}

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  R_SUPER: 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30',
  R_MGR: 'bg-fire-500/20 text-fire-300 ring-1 ring-fire-400/30',
  R_AGENT: 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-400/30',
  R_LEAD: 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30',
}

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  Low: '低风险',
  Medium: '中风险',
  High: '高风险',
  Critical: '极高风险',
}

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  Low: '#22c55e',
  Medium: '#eab308',
  High: '#f97316',
  Critical: '#E63946',
}

export const HAZARD_STATUS_LABELS: Record<HazardStatus, string> = {
  Found: '已发现',
  Verified: '已核实',
  Dispatched: '已派发',
  Rectifying: '整改中',
  Rectified: '已整改',
  Verified_Close: '复核关闭',
  Archived: '已归档',
  Rejected: '已驳回',
}

export const HAZARD_SEVERITY_LABELS: Record<HazardSeverity, string> = {
  Minor: '一般',
  Major: '较大',
  Critical: '重大',
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  Draft: '草稿',
  Reviewing: '审核中',
  Approved: '已批准',
  Issued: '已下发',
}

export const ROLE_ROUTES: Record<UserRole, string[]> = {
  R_SUPER: [
    '/dashboard',
    '/risk-analysis',
    '/hazard-governance',
    '/enforcement',
    '/case-review',
    '/settings',
  ],
  R_MGR: ['/dashboard', '/risk-analysis', '/hazard-governance', '/enforcement', '/case-review'],
  R_AGENT: ['/dashboard', '/hazard-governance', '/enforcement'],
  R_LEAD: ['/dashboard', '/risk-analysis'],
}
