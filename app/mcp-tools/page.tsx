import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Cpu,
  Code2,
  Layers,
  Search,
  Workflow,
  Database,
  Brain,
  Sparkles,
  Terminal,
  Compass,
  Zap,
  AlertCircle,
  List,
  GitBranch,
  FileCode,
  AlignLeft,
  Server,
  RefreshCw,
  Activity,
  Edit3,
  Boxes,
  Network,
  Download,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'MCP Tools - Devscriptor',
  description:
    'Complete reference for all 75 MCP tools in Devscriptor: 32 Core analysis tools, 38 LSP code-intelligence tools, and 5 Architecture management tools, served by the unified MCP server over stdio.',
}

// Core Tools (32). Descriptions follow the server's tools/list.
const coreTools = {
  jobs: [
    { name: 'scan_codebase', description: 'Scan a codebase and build the entity database. extensions is a whitelist; exclude_patterns add to the built-in excludes; the project’s devscriptor.yaml sets both when omitted', params: `{
  "path": "/path/to/project",
  "extensions": ["rs", ".toml"],
  "exclude_patterns": ["**/tests/**", "*_test.rs"]
}` },
    { name: 'analyze_code', description: 'Run an analysis — dead_code, complexity, cross_reference, call_graph, code_smells, cross_file, clones, or all — and return its findings under a directory, each with its file_path, line and details' },
    { name: 'start_analysis', description: 'Start a background analysis job, for large repositories' },
    { name: 'get_analysis_progress', description: 'Get the progress of an analysis job; wait blocks until it completes or the timeout passes' },
    { name: 'list_analysis_jobs', description: 'List all analysis jobs' },
    { name: 'cancel_analysis', description: 'Cancel a running analysis job' },
    { name: 'cleanup_old_jobs', description: 'Clean up old completed jobs' },
  ],
  stats: [
    { name: 'get_statistics', description: 'Database statistics — files, entities and relationships; path scopes the counts' },
    { name: 'health_check', description: 'Server health: the database, jobs, version, the project configuration, and daemon_pid under a shared server' },
  ],
  search: [
    { name: 'search_entities', description: 'Search entity names; entity_type filters by kind. semantic_search matches on body text' },
    { name: 'search_functions', description: 'Search functions by name, optionally within files whose path matches' },
    { name: 'search_classes', description: 'Search classes and types by name, optionally within files whose path matches' },
    { name: 'fuzzy_search', description: 'Typo-tolerant fuzzy search over entity names (scores every candidate, not a substring match)' },
    { name: 'semantic_search', description: 'Hybrid search by meaning: keyword (BM25) and vector rankings, fused. The server embeds the candidates a query touches on demand, so it works right after a scan. Omit entity_type to search every kind', params: `{
  "query": "function to read and parse config files",
  "entity_type": "function",
  "limit": 10
}` },
    { name: 'generate_embeddings', description: 'Embed the entities missing vectors in one pass (idempotent) — the MCP counterpart of devscriptor embed', params: `{
  "force": false,
  "batch_size": 16
}` },
  ],
  quality: [
    { name: 'find_dead_code', description: 'Find the functions and classes nothing reaches — no call, reference, use or supertype, nor a runtime, framework or test runner — each with a confidence and a reason' },
    { name: 'analyze_complexity', description: 'Rank the functions in scope by cyclomatic complexity' },
  ],
  entities: [
    { name: 'get_entity_details', description: 'Where an entity is, and its signature, members, fields and supertypes', params: `{
  "entity_type": "function",
  "name": "parse_file",
  "file_path": "src/parser.rs"
}` },
    { name: 'get_relationships', description: 'What an entity is linked to — calls, uses, supertypes, members — with where each end is and the lines a call is made on' },
  ],
  context: [
    { name: 'add_context_note', description: 'Add a note, optionally linked to code entities and concepts' },
    { name: 'search_context', description: 'Search notes: keyword, semantic or hybrid, with type, status and priority filters' },
    { name: 'get_related_context', description: 'Notes linked to an entity: by its type, optionally narrowed by name and file' },
    { name: 'prune_context', description: 'Archive old or surplus notes, and delete long-archived ones (a dry run by default)' },
    { name: 'get_context_statistics', description: 'Context Graph statistics' },
  ],
  fileContext: [
    { name: 'describe_file', description: "Describe a file's contents: its entities and a numbered excerpt" },
    { name: 'describe_modification', description: 'Describe what a modification would do' },
    { name: 'get_file_context', description: 'The entities in a file, with a source excerpt around each' },
    { name: 'validate_file_edit', description: 'Validate a file edit with context' },
    { name: 'query_with_context', description: 'Query with context awareness' },
  ],
  watcher: [
    { name: 'start_watching', description: 'Watch a directory and keep the graph current. The server already watches the scanned project it runs in', params: `{
  "path": "/path/to/project",
  "debounce_ms": 400
}` },
    { name: 'stop_watching', description: 'Stop the watcher, and keep scans from starting it again' },
    { name: 'get_watch_status', description: 'Whether it watches, and how (native events, or polling and why), with the re-index count and the last re-index' },
  ],
}

// LSP Tools (38). † tools take a symbol by name, or by file_path, line, character.
const lspTools = {
  navigation: [
    { name: 'get_hover', description: 'Hover information (type signature, docs) for a symbol', params: `{ "name": "parse_config" }
{ "file_path": "/path/to/file.rs", "line": 10, "character": 15 }` },
    { name: 'get_definition', description: 'Definition location of a symbol' },
    { name: 'get_references', description: 'All references to a symbol; those the index records and the server did not report come in index_locations' },
    { name: 'get_type_definitions', description: 'Type definitions of a symbol' },
    { name: 'get_implementations', description: 'Implementations of an interface, trait or method' },
  ],
  completion: [
    { name: 'get_completions', description: 'Code completions at a position' },
    { name: 'get_completion_resolve', description: 'Resolve a completion item from get_completions' },
  ],
  diagnostics: [
    { name: 'get_diagnostics', description: 'Diagnostics (errors and warnings) for a file, pulled or collected from the server’s pushes' },
    { name: 'get_code_actions', description: 'Available code actions for a range' },
    { name: 'get_code_action_resolve', description: 'Resolve an action from get_code_actions' },
  ],
  symbols: [
    { name: 'get_document_symbols', description: 'All symbols in a file, parent first, each at its name' },
    { name: 'get_workspace_symbols', description: 'Search symbols across the workspace, in every running server that offers it' },
    { name: 'get_symbols', description: 'A file’s symbols, a page at a time' },
    { name: 'get_project_symbols', description: 'A language server’s symbols matching a query, optionally under one project' },
  ],
  callHierarchy: [
    { name: 'get_call_hierarchy', description: 'Call-hierarchy items for a symbol' },
    { name: 'get_incoming_calls', description: 'The calls into a function; the index adds those the server did not report' },
    { name: 'get_outgoing_calls', description: 'The calls a function makes' },
  ],
  typeHierarchy: [
    { name: 'get_type_hierarchy', description: 'Type-hierarchy items for a type' },
    { name: 'get_subtypes', description: 'A type’s subtypes' },
    { name: 'get_supertypes', description: 'A type’s supertypes' },
  ],
  documentFeatures: [
    { name: 'get_highlights', description: 'Document highlights for a symbol' },
    { name: 'get_colors', description: 'Document colors' },
    { name: 'get_folding_ranges', description: 'Folding ranges' },
    { name: 'get_selection_range', description: 'Smart selection ranges for a list of positions' },
    { name: 'get_linked_editing_range', description: 'Linked (synchronized) editing ranges' },
    { name: 'get_inlay_hints', description: 'Inlay hints for a range' },
    { name: 'get_links', description: 'Document links' },
    { name: 'get_semantic_tokens', description: 'Semantic tokens' },
  ],
  formatting: [
    { name: 'format_document', description: 'Format an entire document and write it to disk' },
    { name: 'get_range_format', description: 'Format a range and write it to disk' },
  ],
  refactoring: [
    { name: 'rename_symbol', description: 'Rename a symbol across the workspace, editing every affected file on disk' },
  ],
  serverManagement: [
    { name: 'get_server_status', description: 'Language-server status: running, exited or stopped, with why it stopped' },
    { name: 'get_server_capabilities', description: "A server's capabilities" },
    { name: 'get_server_projects', description: 'The folders a running server has open' },
    { name: 'get_project_files', description: "A project's files, without what its ignore files leave out" },
    { name: 'start_server', description: 'Start a language server for a project, or for the workspace' },
    { name: 'stop_server', description: 'Stop a language server' },
    { name: 'restart_server', description: 'Restart a language server' },
  ],
}

// Architecture Tools (5)
const architectureTools = [
  {
    name: 'lsp_arch_detect',
    description: 'Detect a project’s languages and resolve the servers it needs, each one missing with the reason it does not run; starts the installed ones in the background',
    params: `{
  "project_path": "/path/to/project"
}`,
  },
  { name: 'lsp_arch_check', description: 'Whether one server is available and where it resolves, or why it does not run and what makes it run; by id or language' },
  { name: 'lsp_arch_batch_check', description: 'Check several servers at once, by id or language' },
  { name: 'lsp_arch_status', description: 'Resolution status for all known servers, grouped by source' },
  {
    name: 'lsp_arch_setup',
    description: 'Install the servers a project needs (auto_install), or the servers servers_to_install names, by id or language. It downloads: gate it behind your approval',
    params: `{
  "project_path": "/path/to/project",
  "auto_install": true
}
{ "servers_to_install": ["rust-analyzer", "bash"] }`,
  },
]

const coreSections = [
  { key: 'jobs', title: 'Scanning & Analysis Jobs', tools: coreTools.jobs },
  { key: 'stats', title: 'Statistics & Health', tools: coreTools.stats },
  { key: 'search', title: 'Search & Embeddings', tools: coreTools.search },
  { key: 'quality', title: 'Code Quality Analysis', tools: coreTools.quality },
  { key: 'entities', title: 'Entities & Relationships', tools: coreTools.entities },
  { key: 'context', title: 'Context Graph', tools: coreTools.context },
  { key: 'fileContext', title: 'File Context & Edit Validation', tools: coreTools.fileContext },
  { key: 'watcher', title: 'Real-time Watcher', tools: coreTools.watcher },
]

const lspSections = [
  { key: 'navigation', title: 'Navigation & References', tools: lspTools.navigation },
  { key: 'completion', title: 'Completion', tools: lspTools.completion },
  { key: 'diagnostics', title: 'Diagnostics & Code Actions', tools: lspTools.diagnostics },
  { key: 'symbols', title: 'Symbols', tools: lspTools.symbols },
  { key: 'callHierarchy', title: 'Call Hierarchy', tools: lspTools.callHierarchy },
  { key: 'typeHierarchy', title: 'Type Hierarchy', tools: lspTools.typeHierarchy },
  { key: 'documentFeatures', title: 'Document Features', tools: lspTools.documentFeatures },
  { key: 'formatting', title: 'Formatting', tools: lspTools.formatting },
  { key: 'refactoring', title: 'Refactoring', tools: lspTools.refactoring },
  { key: 'serverManagement', title: 'Server Management', tools: lspTools.serverManagement },
]

const categoryIcons: Record<string, React.ElementType> = {
  jobs: Boxes,
  stats: Activity,
  search: Search,
  quality: AlertCircle,
  entities: Network,
  context: Brain,
  fileContext: FileCode,
  watcher: RefreshCw,
  navigation: Compass,
  completion: Zap,
  diagnostics: AlertCircle,
  symbols: List,
  callHierarchy: GitBranch,
  typeHierarchy: Network,
  documentFeatures: FileCode,
  formatting: AlignLeft,
  refactoring: Edit3,
  serverManagement: Server,
}

const categoryBgColors: Record<string, string> = {
  jobs: 'bg-blue-500/10',
  stats: 'bg-emerald-500/10',
  search: 'bg-cyan-500/10',
  quality: 'bg-red-500/10',
  entities: 'bg-indigo-500/10',
  context: 'bg-pink-500/10',
  fileContext: 'bg-teal-500/10',
  watcher: 'bg-amber-500/10',
  navigation: 'bg-emerald-500/10',
  completion: 'bg-amber-500/10',
  diagnostics: 'bg-red-500/10',
  symbols: 'bg-indigo-500/10',
  callHierarchy: 'bg-cyan-500/10',
  typeHierarchy: 'bg-purple-500/10',
  documentFeatures: 'bg-teal-500/10',
  formatting: 'bg-green-500/10',
  refactoring: 'bg-orange-500/10',
  serverManagement: 'bg-slate-500/10',
}

function ToolCard({ tool, category }: { tool: { name: string; description: string; params?: string }; category: string }) {
  const Icon = categoryIcons[category] || Terminal
  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${categoryBgColors[category]} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm sm:text-base font-mono text-white group-hover:text-blue-400 transition-colors break-all">
              {tool.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-400 mb-3">{tool.description}</p>
        {tool.params && (
          <pre className="bg-slate-950 rounded-lg p-3 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
            <code>{tool.params}</code>
          </pre>
        )}
      </CardContent>
    </Card>
  )
}

function CategorySection({ title, tools, category }: { title: string; tools: { name: string; description: string; params?: string }[]; category: string }) {
  const Icon = categoryIcons[category] || Terminal
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl ${categoryBgColors[category]} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-slate-300" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
        <Badge variant="outline" className="ml-auto border-slate-700 text-slate-400 flex-shrink-0">
          {tools.length}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} category={category} />
        ))}
      </div>
    </div>
  )
}

export default function MCPToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Terminal className="w-3 h-3 mr-1" />
              Reference
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">75 MCP Tools</span>
              <br />
              <span className="text-white">for AI Coding Agents</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              A toolkit for code intelligence, context memory, and LSP navigation — all served
              by one MCP server over stdio (<code className="text-slate-300">devscriptor mcp</code>).
              Works with Claude Desktop, Claude Code, Cursor, Cline, Rusta, and any MCP-compatible
              agent.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">32 Core Tools</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800">
                <Code2 className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-slate-300">38 LSP Tools</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">5 Architecture Tools</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Reference */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* max-w-6xl matches the tab panels below, so the selector lines up with its content */}
          <Tabs defaultValue="core" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-1 gap-1 h-auto sm:grid-cols-3 bg-slate-900/50 border border-slate-800 p-1 mb-12">
              {/* Active colours match each category's icon in the hero above. */}
              <TabsTrigger
                value="core"
                className="py-2.5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
              >
                <Cpu className="w-4 h-4 mr-2 flex-shrink-0" />
                Core Tools
                <Badge variant="outline" className="ml-2 border-slate-700 text-xs text-slate-400">
                  32
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="lsp"
                className="py-2.5 data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300"
              >
                <Code2 className="w-4 h-4 mr-2 flex-shrink-0" />
                LSP Tools
                <Badge variant="outline" className="ml-2 border-slate-700 text-xs text-slate-400">
                  38
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="architecture"
                className="py-2.5 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300"
              >
                <Layers className="w-4 h-4 mr-2 flex-shrink-0" />
                Architecture
                <Badge variant="outline" className="ml-2 border-slate-700 text-xs text-slate-400">
                  5
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="core" className="mt-0">
              <div className="max-w-6xl mx-auto">
                <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
                  Core tools operate on the local SQLite knowledge graph built by{' '}
                  <code className="text-slate-300">devscriptor scan</code> or{' '}
                  <code className="text-slate-300">scan_codebase</code>, and need no language
                  server. The ones that answer from the index first check the files they name
                  against the disk, and re-index those that changed.
                </p>
                {coreSections.map((section) => (
                  <CategorySection key={section.key} title={section.title} category={section.key} tools={section.tools} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="lsp" className="mt-0">
              <div className="max-w-6xl mx-auto">
                <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
                  LSP tools proxy live language-server features. A call goes to the server for the
                  file&apos;s language, which starts on first use — or in the background once{' '}
                  <code className="text-slate-300">lsp_arch_detect</code> finds its language — and
                  stops after 10 minutes unused. Positions are 0-based, and every result with one
                  carries a 1-based <code className="text-slate-300">cite</code> to quote. Missing
                  servers are installed with the Architecture tools or{' '}
                  <code className="text-slate-300">devscriptor lsp setup</code>.
                </p>
                {lspSections.map((section) => (
                  <CategorySection key={section.key} title={section.title} category={section.key} tools={section.tools} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="architecture" className="mt-0">
              <div className="max-w-6xl mx-auto">
                <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
                  Architecture tools drive the 4-tier LSP detection, prerequisite checking, and
                  installation on request.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {architectureTools.map((tool) => (
                    <ToolCard key={tool.name} tool={tool} category="serverManagement" />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* MCP Client Configuration */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Configuration
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">Connect Your MCP Client</h2>
              <p className="text-slate-400">
                Point your client at the <code className="text-slate-300">devscriptor</code> binary on
                your PATH with <code className="text-slate-300">args: [&quot;mcp&quot;]</code>. It serves all
                75 tools over JSON-RPC on stdio — there is no network port. The clients of one
                workspace share one server process, through a local socket: one index, watcher,
                embedding model and set of language servers. On connecting, the server tells the
                model which tools to start with, which matters most to a client that loads tools
                on demand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-blue-400" />
                    Claude Desktop / Claude Code / Cline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
                    <code>{`{
  "mcpServers": {
    "devscriptor": {
      "command": "devscriptor",
      "args": ["mcp"]
    }
  }
}`}</code>
                  </pre>
                  <p className="text-xs text-slate-500 mt-3">For debug logs on stderr use:</p>
                  <pre className="bg-slate-950 rounded-lg p-3 text-xs font-mono text-slate-400 overflow-x-auto border border-slate-800 mt-2">
                    <code>{`"args": ["--verbose", "mcp", "--no-daemon"]`}</code>
                  </pre>
                  <p className="text-xs text-slate-500 mt-2">
                    A shared server writes its log to its runtime directory instead. Setting{' '}
                    <code className="text-slate-400">RUST_LOG</code> has no effect — it is not read.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    Cursor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
                    <code>{`{
  "mcpServers": {
    "devscriptor": {
      "command": "devscriptor",
      "args": ["mcp"]
    }
  }
}`}</code>
                  </pre>
                  <p className="text-xs text-slate-500 mt-3">
                    Identical on every platform — Devscriptor ships one executable answering to one
                    name (<code className="text-slate-400">devscriptor.exe</code> on Windows).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Works with Any MCP Client</h2>
            <p className="text-slate-400 mb-8">
              All 75 tools are available through the Model Context Protocol — to Claude Desktop,
              Claude Code, Cursor, Cline, and any other MCP-compatible agent. Rusta detects
              Devscriptor and wires it in with no configuration.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/download/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Devscriptor
              </a>
              <a
                href="/lsp-integration/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
              >
                <Layers className="w-4 h-4" />
                LSP Intelligence
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
