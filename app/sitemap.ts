import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

/**
 * The pages search engines should index: every page but those marked
 * `noindex` (the license and thank-you pages, and the Rusta page's earlier
 * address). `npm run check:pages` fails when a built page is in neither.
 */
export const INDEXED_PAGES = [
  '/',
  '/features/',
  '/rusta/',
  '/download/',
  '/architecture/',
  '/context-graph/',
  '/languages/',
  '/lsp-integration/',
  '/mcp-tools/',
  '/cli-reference/',
  '/examples/',
  '/benchmarks/',
  '/security/',
  '/faq/',
  '/terms/',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXED_PAGES.map((page) => ({ url: `https://devscriptor.com${page}` }))
}
