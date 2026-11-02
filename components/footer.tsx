'use client'

import { Mail, Heart } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'
import { productNav, moduleNav, resourceNav, sourceNav, supportNav, CONTACT_EMAIL } from '@/lib/navigation'
import { COPYRIGHT, LICENSE_NAME } from '@/lib/licensing'

// Same groups, same order as the header — both read from lib/navigation.
const footerLinks = {
  Product: productNav,
  Modules: moduleNav,
  Resources: [...resourceNav, ...sourceNav],
}

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <BrandMark />
              <span className="text-xl font-bold text-white">Devscriptor</span>
            </a>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
              A local knowledge graph of your codebase for any AI coding agent, and Rusta, the coding agent built for Kimi, GLM and DeepSeek. Open source, built in Rust.
            </p>
            <div className="flex gap-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Support — voluntary tips, external (Polar). They grant nothing: both
              tools are open source either way. */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Support
            </h4>
            <ul className="space-y-3">
              {supportNav.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-600">Optional. Unlocks nothing.</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            {COPYRIGHT}. Devscriptor, Rusta and this website are free software under the {LICENSE_NAME}.
          </p>
          <div className="flex gap-6">
            <span className="text-slate-600 text-sm">
              {CONTACT_EMAIL}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
