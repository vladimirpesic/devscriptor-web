'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type VendorId = 'kimi' | 'glm' | 'deepseek'

/** Each vendor's colour: Kimi green, GLM red, DeepSeek blue. */
const VENDORS: { id: VendorId; label: string; maker: string; active: string; dot: string }[] = [
  {
    id: 'kimi',
    label: 'Kimi',
    maker: 'Moonshot AI',
    active: 'data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300',
    dot: 'bg-emerald-400',
  },
  {
    id: 'glm',
    label: 'GLM',
    maker: 'Z.AI',
    active: 'data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300',
    dot: 'bg-red-400',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    maker: 'DeepSeek',
    active: 'data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300',
    dot: 'bg-blue-400',
  },
]

function isVendor(value: string): value is VendorId {
  return VENDORS.some((v) => v.id === value)
}

/**
 * The vendor selector of the Rusta page. Every panel is in the page's HTML
 * (an inactive one hidden); the URL's fragment (`#kimi`, `#glm`, `#deepseek`)
 * picks the panel shown, and choosing one updates it, so a link can open a
 * vendor's tab directly.
 */
export function VendorTabs({ panels }: { panels: Record<VendorId, ReactNode> }) {
  const [vendor, setVendor] = useState<VendorId>('kimi')

  useEffect(() => {
    // A hidden panel cannot be scrolled to on load, so the browser leaves a
    // `#glm` link at the top: once the panel is shown, bring it into view.
    const fromHash = () => {
      const hash = window.location.hash.slice(1)
      if (!isVendor(hash)) return
      setVendor(hash)
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const choose = (value: string) => {
    if (!isVendor(value)) return
    setVendor(value)
    window.history.replaceState(null, '', `#${value}`)
  }

  return (
    <Tabs value={vendor} onValueChange={choose} className="mx-auto max-w-6xl">
      <TabsList className="mb-10 grid h-auto w-full grid-cols-1 gap-1 border border-slate-800 bg-slate-900/50 p-1 sm:grid-cols-3">
        {VENDORS.map((v) => (
          <TabsTrigger key={v.id} value={v.id} className={`py-2.5 ${v.active}`}>
            <span className={`mr-2 h-2 w-2 flex-shrink-0 rounded-full ${v.dot}`} />
            {v.label}
            <span className="ml-2 hidden text-xs font-normal text-slate-500 sm:inline">
              {v.maker}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {VENDORS.map((v) => (
        <TabsContent key={v.id} value={v.id} id={v.id} className="mt-0 scroll-mt-24">
          {panels[v.id]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
