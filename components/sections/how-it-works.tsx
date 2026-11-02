'use client'

import { motion } from 'framer-motion'
import { LearnMoreButton } from '@/components/learn-more-button'
import { 
  FolderSearch, 
  Database, 
  Brain,
  ArrowRight,
  Terminal,
  Layers
} from 'lucide-react'

const steps = [
  {
    icon: Terminal,
    title: 'Install',
    description: 'Download the self-contained binary for macOS, Linux, or Windows and add it to your PATH.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: FolderSearch,
    title: 'Scan',
    description: 'Point Devscriptor at your codebase. It parses 26 languages & frameworks with gitignore-aware discovery.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Database,
    title: 'Analyze',
    description: 'All knowledge stored in SQLite - entities, relationships, and vector embeddings for semantic search.',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Layers,
    title: 'Connect LSP',
    description: 'Language servers are found in four places — a config file, Devscriptor’s own installs, the system, VS Code extensions — and the missing ones installed when you ask.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Brain,
    title: 'Query',
    description: 'AI connects via MCP with 75 tools: 32 Core + 38 LSP + 5 Architecture tools.',
    color: 'from-teal-500 to-emerald-500',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-blue-900/10 to-slate-900/0" />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="text-white">How It</span>{' '}
            <span className="text-gradient">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-400 mb-6"
          >
            From install to a queryable knowledge graph in five steps
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <LearnMoreButton href="/architecture/" variant="outline" />
          </motion.div>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5">
                    <ArrowRight className="absolute right-0 -top-2 w-4 h-4 text-slate-700" />
                    <div className="h-full bg-gradient-to-r from-slate-700 to-transparent" />
                  </div>
                )}

                {/* Step card */}
                <div className="text-center">
                  {/* Step number */}
                  <div className="relative inline-flex mb-4">
                    <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${step.color} p-[1px]`}>
                      <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                      {index + 1}
                    </div>
                  </div>

                  {/* Step content */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick command example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-slate-500 font-mono">terminal</span>
            </div>
            <div className="p-4 font-mono text-xs overflow-x-auto">
              <div className="text-slate-500 mb-1"># Quick start</div>
              <div className="text-emerald-400">$ devscriptor scan ./my-project</div>
              <div className="text-blue-400">$ devscriptor lsp setup</div>
              <div className="text-purple-400">$ devscriptor mcp</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
