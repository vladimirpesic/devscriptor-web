'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language: string
}

/**
 * A copy-to-clipboard code block.
 *
 * Lives in its own client component so pages that use it can stay server
 * components and still export `metadata` (a client page silently loses it).
 */
export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLanguageColor = () => {
    switch (language) {
      case 'json':
        return 'text-purple-400'
      case 'bash':
      case 'shell':
        return 'text-emerald-400'
      case 'toml':
        return 'text-amber-400'
      default:
        return 'text-blue-400'
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 px-3 py-1 text-xs text-slate-500 font-mono bg-slate-900 rounded-bl-lg border-b border-l border-slate-800">
        {language}
      </div>
      <pre className="bg-slate-950 rounded-lg p-4 pt-8 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent border border-slate-800">
        <code className={`text-sm font-mono whitespace-pre ${getLanguageColor()}`}>{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
      </button>
    </div>
  )
}
