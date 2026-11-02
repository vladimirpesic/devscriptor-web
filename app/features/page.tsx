import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  ListFilter,
  Sparkles
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features - Devscriptor',
  description: 'Complete feature overview of Devscriptor: 75 MCP tools, 26 languages & frameworks, LSP code intelligence, Context Graph memory, and more.',
}

const features = [
  {
    icon: Cpu,
    title: 'Built in Rust',
    description: 'A memory-safe engine with zero-cost abstractions, designed to run efficiently on everyday developer hardware.',
    details: [
      'Multi-threaded parsing (scales to num_cpus)',
      'Memory-mapped file reading for zero-copy access',
      'Batched, WAL-mode SQLite transactions',
      'Content-hash caches skip redundant parsing & inference',
    ],
    accent: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Database,
    title: 'Single SQLite Database',
    description: 'All your codebase knowledge in one portable file. Query with SQL, run FTS5 keyword and vector search, and maintain a persistent knowledge graph.',
    details: [
      'Portable single-file database',
      'Directly queryable by any AI agent',
      'FTS5 full-text search (code-aware tokenizer)',
      '768-dim vector search via sqlite-vec',
    ],
    accent: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Code2,
    title: 'Code Graph Analysis',
    description: 'Comprehensive code analysis with entity extraction, relationship mapping, cross-reference detection, and architectural pattern recognition.',
    details: [
      'Entity extraction (functions, classes, traits, constants, components…)',
      'Relationship mapping (calls, type uses, inheritance, imports)',
      'Cross-reference detection across files',
      'Architectural pattern recognition',
    ],
    accent: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Layers,
    title: 'LSP Code Intelligence',
    description: '38 LSP tools providing real-time IDE features through a 4-tier detection system supporting 21 language servers.',
    details: [
      'Go-to-definition navigation',
      'Hover information and type signatures',
      'Code completions',
      'Call and type hierarchy',
      'Diagnostics and error detection',
    ],
    accent: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: Globe,
    title: '26 Languages & Frameworks',
    description: 'Tree-sitter parsing across systems, web, JVM, .NET, and mobile stacks — plus the Vue and Svelte frameworks — all with dedicated grammar support.',
    details: [
      '26 grammar crates, 27 parsers (tree-sitter 0.27)',
      'TypeScript grammar covers both TS and TSX',
      'Functions, classes, structs, enums, components…',
      'Calls, inherits, implements & cross-file relationships',
    ],
    accent: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: GitBranch,
    title: 'Gitignore-Aware Discovery',
    description: 'Parallel, multi-threaded file discovery using ripgrep\'s ignore engine, with native .gitignore support.',
    details: [
      'ignore crate (same engine as ripgrep)',
      'All glob and negation patterns',
      'Nested .gitignore files with proper precedence',
      '.git/info/exclude support',
    ],
    accent: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: ListFilter,
    title: 'Incremental & Real-time',
    description: 'Re-scans only what changed via an mtime+size fast path, a watcher keeps the graph current as you code, and every MCP answer re-checks the files it names.',
    details: [
      'mtime+size fast-path, XXH3 content hashing',
      'Only changed files are re-parsed',
      'A watcher in devscriptor watch and in every MCP server',
      'Content-hash embedding cache skips re-inference',
    ],
    accent: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Brain,
    title: 'Context Graph Memory',
    description: 'AI agents that remember. Store decisions, standards, and project knowledge across sessions with 9 structured note types.',
    details: [
      '9 note types (adr, standard, optimization, failure, practice, reflection, general, file_description, modification)',
      'Notes live in the same local SQLite database',
      'Linked to code entities and abstract concepts',
      'Keyword, semantic & RRF hybrid search',
    ],
    accent: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Shield,
    title: '100% Local & Private',
    description: 'Your code never leaves your machine. Scanning, indexing and search make no network calls, and there is no Devscriptor backend.',
    details: [
      'No code sent to external services',
      'No telemetry or analytics',
      'One-time embedding-model download, then fully offline',
      'Pre-stage the model cache for air-gapped use',
    ],
    accent: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Zap,
    title: 'MCP Server Built-in',
    description: 'Works with Claude Desktop, Claude Code, Cursor, Cline, Rusta and any MCP-compatible AI agent. 75 total tools: 32 Core + 38 LSP + 5 Architecture.',
    details: [
      '32 Core analysis, context & watcher tools',
      '38 LSP code intelligence tools',
      '5 Architecture management tools',
      'One shared server per workspace, over stdio (devscriptor mcp)',
    ],
    accent: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Search,
    title: 'Semantic Search',
    description: 'Find code by meaning, not just keywords. Local vector embeddings, no API keys, hybrid-ranked with keyword search.',
    details: [
      'Local jina-embeddings-v2-base-code (768-dim)',
      'No API keys — runs offline once cached',
      'Cosine similarity via sqlite-vec',
      'RRF hybrid fusion of keyword + vector results',
    ],
    accent: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Network,
    title: 'Relationship Mapping',
    description: 'Understand how your code connects: function calls, type and value uses, inheritance, implementations, members and imports, resolved across files.',
    details: [
      'Function call relationships',
      'Inheritance and implementation',
      'Import and dependency tracking',
      'Cross-file relationship detection',
    ],
    accent: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
  },
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Features
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">What Devscriptor Does</span>
              <br />
              <span className="text-white">for AI-Assisted Development</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A toolkit built in Rust for turning your codebase into an AI-navigable knowledge graph
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className={`w-6 h-6 ${feature.accent}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white mb-2">{feature.title}</CardTitle>
                      <p className="text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 ml-16">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
