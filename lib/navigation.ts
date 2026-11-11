// Single source of truth for site navigation.
//
// The header and the footer both render from the lists below, so a page can
// only be filed in one place. The groups are:
//   Product   — what the tools are and how to get them
//   Modules   — a deep dive per Devscriptor subsystem
//   Resources — supporting material
//   Source    — the repositories

import { repoUrl } from './github'

export interface NavItem {
  label: string
  href: string
}

/**
 * Product surfaces. The header styles each of these differently (Rusta is
 * highlighted, Download is the CTA button), so they are also exposed by name.
 */
export const PRODUCT = {
  features: { label: 'Features', href: '/features/' },
  rusta: { label: 'Rusta', href: '/rusta/' },
  download: { label: 'Download', href: '/download/' },
} as const satisfies Record<string, NavItem>

export const productNav: NavItem[] = [PRODUCT.features, PRODUCT.rusta, PRODUCT.download]

/** One page per Devscriptor subsystem. Header dropdown + footer column. */
export const moduleNav: NavItem[] = [
  { label: 'CLI Reference', href: '/cli-reference/' },
  { label: 'MCP Tools', href: '/mcp-tools/' },
  { label: 'LSP Intelligence', href: '/lsp-integration/' },
  { label: 'Context Graph', href: '/context-graph/' },
  { label: 'Languages', href: '/languages/' },
  { label: 'Architecture', href: '/architecture/' },
]

/** Supporting material. Header dropdown + footer column. */
export const resourceNav: NavItem[] = [
  { label: 'Examples', href: '/examples/' },
  { label: 'Benchmarks', href: '/benchmarks/' },
  { label: 'Security', href: '/security/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'License', href: '/terms/' },
]

/** The repositories. External: opened in a new tab. */
export const sourceNav: NavItem[] = [
  { label: 'Devscriptor on GitHub', href: repoUrl('devscriptor') },
  { label: 'Rusta on GitHub', href: repoUrl('rusta') },
]

export { supportNav } from './support'

export const CONTACT_EMAIL = 'contact@devscriptor.com'
