'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Terminal,
  Database,
  Sparkles,
  Shield,
  ChevronRight,
  Zap,
  Layers,
  Brain,
  Search,
} from 'lucide-react'
import { RUSTA_VERSION, linuxDownloadCommand, archiveName, RELEASE_TARGETS } from '@/lib/github'

const DOWNLOAD_COMMAND = linuxDownloadCommand('devscriptor')
const CHECKSUM_FILE = `${archiveName('devscriptor', RELEASE_TARGETS[0])}.sha256`
const VERIFY_COMMAND = `sha256sum -c ${CHECKSUM_FILE}`

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">The Tool Every AI Coder</span>
            <br />
            <span className="text-gradient">Will Thank You For</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-8"
          >
            One portable SQLite file. 26 languages &amp; frameworks. 75 MCP tools with LSP code intelligence.
            Semantic search, relationship mapping, and persistent memory
            for any AI coding agent — analysed on your machine, open source.
          </motion.p>

          {/* Key highlights - 4 main features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10"
          >
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">75 MCP Tools</span>
              <span className="text-xs text-slate-500 text-center">32 Core + 38 LSP + 5 Arch</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <Layers className="w-6 h-6 text-purple-400" />
              <span className="text-white font-semibold">LSP Intelligence</span>
              <span className="text-xs text-slate-500">21 Language Servers</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <Brain className="w-6 h-6 text-pink-400" />
              <span className="text-white font-semibold">Context Graph</span>
              <span className="text-xs text-slate-500">AI Memory System</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <Search className="w-6 h-6 text-emerald-400" />
              <span className="text-white font-semibold">Semantic Search</span>
              <span className="text-xs text-slate-500">Vector Embeddings</span>
            </div>
          </motion.div>

          {/* Additional highlights row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Single SQLite File</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-sm">26 Languages &amp; Frameworks</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Local & Private</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Fast, Parallel Parsing</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a href="/download/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/25"
              >
                Download
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 hover:bg-slate-800 px-8 py-6 text-lg"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Explore Features
              </Button>
            </a>
          </motion.div>

          {/* Rusta pointer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8"
          >
            <a
              href="#rusta"
              className="group inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm transition-colors hover:bg-amber-500/20"
            >
              <span className="font-semibold text-amber-300">
                Meet Rusta v{RUSTA_VERSION}
              </span>
              <span className="text-slate-400">
                — the coding agent built for Kimi, GLM &amp; DeepSeek
              </span>
            </a>
          </motion.div>

          {/* Install command */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12"
          >
            <CommandLine command={DOWNLOAD_COMMAND} />
            <p className="mt-2 text-sm text-slate-500">
              Linux x86_64: the archive and its checksum — verify with:
            </p>
            <CommandLine command={VERIFY_COMMAND} className="mt-2" codeClassName="text-slate-400" />
            <p className="mt-2 text-sm text-slate-500">
              Or pick another <a href="/download/" className="text-blue-400 hover:text-blue-300">platform</a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/** A one-line shell command that scrolls horizontally on narrow screens, with a copy button. */
function CommandLine({
  command,
  className = '',
  codeClassName = 'text-emerald-400',
}: {
  command: string
  className?: string
  codeClassName?: string
}) {
  return (
    <div className={`mx-auto flex max-w-full items-center gap-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-lg px-4 sm:px-6 py-3 w-fit ${className}`}>
      <span className="text-slate-500 flex-shrink-0">$</span>
      <code className={`${codeClassName} font-mono text-xs sm:text-sm overflow-x-auto whitespace-nowrap`}>{command}</code>
      <button
        className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
        aria-label="Copy the command"
        onClick={() => navigator.clipboard.writeText(command)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  )
}
