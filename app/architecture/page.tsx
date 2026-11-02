import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Cpu,
  Layers,
  Server,
  Terminal,
  Database,
  Code2,
  GitBranch,
  ListFilter,
  Brain,
  Search,
  Globe,
  Zap,
  Workflow,
  Box,
  Settings,
  ArrowDown,
  RefreshCw,
  CheckCircle2,
  Activity,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Architecture - Devscriptor',
  description: 'System architecture, data flow, and module structure of Devscriptor: a Rust code-analysis platform with 26 tree-sitter grammars, LSP integration, and a unified MCP server.',
}

// Module definitions
const modules = [
  {
    id: 'core',
    name: 'Core Module',
    path: 'crates/core',
    icon: Cpu,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    description: 'The heart of Devscriptor. Handles parsing, analysis, storage, and embeddings.',
    components: [
      { icon: Code2, name: 'Parser', desc: '26 Tree-sitter Grammars', detail: 'Dedicated grammar per language for accurate AST extraction' },
      { icon: GitBranch, name: 'File Scanner', desc: 'ignore crate', detail: 'Parallel, gitignore-aware discovery (ripgrep engine)' },
      { icon: ListFilter, name: 'Incremental', desc: 'mtime+size+XXH3', detail: 'Fast-path re-scans of only the files that changed' },
      { icon: Database, name: 'Database', desc: 'SQLite + FTS5 + vec0', detail: 'Single-file graph with FTS5 keyword and sqlite-vec search' },
      { icon: Search, name: 'Analysis Engine', desc: 'Dead code · complexity · clones', detail: 'Code-smell, cross-reference and call-graph analysis' },
      { icon: Brain, name: 'Embeddings', desc: 'Jina v2 Base Code (768-d)', detail: 'Pure-Rust ONNX inference (tract) — one shared model, RAM-aware concurrency, no API keys' },
    ],
  },
  {
    id: 'lsp',
    name: 'LSP Module',
    path: 'crates/lsp',
    icon: Layers,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    description: 'Language Server Protocol integration with 4-tier server detection.',
    components: [
      { icon: Activity, name: '4-Tier Detection', desc: 'Priority resolution', detail: 'A configuration file → Devscriptor’s installs → the system → editor extensions' },
      { icon: Server, name: 'Server Manager', desc: 'Lifecycle control', detail: 'Lazy or eager start, idle stop, a cap on running servers, crash restarts' },
      { icon: Zap, name: 'MCP Bridge', desc: 'Tool exposure', detail: '38 LSP + 5 architecture tools exposed via MCP' },
      { icon: Globe, name: 'Registry', desc: '21 Servers', detail: 'Pre-configured language server definitions' },
    ],
  },
  {
    id: 'mcp',
    name: 'MCP Module',
    path: 'crates/mcp',
    icon: Workflow,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    description: 'One Model Context Protocol server per workspace with 75 tools, shared by every agent working there.',
    components: [
      { icon: Box, name: 'Core Tools', desc: '32 Tools', detail: 'Scan, search, analyze, context, and the real-time watcher' },
      { icon: Layers, name: 'LSP Tools', desc: '38 Tools', detail: 'Navigation, completion, diagnostics, refactoring' },
      { icon: Settings, name: 'Architecture Tools', desc: '5 Tools', detail: 'LSP detection, prerequisite checks, setup' },
      { icon: Workflow, name: 'Shared Server', desc: 'One per workspace', detail: 'devscriptor mcp relays its stdio to devscriptor serve over a local socket (a named pipe on Windows): one index, watcher, model and set of language servers — no network port' },
      { icon: RefreshCw, name: 'Freshness Check', desc: 'At query time', detail: 'An answer re-indexes the changed files it names first, waiting up to 250 ms' },
    ],
  },
  {
    id: 'cli',
    name: 'CLI Module',
    path: 'crates/cli',
    icon: Terminal,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    description: 'Command-line interface for direct codebase interaction.',
    components: [
      { icon: Search, name: 'scan', desc: 'Build code graph', detail: 'Scan directories and build the database' },
      { icon: Code2, name: 'analyze', desc: 'Run analysis', detail: 'Execute analyzers and generate reports' },
      { icon: Brain, name: 'embed', desc: 'Semantic vectors', detail: 'Load the model, embed the index, unload the model' },
      { icon: Layers, name: 'lsp', desc: 'LSP operations', detail: 'Set up, detect and check servers; trust a project’s server configuration' },
      { icon: Workflow, name: 'mcp · serve', desc: 'MCP server', detail: 'The stdio proxy agents start, and the workspace’s shared server' },
    ],
  },
]

// Technology stack
const techStack = [
  { category: 'Parsing', items: ['tree-sitter 0.27', '26 grammars (27 with TSX)', 'Memory-mapped file reading'] },
  { category: 'Database', items: ['rusqlite 0.40 (bundled SQLite 3.53)', 'sqlite-vec 0.1.9 — FLOAT[768]', 'FTS5 code-aware tokenizer', 'r2d2 0.8 connection pool'] },
  { category: 'Embeddings', items: ['jinaai/jina-embeddings-v2-base-code', 'tract-onnx 0.23 (pure-Rust ONNX inference)', 'Shared model, RAM-aware concurrency, no API keys'] },
  { category: 'Async Runtime', items: ['Tokio 1.x', 'ignore 0.4 (ripgrep engine)', 'reqwest 0.13 with rustls (model + LSP downloads)'] },
  { category: 'MCP Protocol', items: ['rmcp SDK 3.5', 'JSON-RPC over stdio', 'One shared server per workspace'] },
  { category: 'LSP Integration', items: ['21 language servers', '4-tier detection', 'Checksum-verified installs, when asked'] },
]

// Data flows
const dataFlows = [
  {
    id: 'scanning',
    title: 'Codebase Scanning Flow',
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    steps: [
      { title: 'File Discovery', desc: 'Parallel, gitignore-aware walk via the ignore crate' },
      { title: 'Incremental Filtering', desc: 'mtime+size fast-path, then XXH3 hash — skip unchanged files' },
      { title: 'Parallel Parsing', desc: '26 tree-sitter grammars extract the AST per file' },
      { title: 'Entity Extraction', desc: 'Functions, classes, structs, enums, components identified' },
      { title: 'Relationship Extraction', desc: 'Calls, inherits, implements, uses — including cross-file' },
      { title: 'SQLite Storage', desc: 'Graph + FTS5 index persisted to a single database file' },
      { title: 'Optional Embedding', desc: 'devscriptor embed loads ONNX, writes 768-d vectors, unloads' },
      { title: 'Model Unloaded', desc: '~1.3 GB freed immediately after embedding completes' },
    ],
  },
  {
    id: 'lsp',
    title: 'LSP Request Flow',
    icon: Layers,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    steps: [
      { title: 'MCP Tool Call', desc: 'An agent calls an LSP tool, by symbol name or by file and position' },
      { title: 'Symbol Resolution', desc: 'A name is resolved to its position from the index, checked fresh first' },
      { title: 'Language Detection', desc: 'The file’s extension picks its language server' },
      { title: 'Start If Needed', desc: 'Started on first use, rooted at the file’s project; restarted after a crash' },
      { title: 'LSP Request', desc: 'JSON-RPC message to the language server' },
      { title: 'Server Processing', desc: 'Language-specific analysis' },
      { title: 'Response', desc: 'Results returned via MCP, each position with a 1-based cite' },
      { title: 'AI Integration', desc: 'Agent uses results for code assistance' },
    ],
  },
  {
    id: 'detection',
    title: '4-Tier Detection Flow',
    icon: Activity,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    steps: [
      { title: 'Tier 1: A Configuration File', desc: 'devscriptor-lsp.toml (once trusted) or DEVSCRIPTOR_LSP_CONFIG: its servers, exactly' },
      { title: 'Tier 2: Devscriptor’s Own Installs', desc: '<cache>/devscriptor/lsp-servers/, then a bundle beside the executable' },
      { title: 'Tier 3: The System', desc: 'The server’s command on the PATH, plus known locations' },
      { title: 'Tier 4: Editor Extensions', desc: 'Servers bundled with VS Code extensions' },
      { title: 'Prerequisite Check', desc: 'lsp setup checks what a missing server needs: Node.js, Java, .NET, a toolchain' },
      { title: 'Install When Asked', desc: 'From the mirror or the server’s own source, checksum-verified' },
      { title: 'Server Launch', desc: 'Start and initialize the language server' },
      { title: 'Ready', desc: 'Server available for LSP requests' },
    ],
  },
]

function ModuleCard({ module }: { module: typeof modules[0] }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all h-full">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl ${module.bgColor} flex items-center justify-center flex-shrink-0`}>
            <module.icon className={`w-7 h-7 text-slate-400`} />
          </div>
          <div>
            <Badge className={`mb-2 ${module.bgColor} text-slate-300 border-slate-700`}>
              {module.path}
            </Badge>
            <CardTitle className="text-xl text-white">{module.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400 mb-6">{module.description}</p>
        <div className="space-y-3">
          {module.components.map((component, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <component.icon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{component.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${module.bgColor} text-slate-300`}>
                    {component.desc}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{component.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DataFlowDiagram({ flow }: { flow: typeof dataFlows[0] }) {
  return (
    <div className="space-y-4">
      {flow.steps.map((step, index) => (
        <div key={index} className="relative">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${flow.bgColor} flex items-center justify-center flex-shrink-0 border-2 border-slate-800`}>
                <span className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${flow.color}`}>
                  {index + 1}
                </span>
              </div>
              {index < flow.steps.length - 1 && (
                <div className="w-0.5 h-full min-h-[24px] bg-slate-800 my-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <h4 className="text-sm font-medium text-white">{step.title}</h4>
              <p className="text-sm text-slate-400">{step.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
              <Box className="w-3 h-3 mr-1" />
              Architecture
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">System Design</span>
              <br />
              <span className="text-white">How Devscriptor Works</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              High-performance code analysis platform built in Rust with 26 tree-sitter grammars,
              75 MCP tools, and 4-tier LSP detection.
            </p>
          </div>
        </div>
      </section>

      {/* System Overview */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                Overview
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">System at a Glance</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                A modular architecture built for performance, extensibility, and broad language support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <Cpu className="w-10 h-10 text-orange-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">Rust</div>
                  <p className="text-slate-400">High-performance implementation with memory safety and zero-cost abstractions</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <Code2 className="w-10 h-10 text-cyan-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">26</div>
                  <p className="text-slate-400">Languages &amp; frameworks via tree-sitter 0.27 grammars</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <Workflow className="w-10 h-10 text-blue-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">75</div>
                  <p className="text-slate-400">MCP Tools total: 32 Core + 38 LSP + 5 Architecture</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <Layers className="w-10 h-10 text-violet-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">4-Tier</div>
                  <p className="text-slate-400">LSP Detection system with automatic language server discovery</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Module Architecture */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                Modules
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">Module Architecture</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Four crates organized by responsibility, built into the one devscriptor executable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {modules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Flows */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-violet-500/20 text-violet-300 border-violet-500/30">
                <ArrowDown className="w-3 h-3 mr-1" />
                Data Flow
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">How Data Flows</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Understanding the journey from source code to AI-accessible knowledge.
              </p>
            </div>
            
            <Tabs defaultValue="scanning" className="w-full">
              <TabsList className="grid w-full grid-cols-1 gap-1 h-auto sm:grid-cols-3 bg-slate-900/50 border border-slate-800 mb-8">
                <TabsTrigger value="scanning" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
                  <Search className="w-4 h-4 mr-2" />
                  Codebase Scanning
                </TabsTrigger>
                <TabsTrigger value="lsp" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
                  <Layers className="w-4 h-4 mr-2" />
                  LSP Request
                </TabsTrigger>
                <TabsTrigger value="detection" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
                  <Activity className="w-4 h-4 mr-2" />
                  4-Tier Detection
                </TabsTrigger>
              </TabsList>
              
              {dataFlows.map((flow) => (
                <TabsContent key={flow.id} value={flow.id}>
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${flow.bgColor} flex items-center justify-center`}>
                          <flow.icon className="w-5 h-5 text-slate-400" />
                        </div>
                        <CardTitle className="text-xl text-white">{flow.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <DataFlowDiagram flow={flow} />
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                <Settings className="w-3 h-3 mr-1" />
                Stack
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">Technology Stack</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Carefully chosen technologies for performance, reliability, and maintainability.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((stack, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{stack.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {stack.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Box className="w-3 h-3 mr-1" />
                Structure
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">Crate Structure</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Visual representation of how the crates interact and depend on each other.
              </p>
            </div>
            
            <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col items-center">
                  {/* MCP Client Layer */}
                  <div className="w-full max-w-md p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Workflow className="w-5 h-5 text-cyan-400" />
                      <span className="font-semibold text-cyan-300">MCP Clients</span>
                    </div>
                    <p className="text-sm text-slate-400">Claude Desktop, Cursor, Cline, etc.</p>
                  </div>
                  
                  <ArrowDown className="w-5 h-5 text-slate-600 my-2" />
                  
                  {/* MCP Server Layer */}
                  <div className="w-full max-w-lg p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Server className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold text-blue-300">crates/mcp</span>
                    </div>
                    <p className="text-sm text-slate-400">Unified MCP Server · 75 Tools · stdio</p>
                  </div>
                  
                  <div className="flex gap-4 my-2">
                    <ArrowDown className="w-5 h-5 text-slate-600" />
                    <ArrowDown className="w-5 h-5 text-slate-600" />
                    <ArrowDown className="w-5 h-5 text-slate-600" />
                  </div>
                  
                  {/* Core Modules Layer */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-4">
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Cpu className="w-5 h-5 text-orange-400" />
                        <span className="font-semibold text-orange-300">crates/core</span>
                      </div>
                      <p className="text-sm text-slate-400">Parsing · Analysis · Storage</p>
                    </div>
                    <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Layers className="w-5 h-5 text-violet-400" />
                        <span className="font-semibold text-violet-300">crates/lsp</span>
                      </div>
                      <p className="text-sm text-slate-400">LSP Client · 21 Servers</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Terminal className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-emerald-300">crates/cli</span>
                      </div>
                      <p className="text-sm text-slate-400">Commands · Interface</p>
                    </div>
                  </div>
                  
                  <ArrowDown className="w-5 h-5 text-slate-600 my-2" />
                  
                  {/* External Dependencies */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
                      <Code2 className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs text-slate-400">tree-sitter</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
                      <Database className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs text-slate-400">SQLite</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
                      <Brain className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs text-slate-400">Jina Embeddings</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
                      <Zap className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs text-slate-400">LSP Servers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
