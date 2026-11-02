'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LearnMoreButton } from '@/components/learn-more-button'
import { 
  Database, 
  Globe, 
  Brain, 
  Shield, 
  Zap, 
  Search,
  Network,
  Cpu,
  Code2,
  Layers,
  GitBranch,
  ListFilter
} from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'Built in Rust',
    description: 'High-performance, multi-threaded parsing with memory safety and zero-cost abstractions.',
    accent: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Database,
    title: 'Single SQLite Database',
    description: 'All codebase knowledge in one portable file with SQL querying and vector search.',
    accent: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Code2,
    title: 'Code Graph Analysis',
    description: 'Entity extraction, relationship mapping, and architectural pattern recognition.',
    accent: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Layers,
    title: 'LSP Code Intelligence',
    description: '38 LSP tools backed by 21 language servers, found on your system or installed when you ask.',
    accent: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: Globe,
    title: '26 Languages & Frameworks',
    description: 'Tree-sitter parsing for web, systems, JVM, .NET, mobile, and the Vue & Svelte frameworks.',
    accent: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: GitBranch,
    title: 'Gitignore-Aware Discovery',
    description: 'Parallel file walking with native .gitignore support via ripgrep\'s ignore engine.',
    accent: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: ListFilter,
    title: 'Incremental & Real-time',
    description: 'Re-scans skip unchanged files by size, mtime and content hash; a watcher, and a check behind every MCP answer, keep the graph current as you code.',
    accent: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Brain,
    title: 'Context Graph Memory',
    description: 'AI agents that remember across sessions with 9 structured note types.',
    accent: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Shield,
    title: '100% Local & Private',
    description: 'Your code never leaves your machine: no telemetry, no backend. The network is used only to download the embedding model once and the language servers you ask for.',
    accent: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Zap,
    title: 'MCP Server Built-in',
    description: 'Native integration with 75 total tools: 32 Core + 38 LSP + 5 Architecture.',
    accent: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Search,
    title: 'Semantic Search',
    description: 'Find code by meaning with local Jina embeddings—no API keys required.',
    accent: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Network,
    title: 'Relationship Mapping',
    description: 'Calls, type and value uses, inheritance, implementations, members and imports, resolved across files.',
    accent: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="text-gradient">What Devscriptor Does</span>
            <br />
            <span className="text-white">for AI-Assisted Development</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-400 mb-6"
          >
            A toolkit built in Rust for turning your codebase into an AI-navigable knowledge graph
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <LearnMoreButton href="/features/" variant="outline" />
          </motion.div>
        </div>

        {/* Features grid - showing first 8 as teaser */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
        >
          {features.slice(0, 8).map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors group">
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 rounded-xl ${feature.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-5 h-5 ${feature.accent}`} />
                  </div>
                  <CardTitle className="text-base text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Show 4 more on larger screens */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden lg:grid grid-cols-4 gap-4 max-w-6xl mx-auto mt-4"
        >
          {features.slice(8, 12).map((feature, index) => (
            <motion.div key={index + 8} variants={itemVariants}>
              <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors group">
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 rounded-xl ${feature.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <CardTitle className="text-base text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
