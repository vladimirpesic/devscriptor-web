'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface LearnMoreButtonProps {
  href: string
  text?: string
  variant?: 'default' | 'outline' | 'ghost'
}

export function LearnMoreButton({ 
  href, 
  text = 'Learn more', 
  variant = 'default' 
}: LearnMoreButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 group'
  
  const variantClasses = {
    default: 'text-blue-400 hover:text-blue-300',
    outline: 'px-4 py-2 rounded-lg border border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400',
    ghost: 'text-slate-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-800/50'
  }

  return (
    <Link 
      href={href} 
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {text}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}
