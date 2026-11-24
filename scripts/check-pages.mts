/**
 * Pre-deploy gate: every page of the built site, opened in Chromium at a
 * phone's width and a desktop's,
 *
 * - passes axe's WCAG 2.2 A and AA rules: as it loads, with each tab of its
 *   tab lists selected in turn (an inactive panel is hidden, and axe checks
 *   only what is shown) and, at the phone's width, with the navigation menu
 *   open;
 * - runs within its Content Security Policy, and logs no error;
 * - is in the sitemap if it may be indexed, and only then.
 *
 * It serves `dist/` (run `npm run build` first) on a local port.
 *
 * Run:  npm run check:pages
 * Needs Playwright's Chromium: `npx playwright install chromium`.
 */

import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { extname, join, relative, resolve, sep } from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { chromium, type Page } from 'playwright'
import { INDEXED_PAGES } from '../app/sitemap.ts'

const DIST = resolve(import.meta.dirname, '..', 'dist')
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const WIDTHS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 900 },
]

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}

/** Every page of the export: each `index.html`, as the path it is served at. */
function pages(dir: string): string[] {
  const found: string[] = []
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      if (name !== '_next') found.push(...pages(path))
    } else if (name === 'index.html') {
      const route = relative(DIST, dir).split(sep).join('/')
      found.push(route ? `/${route}/` : '/')
    }
  }
  return found.sort()
}

/** `dist/` served as GitHub Pages serves it: a directory by its index.html. */
function serve(): Promise<{ server: Server; origin: string }> {
  const server = createServer((request, response) => {
    const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
    let file = resolve(DIST, `.${path}`)
    if (!file.startsWith(DIST)) {
      response.writeHead(403).end()
      return
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
    if (!existsSync(file)) {
      response.writeHead(404).end()
      return
    }
    response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(response)
  })
  return new Promise((done) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : 0
      done({ server, origin: `http://127.0.0.1:${port}` })
    })
  })
}

/** Whether the built page at `route` tells search engines not to index it. */
function noindex(route: string): boolean {
  const html = readFileSync(join(DIST, route, 'index.html'), 'utf8')
  return /<meta name="robots" content="[^"]*noindex/.test(html)
}

interface Finding {
  where: string
  rule: string
  impact: string
  help: string
  targets: string[]
}

/** A CSS selector for the element of id `id`, whatever characters it holds. */
function idSelector(id: string): string {
  return `#${id.replace(/([^a-zA-Z0-9_-])/g, '\\$1')}`
}

async function check(page: Page, where: string, include?: string): Promise<Finding[]> {
  let builder = new AxeBuilder({ page }).withTags(TAGS)
  if (include) builder = builder.include(include)
  const results = await builder.analyze()
  return results.violations.map((v) => ({
    where,
    rule: v.id,
    impact: v.impact ?? 'unknown',
    help: v.help,
    targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
  }))
}

/** The checks of one page: as loaded, each tab selected, the menu open. */
async function checkPage(page: Page, url: string, where: string, findings: Finding[]) {
  await page.goto(url, { waitUntil: 'networkidle' })
  findings.push(...(await check(page, where)))

  // Each tab of each tab list selected in turn.
  const tabs = page.getByRole('tab')
  for (let i = 0; i < (await tabs.count()); i++) {
    const tab = tabs.nth(i)
    if ((await tab.getAttribute('aria-selected')) === 'true') continue
    const name = (await tab.innerText()).trim().replace(/\s+/g, ' ')
    await tab.click({ timeout: 5000 })
    const panel = await tab.getAttribute('aria-controls')
    findings.push(...(await check(page, `${where} tab "${name}"`, panel ? idSelector(panel) : undefined)))
  }

  // The navigation menu, open.
  const menu = page.getByRole('button', { name: 'Open navigation' })
  if (await menu.isVisible()) {
    await menu.click({ timeout: 5000 })
    // The menu fades in: checked half-faded, its text would be fainter than
    // it ever stays.
    await page.waitForFunction(
      () => getComputedStyle(document.getElementById('mobile-navigation')!).opacity === '1',
      undefined,
      { timeout: 5000 }
    )
    findings.push(...(await check(page, `${where} menu open`, '#mobile-navigation')))
    await page.keyboard.press('Escape')
  }
}

async function main() {
  if (!existsSync(DIST)) {
    console.error('dist/ is missing: run `npm run build` first.')
    process.exit(1)
  }
  const { server, origin } = await serve()
  const browser = await chromium.launch()
  const findings: Finding[] = []
  try {
    for (const size of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        reducedMotion: 'reduce',
      })
      // What the page's policy refused, and what it logged as an error.
      await context.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', (event) => {
          console.error(`CSP refused ${event.violatedDirective}: ${event.blockedURI || 'inline'}`)
        })
      })
      const page = await context.newPage()
      let where = ''
      page.on('console', (message) => {
        if (message.type() === 'error') {
          findings.push({ where, rule: 'console-error', impact: 'serious', help: message.text(), targets: [] })
        }
      })
      page.on('pageerror', (error) => {
        findings.push({ where, rule: 'page-error', impact: 'serious', help: error.message, targets: [] })
      })
      for (const route of pages(DIST)) {
        where = `${route} (${size.name})`
        try {
          await checkPage(page, origin + route, where, findings)
        } catch (error) {
          // A page that does not come to life (its scripts refused, say)
          // cannot be clicked through: that is a finding, not the end.
          findings.push({ where, rule: 'interaction', impact: 'serious', help: String(error).split('\n')[0], targets: [] })
        }
      }
      await context.close()
    }
  } finally {
    await browser.close()
    server.close()
  }

  for (const route of pages(DIST)) {
    const listed = INDEXED_PAGES.includes(route)
    if (listed === noindex(route)) {
      findings.push({
        where: route,
        rule: 'sitemap',
        impact: 'moderate',
        help: listed ? 'listed in the sitemap, but noindex' : 'indexable, but missing from the sitemap',
        targets: [],
      })
    }
  }

  for (const f of findings) {
    console.error(`${f.where}: ${f.rule} (${f.impact}) — ${f.help}`)
    for (const target of f.targets) console.error(`    ${target}`)
  }
  if (findings.length > 0) {
    console.error(`\n${findings.length} problem(s).`)
    process.exit(1)
  }
  console.log(
    `Every page passes axe's WCAG 2.2 A/AA rules at ${WIDTHS.map((w) => w.width).join(' and ')} px, ` +
      'runs within its Content Security Policy without an error, and is in the sitemap if indexable.'
  )
}

await main()
