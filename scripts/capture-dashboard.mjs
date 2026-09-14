#!/usr/bin/env node
/**
 * Capture dashboard screenshot for README after local preview is up.
 * Usage: node scripts/capture-dashboard.mjs [baseUrl]
 */
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const out = join(root, 'docs/assets/dashboard-preview.png')
const base = process.argv[2] || 'http://127.0.0.1:5173'

mkdirSync(dirname(out), { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})

try {
  await page.goto(`${base}/login`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForSelector('input[autocomplete="username"]', { timeout: 30000 })
  await page.fill('input[autocomplete="username"]', 'admin')
  await page.fill('input[autocomplete="current-password"]', 'admin123')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard', { timeout: 30000 })
  await page.waitForTimeout(2500)
  await page.screenshot({ path: out, fullPage: false })
  console.log(`Saved ${out}`)
} finally {
  await browser.close()
}
