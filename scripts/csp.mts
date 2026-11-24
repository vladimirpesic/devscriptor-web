/**
 * Gives every page of the export its Content Security Policy, as a `<meta>`
 * tag: GitHub Pages sets no response headers of a site's choosing.
 *
 * The site loads nothing from another origin, so the policy allows its own
 * origin alone. Next.js inlines the data each page hydrates from in `<script>`
 * elements; rather than allow inline scripts at large, a page's policy allows
 * exactly those it holds, by their SHA-256. Styles may be inline: the
 * animations set `style` attributes, which no hash can allow.
 *
 * A `<meta>` policy cannot say who may frame the page (`frame-ancestors`), and
 * `X-Content-Type-Options` has no `<meta>` form at all; both need headers.
 *
 * Run after `next build` (the `build` script does).
 */

import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const DIST = resolve(import.meta.dirname, '..', 'dist')

/** Every HTML file of the export. */
function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return htmlFiles(path)
    return name.endsWith('.html') ? [path] : []
  })
}

/** The SHA-256 of each script inlined in `html`, as CSP writes a hash. */
function inlineScriptHashes(html: string): string[] {
  const hashes = new Set<string>()
  for (const match of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    const attributes = match[1] ?? ''
    if (/\bsrc=/.test(attributes)) continue
    // A data block (`application/json`, `application/ld+json`) is not run.
    const type = /\btype="([^"]*)"/.exec(attributes)?.[1]
    if (type && !/^(text|application)\/javascript$|^module$/.test(type)) continue
    const digest = createHash('sha256').update(match[2], 'utf8').digest('base64')
    hashes.add(`'sha256-${digest}'`)
  }
  return [...hashes]
}

function policy(hashes: string[]): string {
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(' ')}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

const CHARSET = '<meta charSet="utf-8"/>'
let pages = 0
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8')
  if (html.includes('http-equiv="Content-Security-Policy"')) {
    throw new Error(`${file} already has a Content Security Policy`)
  }
  // Right after the charset, before any script the policy governs.
  const at = html.indexOf(CHARSET)
  if (at < 0) throw new Error(`${file} has no ${CHARSET}`)
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy(inlineScriptHashes(html))}"/>`
  const end = at + CHARSET.length
  writeFileSync(file, html.slice(0, end) + meta + html.slice(end))
  pages++
}
console.log(`Content Security Policy written into ${pages} pages.`)
