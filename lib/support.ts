// Voluntary support via Polar (merchant of record): pay-what-you-want products
// that grant nothing. These are persistent Polar Checkout Links: each visit
// mints a fresh checkout session.
//
// External URLs, so callers open them in a new tab with rel="noopener". The
// deploy check (scripts/check-downloads.mts) probes them too, so a dead link
// fails it; it reads them from this file, which imports nothing, since Node
// runs that script without the site's module resolution. lib/navigation.ts
// re-exports them.

import type { NavItem } from './navigation'

export const supportNav: NavItem[] = [
  { label: 'One-time tip', href: 'https://buy.polar.sh/polar_cl_uXJA15YLbcpMnGEV5LLGNsgsAwdUuWcLSHSU51KvT9v' },
  { label: 'Monthly support', href: 'https://buy.polar.sh/polar_cl_q3yWflpRMBn9l8IJHXi2YwqZZQeZKw2zUa4ZY3ZD49B' },
]
