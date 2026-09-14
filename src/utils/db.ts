import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import { ROLE_ROUTES } from './types'
import type {
  EnforcementCase,
  FireUnit,
  Hazard,
  HazardStatus,
  RiskLevel,
  RiskRecord,
  SystemConfig,
  User,
  UserRole,
} from './types'

const STORAGE_KEY = 'yz_fire_risk_db_v1'
const WASM_CDN = 'https://sql.js.org/dist/sql-wasm.wasm'

let SQL: SqlJsStatic | null = null
let db: Database | null = null

const T = {
  users: 'yz_users',
  configs: 'yz_system_configs',
  units: 'yz_units',
  risks: 'yz_risks',
  hazards: 'yz_hazards',
  cases: 'yz_enforcement_cases',
}

function queryAll<T>(sql: string, params: (string | number | null)[] = []): T[] {
  const database = getDb()
  const stmt = database.prepare(sql)
  stmt.bind(params)
  const rows: T[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T)
  }
  stmt.free()
  return rows
}

function queryOne<T>(sql: string, params: (string | number | null)[] = []): T | null {
  const rows = queryAll<T>(sql, params)
  return rows[0] ?? null
}

function persist() {
  if (!db) return
  try {
    const data = db.export()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(data)))
  } catch (e) {
    console.warn('Failed to persist DB to localStorage', e)
  }
}

function loadFromStorage(): Uint8Array | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return new Uint8Array(JSON.parse(raw) as number[])
  } catch {
    return null
  }
}

function createSchema(database: Database) {
  database.run(`
    CREATE TABLE IF NOT EXISTS ${T.users} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('R_SUPER', 'R_MGR', 'R_AGENT', 'R_LEAD')),
      real_name TEXT NOT NULL,
      department TEXT,
      phone TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ${T.configs} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ${T.units} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      contact_person TEXT,
      contact_phone TEXT,
      fire_rating TEXT,
      last_inspection_date DATE,
      coordinates_lat REAL,
      coordinates_lng REAL
    );

    CREATE TABLE IF NOT EXISTS ${T.risks} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_id INTEGER,
      risk_score REAL NOT NULL,
      risk_level TEXT CHECK(risk_level IN ('Low', 'Medium', 'High', 'Critical')),
      accident_risk_score REAL,
      hidden_danger_risk_score REAL,
      facility_risk_score REAL,
      governance_risk_score REAL,
      exposure_risk_score REAL,
      last_calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY(unit_id) REFERENCES ${T.units}(id)
    );

    CREATE TABLE IF NOT EXISTS ${T.hazards} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hazard_code TEXT UNIQUE NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT,
      severity TEXT CHECK(severity IN ('Minor', 'Major', 'Critical')),
      status TEXT CHECK(status IN ('Found', 'Verified', 'Dispatched', 'Rectifying', 'Rectified', 'Verified_Close', 'Archived', 'Rejected')),
      found_by INTEGER,
      found_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      dispatch_to INTEGER,
      dispatched_at DATETIME,
      rectified_by INTEGER,
      rectified_at DATETIME,
      verified_by INTEGER,
      verified_at DATETIME,
      archive_date DATETIME,
      FOREIGN KEY(found_by) REFERENCES ${T.users}(id),
      FOREIGN KEY(dispatch_to) REFERENCES ${T.users}(id),
      FOREIGN KEY(rectified_by) REFERENCES ${T.users}(id),
      FOREIGN KEY(verified_by) REFERENCES ${T.users}(id)
    );

    CREATE TABLE IF NOT EXISTS ${T.cases} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_number TEXT UNIQUE NOT NULL,
      unit_id INTEGER,
      inspector_id INTEGER,
      violation_description TEXT,
      legal_basis TEXT,
      suggested_penalty REAL,
      document_status TEXT CHECK(document_status IN ('Draft', 'Reviewing', 'Approved', 'Issued')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(unit_id) REFERENCES ${T.units}(id),
      FOREIGN KEY(inspector_id) REFERENCES ${T.users}(id)
    );
  `)
}

function seedData(database: Database) {
  const check = database.exec(`SELECT COUNT(*) as c FROM ${T.users}`)
  if (check.length && (check[0].values[0][0] as number) > 0) return

  database.run(`
    INSERT INTO ${T.users} (username, password_hash, role, real_name, department) VALUES
    ('admin', 'admin123', 'R_SUPER', 'System Admin', 'IT Dept'),
    ('mgr_zhang', 'mgr123', 'R_MGR', '张主管', 'Fire Supervision Division'),
    ('agent_li', 'agent123', 'R_AGENT', '李监督员', 'Pingqiao District Station'),
    ('chief_wang', 'chief123', 'R_LEAD', '王支队长', 'Command Center');

    INSERT INTO ${T.configs} (key, value, description) VALUES
    ('risk_threshold_high', '75', 'Score above which risk is considered High'),
    ('risk_threshold_critical', '90', 'Score above which risk is considered Critical'),
    ('max_rectification_days', '15', 'Max days allowed for rectification'),
    ('site_name', '扬州消防火灾风险研判决策辅助系统', '系统全局名称'),
    ('budget_amount', '1409000.00', '项目预算金额');

    INSERT INTO ${T.units} (name, address, contact_person, contact_phone, fire_rating, last_inspection_date, coordinates_lat, coordinates_lng) VALUES
    ('扬州万达广场', '广陵路189号', '陈先生', '13800138000', 'A', '2026-08-20', 32.395, 119.435),
    ('大明路历史街区餐饮集群', '大明路5号', '李女士', '13900139000', 'B', '2026-07-15', 32.398, 119.440),
    ('开发区科技园区仓储中心', '开发区88号', '赵先生', '13700137000', 'C', '2026-06-30', 32.410, 119.450),
    ('邗江区某高层住宅', '邗江中路120号', '孙经理', '13600136000', 'B', '2026-08-10', 32.392, 119.428),
    ('江都区化工企业', '江都大道66号', '周主任', '13500135000', 'A', '2026-08-25', 32.420, 119.460);

    INSERT INTO ${T.risks} (unit_id, risk_score, risk_level, accident_risk_score, hidden_danger_risk_score, facility_risk_score, governance_risk_score, exposure_risk_score) VALUES
    (1, 85.5, 'High', 20.0, 30.5, 15.0, 10.0, 10.0),
    (2, 45.0, 'Medium', 10.0, 15.0, 10.0, 5.0, 5.0),
    (3, 92.0, 'Critical', 30.0, 25.0, 20.0, 10.0, 7.0),
    (4, 62.0, 'Medium', 12.0, 18.0, 14.0, 10.0, 8.0),
    (5, 78.0, 'High', 22.0, 20.0, 18.0, 10.0, 8.0);

    INSERT INTO ${T.hazards} (hazard_code, location, description, category, severity, status, found_by) VALUES
    ('HZ-2026-001', '扬州万达广场 B1层', '灭火器压力不足', 'Fire Extinguisher', 'Minor', 'Dispatched', 3),
    ('HZ-2026-002', '大明路历史街区 厨房', '燃气泄漏报警器故障', 'Gas Safety', 'Major', 'Verified', 3),
    ('HZ-2026-003', '开发区仓储中心 3号通道', '安全出口被堵塞', 'Evacuation', 'Critical', 'Found', 3),
    ('HZ-2026-004', '邗江高层住宅 地下停车场', '自动喷淋系统水压偏低', 'Sprinkler', 'Major', 'Rectifying', 3),
    ('HZ-2026-005', '江都化工企业 罐区', '消防栓无水', 'Hydrant', 'Critical', 'Dispatched', 3),
    ('HZ-2026-006', '扬州万达广场 5层', '疏散指示标志损坏', 'Evacuation', 'Minor', 'Rectified', 3);

    INSERT INTO ${T.cases} (case_number, unit_id, inspector_id, violation_description, legal_basis, suggested_penalty, document_status) VALUES
    ('CASE-2026-001', 1, 3, '未按月开展防火检查', 'Fire Control Law Art. 16', 5000.0, 'Draft'),
    ('CASE-2026-002', 2, 3, '占用疏散通道', 'Fire Control Law Art. 60', 3000.0, 'Reviewing'),
    ('CASE-2026-003', 3, 3, '消防设施未保持完好有效', 'Fire Control Law Art. 60', 8000.0, 'Approved');
  `)
}

export async function initDatabase(): Promise<Database> {
  if (db) return db

  SQL = await initSqlJs({ locateFile: () => WASM_CDN })

  const saved = loadFromStorage()
  if (saved) {
    db = new SQL.Database(saved)
  } else {
    db = new SQL.Database()
    createSchema(db)
    seedData(db)
    persist()
  }

  return db
}

export function getDb(): Database {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.')
  return db
}

export function resetDatabase(): void {
  if (!SQL) throw new Error('SQL.js not loaded')
  localStorage.removeItem(STORAGE_KEY)
  db?.close()
  db = new SQL.Database()
  createSchema(db)
  seedData(db)
  persist()
}

export function findUserByCredentials(username: string, password: string): User | null {
  return queryOne<User>(
    `SELECT * FROM ${T.users} WHERE username = ? AND password_hash = ? AND is_active = 1`,
    [username, password],
  )
}

export function getUserById(id: number): User | null {
  return queryOne<User>(`SELECT * FROM ${T.users} WHERE id = ?`, [id])
}

export function listUsers(): User[] {
  return queryAll<User>(`SELECT * FROM ${T.users} ORDER BY id ASC`)
}

export function listConfigs(): SystemConfig[] {
  return queryAll<SystemConfig>(`SELECT * FROM ${T.configs} ORDER BY key ASC`)
}

export function listUnits(): FireUnit[] {
  return queryAll<FireUnit>(`SELECT * FROM ${T.units} ORDER BY id ASC`)
}

export function listRisks(): RiskRecord[] {
  return queryAll<RiskRecord>(
    `SELECT r.*, u.name as unit_name, u.address as unit_address
     FROM ${T.risks} r
     LEFT JOIN ${T.units} u ON r.unit_id = u.id
     ORDER BY r.risk_score DESC`,
  )
}

export function listHazards(filters?: { status?: HazardStatus }): Hazard[] {
  let sql = `
    SELECT h.*, u.real_name as found_by_name
    FROM ${T.hazards} h
    LEFT JOIN ${T.users} u ON h.found_by = u.id
    WHERE 1=1
  `
  const params: (string | number)[] = []
  if (filters?.status) {
    sql += ` AND h.status = ?`
    params.push(filters.status)
  }
  sql += ` ORDER BY
    CASE h.severity WHEN 'Critical' THEN 0 WHEN 'Major' THEN 1 ELSE 2 END,
    h.found_at DESC`
  return queryAll<Hazard>(sql, params)
}

export function updateHazardStatus(id: number, status: HazardStatus): void {
  getDb().run(`UPDATE ${T.hazards} SET status = ? WHERE id = ?`, [status, id])
  persist()
}

export function listCases(): EnforcementCase[] {
  return queryAll<EnforcementCase>(
    `SELECT c.*, u.name as unit_name, i.real_name as inspector_name
     FROM ${T.cases} c
     LEFT JOIN ${T.units} u ON c.unit_id = u.id
     LEFT JOIN ${T.users} i ON c.inspector_id = i.id
     ORDER BY c.created_at DESC`,
  )
}

export function getStats() {
  const risks = listRisks()
  const hazards = listHazards()
  const cases = listCases()
  const units = listUnits()

  const riskLevelCounts: Record<RiskLevel, number> = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0,
  }
  for (const r of risks) {
    riskLevelCounts[r.risk_level] = (riskLevelCounts[r.risk_level] || 0) + 1
  }

  const hazardStatusCounts: Record<string, number> = {}
  for (const h of hazards) {
    hazardStatusCounts[h.status] = (hazardStatusCounts[h.status] || 0) + 1
  }

  const openHazards = hazards.filter(
    (h) => !['Archived', 'Verified_Close', 'Rejected'].includes(h.status),
  ).length

  const criticalHazards = hazards.filter((h) => h.severity === 'Critical' && h.status !== 'Archived').length

  const avgRisk =
    risks.length === 0
      ? 0
      : Math.round((risks.reduce((s, r) => s + r.risk_score, 0) / risks.length) * 10) / 10

  return {
    unitCount: units.length,
    avgRiskScore: avgRisk,
    openHazards,
    criticalHazards,
    pendingCases: cases.filter((c) => c.document_status === 'Draft' || c.document_status === 'Reviewing').length,
    riskLevelCounts,
    hazardStatusCounts,
    highRiskUnits: risks.filter((r) => r.risk_level === 'High' || r.risk_level === 'Critical').length,
  }
}

export function canAccessRoute(role: UserRole, path: string): boolean {
  const allowed = ROLE_ROUTES[role] ?? []
  return allowed.some((r) => path === r || path.startsWith(`${r}/`))
}
