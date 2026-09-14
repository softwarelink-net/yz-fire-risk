#!/usr/bin/env node
/**
 * Upload dist/ to:
 *   1) R2 yz-fire-risk-assets
 *   2) R2 allworld-sites/yz-fire-risk/
 * Do NOT run `wrangler deploy` for the shared allworld Worker unless intentionally updating it.
 */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const dist = join(root, 'dist')
const siteId = process.argv[2] || 'yz-fire-risk'
const projectBucket = 'yz-fire-risk-assets'
const sitesBucket = 'allworld-sites'
const CONCURRENCY = 1

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.sqlite': 'application/x-sqlite3',
  '.db': 'application/x-sqlite3',
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.assetsignore' || name === '.DS_Store' || name === '_routes.json') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const wranglerBin =
  process.env.WRANGLER ||
  join(root, 'node_modules', '.bin', 'wrangler')

function put(bucket, key, file, ct) {
  return new Promise((resolve, reject) => {
    console.log(`PUT ${bucket}/${key}`)
    const args = existsSync(wranglerBin)
      ? ['r2', 'object', 'put', `${bucket}/${key}`, `--file=${file}`, `--content-type=${ct}`, '--remote']
      : [
          'wrangler',
          'r2',
          'object',
          'put',
          `${bucket}/${key}`,
          `--file=${file}`,
          `--content-type=${ct}`,
          '--remote',
        ]
    const cmd = existsSync(wranglerBin) ? wranglerBin : 'npx'
    const child = spawn(cmd, args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })
    let err = ''
    child.stderr.on('data', (d) => {
      err += d.toString()
    })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`put failed ${bucket}/${key}\n${err}`))
    })
  })
}

async function runPool(tasks, limit) {
  let i = 0
  const workers = Array.from({ length: limit }, async () => {
    while (i < tasks.length) {
      const idx = i++
      await tasks[idx]()
    }
  })
  await Promise.all(workers)
}

async function main() {
  if (!existsSync(dist)) {
    console.error('dist/ missing — run npm run build first')
    process.exit(1)
  }

  const files = walk(dist)
  const tasks = []

  for (const file of files) {
    const rel = relative(dist, file).replaceAll('\\', '/')
    const ct = mime[extname(file).toLowerCase()] || 'application/octet-stream'
    tasks.push(() => put(projectBucket, rel, file, ct))
    tasks.push(() => put(sitesBucket, `${siteId}/${rel}`, file, ct))
  }

  const preview = join(root, 'docs/assets/dashboard-preview.png')
  if (existsSync(preview)) {
    tasks.push(() => put(projectBucket, 'docs/assets/dashboard-preview.png', preview, 'image/png'))
    tasks.push(() => put(sitesBucket, `${siteId}/docs/assets/dashboard-preview.png`, preview, 'image/png'))
  }

  console.log(`Uploading ${files.length} files × 2 buckets (siteId=${siteId})…`)
  await runPool(tasks, CONCURRENCY)
  console.log(`\nDone. Host → https://${siteId}.softwarelink.net/`)
  console.log(`R2 → ${projectBucket} + ${sitesBucket}/${siteId}/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
