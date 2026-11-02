'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, Cpu, ChevronDown, Bot } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'
import { PRODUCT, moduleNav, resourceNav, sourceNav } from '@/lib/navigation'

interface DropdownProps {
  label: string
  items: { label: string; href: string }[]
  isOpen: boolean
  onToggle: () => void
  onOpen: () => void
  onClose: () => void
}

function NavDropdown({ label, items, isOpen, onToggle, onOpen, onClose }: DropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        onMouseEnter={onOpen}
        className="flex items-center gap-1 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800/50"
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={onClose}
            className="absolute top-full left-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="py-2">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  {...(item.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navigation() {
  const headerRef = useRef<HTMLElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<'modules' | 'resources' | null>(null)

  // The scrolled state is written straight to the DOM as a data attribute and
  // styled with `data-[scrolled]:*`, deliberately bypassing React. Going through
  // setState meant the header repainted only once React got around to it —
  // behind ~40 whileInView observers on the home page — so the bar sat
  // transparent, with its text unreadable over the page, for a noticeable beat.
  // This lands inside the scroll frame instead.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    let frame = 0
    const apply = () => {
      frame = 0
      // 4px, not 50: engage the moment the page moves at all.
      el.toggleAttribute('data-scrolled', window.scrollY > 4)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    apply() // sync now, in case we loaded part-way down the page
    // passive: lets Chrome composite the scroll without first waiting to see
    // whether this handler calls preventDefault().
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        // No transition at all — the bar cuts straight to opaque on the first
        // scrolled frame. Anything animated here leaves the nav text sitting
        // half-transparent over the page content, which is what we're avoiding.
        // border-b is always present and only changes colour, so the header
        // never shifts by a pixel when it engages.
        className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-transparent data-[scrolled]:border-slate-800 data-[scrolled]:bg-slate-950/85 data-[scrolled]:backdrop-blur-xl"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <BrandMark />
              <span className="text-xl font-bold text-white">de{`>`}scriptor</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <a
                href={PRODUCT.features.href}
                className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800/50"
              >
                {PRODUCT.features.label}
              </a>

              <a
                href={PRODUCT.rusta.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-amber-300/90 hover:text-amber-200 transition-colors rounded-md hover:bg-amber-500/10"
              >
                <Bot className="w-3.5 h-3.5" />
                {PRODUCT.rusta.label}
              </a>

              <NavDropdown
                label="Modules"
                items={moduleNav}
                isOpen={openMenu === 'modules'}
                onToggle={() => setOpenMenu(openMenu === 'modules' ? null : 'modules')}
                onOpen={() => setOpenMenu('modules')}
                onClose={() => setOpenMenu(null)}
              />

              <NavDropdown
                label="Resources"
                items={[...resourceNav, ...sourceNav]}
                isOpen={openMenu === 'resources'}
                onToggle={() => setOpenMenu(openMenu === 'resources' ? null : 'resources')}
                onOpen={() => setOpenMenu('resources')}
                onClose={() => setOpenMenu(null)}
              />
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <a href={PRODUCT.download.href}>
                <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800">
                  <Cpu className="w-4 h-4 mr-2" />
                  {PRODUCT.download.label}
                </Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden"
          >
            <div className="bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-4 max-h-[80vh] overflow-y-auto">
              <nav className="flex flex-col gap-1">
                <a
                  href={PRODUCT.features.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  {PRODUCT.features.label}
                </a>

                <a
                  href={PRODUCT.rusta.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-lg transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  {PRODUCT.rusta.label}
                </a>

                <div className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Modules
                </div>
                {moduleNav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </a>
                ))}

                <div className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Resources
                </div>
                {[...resourceNav, ...sourceNav].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    {...(item.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </a>
                ))}

                <div className="border-t border-slate-800 my-3" />
                <a href={PRODUCT.download.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white">
                    <Cpu className="w-4 h-4 mr-2" />
                    {PRODUCT.download.label}
                  </Button>
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
