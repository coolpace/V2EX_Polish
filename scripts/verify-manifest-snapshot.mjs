import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const VALID_TARGETS = new Set(['chrome', 'firefox'])

function parseTarget(argv) {
  const targetFlagIndex = argv.findIndex((arg) => arg === '--target' || arg === '-t')
  const target = targetFlagIndex >= 0 ? argv[targetFlagIndex + 1] : undefined

  if (!target || !VALID_TARGETS.has(target)) {
    throw new Error('Missing or invalid --target. Expected "chrome" or "firefox".')
  }

  return target
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

function normalizeManifest(manifest) {
  return {
    permissions: manifest.permissions ?? [],
    contentScripts: (manifest.content_scripts ?? []).map((script) => ({
      css: script.css ?? [],
      js: script.js ?? [],
      runAt: script.run_at ?? null,
      allFrames: script.all_frames ?? false,
      excludeMatches: script.exclude_matches ?? [],
    })),
    background: manifest.background ?? null,
    webAccessibleResources: (manifest.web_accessible_resources ?? []).map((resource) => ({
      resources: resource.resources ?? [],
    })),
    optionsPage: manifest.options_ui?.page ?? null,
    defaultPopup: manifest.action?.default_popup ?? null,
  }
}

function stableStringify(value) {
  return JSON.stringify(value, null, 2)
}

function main() {
  const target = parseTarget(process.argv.slice(2))
  const manifestPath = path.resolve('apps/extension/dist', target, 'manifest.json')
  const snapshotPath = path.resolve('docs/monorepo-manifest-snapshot.json')
  const snapshot = readJson(snapshotPath)
  const actual = normalizeManifest(readJson(manifestPath))
  const expected = snapshot[target]

  if (stableStringify(actual) !== stableStringify(expected)) {
    console.error('Manifest snapshot mismatch.')
    console.error(`Target: ${target}`)
    console.error('Expected:')
    console.error(stableStringify(expected))
    console.error('Actual:')
    console.error(stableStringify(actual))
    process.exit(1)
  }

  process.stdout.write(`Manifest snapshot verified for ${target}.\n`)
}

try {
  main()
}
catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
