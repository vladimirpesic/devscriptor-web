/**
 * Pre-deploy gate: every download, source and data link the site generates must be live.
 *
 * This imports the *real* `getReleaseInfo()` from lib/github.ts rather than
 * re-deriving the URLs. That matters: a checker with its own copy of the naming
 * scheme can pass while the site 404s (and vice versa). There is exactly one
 * source of truth, and this asserts against it.
 *
 * Guards the failure mode where a product ships a new version and the version
 * in lib/github.ts is not bumped, or is bumped before the release is published —
 * leaving download buttons pointing at a file that does not exist.
 *
 * Run:  npm run check:downloads
 * Skip: SKIP_DOWNLOAD_CHECK=1  (offline / emergency deploys)
 */

import { readFileSync, existsSync } from 'node:fs'
import { PRODUCTS, getReleaseInfo, licenseUrl, repoUrl, type ProductId } from '../lib/github.ts'
import { BENCHMARK_ARCHIVE } from '../lib/benchmarks.ts'
import { supportNav } from '../lib/support.ts'

const TIMEOUT_MS = 15_000

/**
 * The products' Cargo.toml in sibling checkouts, for an early version-drift
 * warning when they are checked out locally. Resolved relative to this file
 * (scripts/), so `../../` lands beside devscriptor-web; the first that exists
 * is read, and none is needed (CI has none).
 */
const CARGO_TOML: Record<ProductId, string[]> = {
  devscriptor: ['../../devscriptor/Cargo.toml'],
  rusta: ['../../rusta/Cargo.toml', '../../juggler/Cargo.toml'],
}

interface Result {
  url: string
  name: string
  status: number | string
  ok: boolean
}

/** A HEAD request, following redirects (GitHub sends release files elsewhere). */
async function head(url: string, name = url.split('/').pop() ?? url): Promise<Result> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    return { url, name, status: res.status, ok: res.ok }
  } catch (err) {
    const reason = err instanceof Error ? err.name : 'ERROR'
    return { url, name, status: reason, ok: false }
  }
}

/**
 * Validate a Polar Checkout Link.
 *
 * A HEAD request is useless here: a live *and* a deactivated link both return
 * 200, because Polar 302s an invalid link to its marketing homepage. Only a GET
 * that follows redirects to a `/checkout/<session>` URL proves the product is
 * still offered. So the assertion is "resolved onto a checkout page", not
 * merely "responded 200".
 */
async function checkout(link: { label: string; href: string }): Promise<Result> {
  try {
    const res = await fetch(link.href, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const reachedCheckout = res.ok && new URL(res.url).pathname.startsWith('/checkout/')
    return {
      url: link.href,
      name: link.label,
      status: reachedCheckout ? res.status : `${res.status} → ${res.url}`,
      ok: reachedCheckout,
    }
  } catch (err) {
    const reason = err instanceof Error ? err.name : 'ERROR'
    return { url: link.href, name: link.label, status: reason, ok: false }
  }
}

/** Warn if the site's pinned version has drifted from the crate's Cargo.toml. */
function checkVersionDrift(product: ProductId): string | null {
  const path = CARGO_TOML[product]
    .map((p) => new URL(p, import.meta.url).pathname)
    .find((p) => existsSync(p))
  if (!path) return null

  const cargo = readFileSync(path, 'utf8')
  const match = cargo.match(/^version\s*=\s*"([^"]+)"/m)
  if (!match) return null

  const crateVersion = match[1]
  const siteVersion = PRODUCTS[product].version
  if (crateVersion === siteVersion) return null

  return `${PRODUCTS[product].name}: site pins ${siteVersion}, but Cargo.toml says ${crateVersion}`
}

/** Print each result; returns how many failed. */
function report(results: Result[]): number {
  let failed = 0
  for (const r of results) {
    if (r.ok) {
      console.log(`    ✅ ${r.status}  ${r.name}`)
    } else {
      console.log(`    ❌ ${r.status}  ${r.name}`)
      console.log(`           ${r.url}`)
      failed++
    }
  }
  return failed
}

async function main() {
  if (process.env.SKIP_DOWNLOAD_CHECK) {
    console.log('⏭  SKIP_DOWNLOAD_CHECK set — skipping download link check.\n')
    return
  }

  const products = Object.keys(PRODUCTS) as ProductId[]

  console.log('\n  Checking every download and source link the site generates')
  console.log('  ────────────────────────────────────────────────────────\n')

  let failed = 0
  let links = 0

  for (const product of products) {
    const release = getReleaseInfo(product)
    console.log(`  ${PRODUCTS[product].name} ${release.version}`)

    // The repository, its license, the release page, then every archive with
    // its .sha256: the install commands download both, so a missing checksum
    // breaks them as surely as a missing archive.
    const results = await Promise.all([
      head(repoUrl(product), 'repository'),
      head(licenseUrl(product), 'LICENSE'),
      head(release.releaseUrl, `release v${release.version}`),
      ...release.assets.flatMap((a) => [head(a.url), head(`${a.url}.sha256`)]),
    ])
    links += results.length
    failed += report(results)

    const drift = checkVersionDrift(product)
    if (drift) console.log(`    ⚠️  ${drift}`)

    console.log()
  }

  // The archive the benchmarks page offers, and its checksum.
  console.log('  Benchmark data')
  const data = await Promise.all([
    head(BENCHMARK_ARCHIVE.url),
    head(BENCHMARK_ARCHIVE.sha256Url),
  ])
  links += data.length
  failed += report(data)
  console.log()

  // Polar Checkout Links of the optional support. Same gate: a broken one
  // blocks deploy.
  console.log('  Support links (Polar)')
  const support = await Promise.all(supportNav.map(checkout))
  failed += report(support)
  console.log()

  if (failed > 0) {
    console.error(`  ❌ ${failed} link(s) are broken. Refusing to deploy.`)
    console.error(`     Downloads: fix the version in lib/github.ts or publish the release.`)
    console.error(`     Benchmark: upload the archive named in lib/benchmarks.ts to its release.`)
    console.error(`     Support:   confirm the Polar product is still published.\n`)
    process.exit(1)
  }

  console.log(`  ✅ All ${links} release, source and data links + ${support.length} support links are live.\n`)
}

main().catch((err) => {
  console.error('\n  ❌ Download check failed to run:', err)
  process.exit(1)
})
