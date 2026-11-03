import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Layers,
  Server,
  Settings,
  Terminal,
  Compass,
  Zap,
  AlertCircle,
  List,
  GitBranch,
  Network,
  FileCode,
  AlignLeft,
  Edit3,
  Code2,
  Download,
  CheckCircle,
  Cpu,
  FileSearch,
  FolderOpen,
  Globe,
  Package,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'LSP Intelligence - Devscriptor',
  description:
    'Devscriptor LSP integration: 38 LSP MCP tools and 5 architecture tools over 21 language servers, found in four places or installed, checksum-verified, when you ask.',
}

// Four places a server is looked for (a config file → Devscriptor's installs → the system → editor extensions)
const detectionTiers = [
  {
    tier: 1,
    title: 'A Configuration File',
    path: 'devscriptor-lsp.toml · DEVSCRIPTOR_LSP_CONFIG',
    description: 'When one applies it is authoritative: the LSP tools use exactly the servers it lists.',
    icon: Settings,
    accent: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    details: [
      'Each server’s command, arguments and environment',
      'Its file extensions and project markers',
      'Initialization options and settings',
      'A project’s file applies only once trusted',
    ],
  },
  {
    tier: 2,
    title: 'Devscriptor’s Own Installs',
    path: '<cache>/devscriptor/lsp-servers/ · bundle/lsp-servers/',
    description: 'The servers lsp setup installed, then a bundle beside the executable.',
    icon: Package,
    accent: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    details: [
      'Installs made by lsp setup or lsp_arch_setup',
      'Every download checked against its SHA-256',
      'jdtls and the Dart SDK at the version pinned',
      'Reused across projects',
    ],
  },
  {
    tier: 3,
    title: 'The System',
    path: '$PATH + known locations',
    description: 'Reuse servers already installed on your system.',
    icon: Globe,
    accent: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    details: [
      'The server’s command on the PATH',
      'rustup toolchains, ~/go/bin, ~/.npm-global/bin',
      'LLVM’s directories and Xcode’s toolchain',
      'No duplicate installs',
    ],
  },
  {
    tier: 4,
    title: 'Editor Extensions',
    path: '~/.vscode/extensions/',
    description: 'Reuse the language servers bundled with your VS Code extensions.',
    icon: Code2,
    accent: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    details: [
      'Read-only: nothing is changed there',
      'VS Code Server, Cursor, Windsurf or Code - OSS when VS Code is absent',
      'No separate install needed',
      'Checked last',
    ],
  },
]

// LSP Tools by Category (38 total), described as the server's tools/list describes them
const lspTools = {
  navigation: {
    title: 'Navigation & References',
    icon: Compass,
    bgColor: 'bg-emerald-500/10',
    tools: [
      { name: 'get_hover', description: 'Hover information (type signature, docs) for a symbol' },
      { name: 'get_definition', description: 'Definition location of a symbol' },
      { name: 'get_references', description: 'All references to a symbol, with the uses the index records' },
      { name: 'get_type_definitions', description: 'Type definitions' },
      { name: 'get_implementations', description: 'Implementations' },
    ],
  },
  completion: {
    title: 'Completion',
    icon: Zap,
    bgColor: 'bg-amber-500/10',
    tools: [
      { name: 'get_completions', description: 'Code completions at a position' },
      { name: 'get_completion_resolve', description: 'Resolve a completion item from get_completions' },
    ],
  },
  diagnostics: {
    title: 'Diagnostics & Code Actions',
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    tools: [
      { name: 'get_diagnostics', description: 'Diagnostics (errors and warnings) for a file' },
      { name: 'get_code_actions', description: 'Available code actions for a range' },
      { name: 'get_code_action_resolve', description: 'Resolve an action from get_code_actions' },
    ],
  },
  symbols: {
    title: 'Symbols',
    icon: List,
    bgColor: 'bg-indigo-500/10',
    tools: [
      { name: 'get_document_symbols', description: 'All symbols in a file, parent first, each at its name' },
      { name: 'get_workspace_symbols', description: 'Search symbols across the workspace, in every running server that offers it' },
      { name: 'get_symbols', description: 'A file’s symbols, a page at a time' },
      { name: 'get_project_symbols', description: 'A language server’s symbols matching a query, optionally under one project' },
    ],
  },
  callHierarchy: {
    title: 'Call Hierarchy',
    icon: GitBranch,
    bgColor: 'bg-cyan-500/10',
    tools: [
      { name: 'get_call_hierarchy', description: 'Call-hierarchy items for a symbol' },
      { name: 'get_incoming_calls', description: 'The calls into a function, with those the index records' },
      { name: 'get_outgoing_calls', description: 'The calls a function makes' },
    ],
  },
  typeHierarchy: {
    title: 'Type Hierarchy',
    icon: Network,
    bgColor: 'bg-purple-500/10',
    tools: [
      { name: 'get_type_hierarchy', description: 'Type-hierarchy items for a type' },
      { name: 'get_subtypes', description: 'A type’s subtypes' },
      { name: 'get_supertypes', description: 'A type’s supertypes' },
    ],
  },
  documentFeatures: {
    title: 'Document Features',
    icon: FileCode,
    bgColor: 'bg-teal-500/10',
    tools: [
      { name: 'get_highlights', description: 'Document highlights for a symbol' },
      { name: 'get_colors', description: 'Document colors' },
      { name: 'get_folding_ranges', description: 'Folding ranges' },
      { name: 'get_selection_range', description: 'Smart selection ranges' },
      { name: 'get_linked_editing_range', description: 'Linked (synchronized) editing ranges' },
      { name: 'get_inlay_hints', description: 'Inlay hints for a range' },
      { name: 'get_links', description: 'Document links' },
      { name: 'get_semantic_tokens', description: 'Semantic tokens' },
    ],
  },
  formatting: {
    title: 'Formatting',
    icon: AlignLeft,
    bgColor: 'bg-green-500/10',
    tools: [
      { name: 'format_document', description: 'Format an entire document and write it to disk' },
      { name: 'get_range_format', description: 'Format a range and write it to disk' },
    ],
  },
  refactoring: {
    title: 'Refactoring',
    icon: Edit3,
    bgColor: 'bg-orange-500/10',
    tools: [
      { name: 'rename_symbol', description: 'Rename a symbol across the workspace, editing every affected file on disk' },
    ],
  },
  serverManagement: {
    title: 'Server Management',
    icon: Server,
    bgColor: 'bg-slate-500/10',
    tools: [
      { name: 'get_server_status', description: 'Language-server status: running, exited or stopped, with why' },
      { name: 'get_server_capabilities', description: "A server's capabilities" },
      { name: 'get_server_projects', description: 'The folders a running server has open' },
      { name: 'get_project_files', description: "A project's files, without what its ignore files leave out" },
      { name: 'start_server', description: 'Start a language server for a project, or for the workspace' },
      { name: 'stop_server', description: 'Stop a language server' },
      { name: 'restart_server', description: 'Restart a language server' },
    ],
  },
}

// Supported Language Servers (21), and where `lsp setup` installs each from when
// the Devscriptor mirror has no build of it
const supportedServers = [
  { name: 'rust-analyzer', language: 'Rust', source: 'GitHub release' },
  { name: 'clangd', language: 'C · C++ · CUDA · Objective-C', source: 'GitHub release' },
  { name: 'gopls', language: 'Go', source: 'go install' },
  { name: 'typescript-language-server', language: 'TypeScript · JS · TSX', source: 'npm' },
  { name: 'volar', language: 'Vue', source: 'npm' },
  { name: 'svelte-language-server', language: 'Svelte', source: 'npm' },
  { name: 'html-languageserver', language: 'HTML', source: 'npm' },
  { name: 'graphql-language-service', language: 'GraphQL', source: 'npm' },
  { name: 'pyright', language: 'Python', source: 'npm' },
  { name: 'sql-language-server', language: 'SQL', source: 'npm' },
  { name: 'jdtls', language: 'Java', source: 'Eclipse milestone archive' },
  { name: 'kotlin-lsp', language: 'Kotlin', source: 'JetBrains, latest build (never mirrored)' },
  { name: 'metals', language: 'Scala', source: 'Coursier' },
  { name: 'csharp-ls', language: 'C#', source: 'dotnet tool' },
  { name: 'fsautocomplete', language: 'F#', source: 'dotnet tool, with Fantomas' },
  { name: 'sourcekit-lsp', language: 'Swift', source: 'the Swift toolchain (not installed)' },
  { name: 'dart-ls', language: 'Dart', source: 'Google’s Dart SDK archive' },
  { name: 'ruby-lsp', language: 'Ruby', source: 'gem' },
  { name: 'bash-language-server', language: 'Bash', source: 'npm' },
  { name: 'nomicfoundation-solc', language: 'Solidity', source: 'npm' },
  { name: 'phpactor', language: 'PHP', source: 'GitHub release (not on Windows)' },
]

// CLI Commands, with the output devscriptor prints for a small Rust project with a Python script
const cliCommands = [
  {
    command: 'devscriptor lsp setup',
    description:
      "Detect the project's languages and install the servers it lacks, after asking (--yes skips the question). Name servers, by id or language, to install those instead.",
    example: `$ devscriptor lsp setup
🔧 LSP Setup
Project: .

Languages Detected:
  • rust (confidence: 80%)
    Indicators: Cargo.toml
  • python (confidence: 30%)
✅ Found LSP Servers
  ⬇️  rust-analyzer ~/.cache/devscriptor/lsp-servers/rust-analyzer/bin/rust-analyzer - installed
  ⬇️  pyright ~/.cache/devscriptor/lsp-servers/pyright/node_modules/.bin/pyright-langserver - installed

📋 Summary
Total languages detected: 2
LSP servers available: 2
Ready to install: 0
Missing prerequisites: 0`,
  },
  {
    command: 'devscriptor lsp detect',
    description: "Detect the project's languages and where each server resolves, without installing.",
    example: `$ devscriptor lsp detect
🔍 LSP Detection
Languages Detected:
  • rust (confidence: 80%)
    Indicators: Cargo.toml
  • python (confidence: 30%)

Found LSP Servers
  ⬇️  rust-analyzer ~/.cache/devscriptor/lsp-servers/rust-analyzer/bin/rust-analyzer - installed
  ⬇️  pyright ~/.cache/devscriptor/lsp-servers/pyright/node_modules/.bin/pyright-langserver - installed`,
  },
  {
    command: 'devscriptor lsp status',
    description: 'List the 21 servers, grouped by where each resolves.',
    example: `$ devscriptor lsp status
📊 LSP Status
Found 21 LSP servers:

system (1)
  ✅ sourcekit-lsp

installed (20)
  ✅ rust-analyzer
  ✅ clangd
  ✅ gopls
  …`,
  },
  {
    command: 'devscriptor lsp check <server>',
    description:
      'Check one server: where it resolves, or why it does not run and the prerequisites it lacks, each with how to install it.',
    example: `$ devscriptor lsp check rust-analyzer
🔍 Checking: rust-analyzer
✅ found at: ~/.cache/devscriptor/lsp-servers/rust-analyzer/bin/rust-analyzer
Source: installed`,
  },
  {
    command: 'devscriptor lsp batch-check <servers…>',
    description: 'Check several servers at once.',
    example: `$ devscriptor lsp batch-check rust-analyzer pyright gopls
🔍 Batch Server Check
✅ rust-analyzer - ~/.cache/devscriptor/lsp-servers/rust-analyzer/bin/rust-analyzer (installed)
✅ pyright - ~/.cache/devscriptor/lsp-servers/pyright/node_modules/.bin/pyright-langserver (installed)
✅ gopls - ~/.cache/devscriptor/lsp-servers/gopls/bin/gopls (installed)`,
  },
  {
    command: 'devscriptor lsp trust [file]',
    description:
      "Show the servers a project's devscriptor-lsp.toml would start, then trust that exact content; lsp untrust withdraws it.",
    example: `$ devscriptor lsp trust
devscriptor-lsp.toml runs these language servers:
  rust         rust-analyzer
Trusted. Devscriptor uses it until the file changes.`,
  },
]

export default function LSPIntegrationPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-violet-500/20 text-violet-300 border-violet-500/30">
              <Server className="w-3 h-3 mr-1" />
              LSP Intelligence
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">Live Code Intelligence</span>
              <br />
              <span className="text-white">from Real Language Servers</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              38 LSP MCP tools and 5 architecture tools over 21 pre-configured language servers: each
              found where you already have it, or installed, checksum-verified, when you ask.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800">
                <Code2 className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-slate-300">38 LSP Tools</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">4-Tier Detection</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">21 Language Servers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Tier Detection System */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <Layers className="w-3 h-3 mr-1" />
                Detection System
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">4-Tier LSP Detection</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Devscriptor looks for a server in four places, in priority order, and uses the first it
                finds. A server found nowhere is installed when you ask — checksum-verified, from the
                Devscriptor mirror or the server&apos;s own source.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {detectionTiers.map((tier) => {
                const Icon = tier.icon
                return (
                  <Card key={tier.tier} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${tier.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${tier.accent}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                              Tier {tier.tier}
                            </Badge>
                            <CardTitle className="text-lg text-white">{tier.title}</CardTitle>
                          </div>
                          <div className="overflow-x-auto">
                            <code className="text-xs text-slate-500">{tier.path}</code>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 mb-4 text-sm">{tier.description}</p>
                      <ul className="space-y-2">
                        {tier.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <Download className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">Install when you ask:</span> when none of the
                four places has a server, <code className="text-slate-300">devscriptor lsp setup</code>{' '}
                (or the MCP <code className="text-slate-300">lsp_arch_setup</code>) installs it after
                a prerequisite check — from the Devscriptor mirror, a GitHub release whose archives
                the build pins by SHA-256, or, where the mirror has no build, from the server&apos;s own
                source: its GitHub release, npm, <code className="text-slate-300">go install</code>,{' '}
                <code className="text-slate-300">dotnet tool</code>, gem, Coursier, or its
                publisher&apos;s archive. An unverified download is refused, and nothing is installed
                unasked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LSP Tools */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-violet-500/20 text-violet-300 border-violet-500/30">
                <Code2 className="w-3 h-3 mr-1" />
                Tools Reference
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">38 LSP Tools</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Live language-server features exposed as MCP tools, organized by category. The position
                tools take a symbol <code className="text-slate-300">name</code>, resolved from the
                index, or <code className="text-slate-300">file_path</code>,{' '}
                <code className="text-slate-300">line</code> and{' '}
                <code className="text-slate-300">character</code>, counted from 0 as LSP counts them;
                every result with a position carries a <code className="text-slate-300">cite</code>{' '}
                (<code className="text-slate-300">path:line:column</code>, counted from 1) to quote.
              </p>
            </div>

            <Tabs defaultValue="navigation" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-center gap-2 mb-8 bg-transparent h-auto">
                {Object.entries(lspTools).map(([key, category]) => {
                  const Icon = category.icon
                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="data-[state=active]:bg-slate-800 data-[state=active]:border-slate-700 bg-slate-900/50 border border-slate-800 px-3 py-2 rounded-lg"
                    >
                      <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="hidden sm:inline">{category.title}</span>
                      <Badge variant="outline" className="ml-2 text-xs border-slate-700">
                        {category.tools.length}
                      </Badge>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {Object.entries(lspTools).map(([key, category]) => (
                <TabsContent key={key} value={key} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.tools.map((tool) => (
                      <Card key={tool.name} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center flex-shrink-0`}>
                              <category.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm sm:text-base font-mono text-white group-hover:text-violet-400 transition-colors break-all">
                                {tool.name}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-slate-400">{tool.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Supported Language Servers */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Cpu className="w-3 h-3 mr-1" />
                Language Servers
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">21 Pre-Configured Servers</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Together these cover every Devscriptor language and framework but VB.NET, which is
                indexed but has no language server. Each installs from the Devscriptor mirror first;
                the source shown is the one used where the mirror has no build.{' '}
                <code className="text-slate-300">devscriptor lsp check &lt;server&gt;</code> names what a
                server needs to run — Node.js, Java, .NET, a toolchain — and how to install it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportedServers.map((server) => (
                <Card key={server.name} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-sm font-mono text-white group-hover:text-blue-400 transition-colors break-all">
                          {server.name}
                        </CardTitle>
                        <p className="text-xs text-slate-500 mt-1">{server.language}</p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <code className="text-xs text-slate-600">{server.source}</code>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
                <Settings className="w-3 h-3 mr-1" />
                Configuration
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">Overriding Server Resolution</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                The first place is a configuration file: <code className="text-slate-300">devscriptor-lsp.toml</code>{' '}
                in the directory Devscriptor runs in, or the file{' '}
                <code className="text-slate-300">DEVSCRIPTOR_LSP_CONFIG</code> names. It names commands
                to run, so a project&apos;s file is ignored until you trust its exact content with{' '}
                <code className="text-slate-300">devscriptor lsp trust</code>; editing the file
                withdraws the trust.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-amber-400" />
                    Choose the servers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
                    <code>{`# devscriptor-lsp.toml: the LSP tools use exactly these
[workspace]
roots = ["."]

[[lsp_servers]]
language_id = "rust"
command = "/home/user/.cargo/bin/rust-analyzer"
extensions = ["rs"]
heuristics = { markers = ["Cargo.toml", "Cargo.lock"], max_depth = 3 }

[[lsp_servers]]
language_id = "python"
command = "pyright-langserver"
args = ["--stdio"]
extensions = ["py", "pyw", "pyi"]

[lifecycle]
startup = "lazy"           # or "eager"
idle_timeout_secs = 600    # 0 never stops an idle server`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-emerald-400" />
                    Environment variables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
                    <code>{`# A configuration file anywhere (needs no trust: you set it)
export DEVSCRIPTOR_LSP_CONFIG=/path/to/devscriptor-lsp.toml

# Install from another place that holds the mirror's archives
export DEVSCRIPTOR_LSP_MIRROR_URL=https://mirror.example.com/lsp-servers

# Stop idle servers after 5 minutes; run at most 4 at once
export DEVSCRIPTOR_LSP_IDLE_SECS=300
export DEVSCRIPTOR_LSP_MAX_SERVERS=4`}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CLI Commands */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-slate-500/20 text-slate-300 border-slate-500/30">
                <Terminal className="w-3 h-3 mr-1" />
                CLI Reference
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">LSP CLI Commands</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Manage language servers from the command line with{' '}
                <code className="text-slate-300">devscriptor lsp</code>.
              </p>
            </div>

            <div className="space-y-6">
              {cliCommands.map((cmd) => (
                <Card key={cmd.command} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
                  <CardHeader className="pb-3">
                    <div>
                      <code className="text-sm font-mono text-white whitespace-normal">{cmd.command}</code>
                      <p className="text-sm text-slate-400 mt-1">{cmd.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <pre className="bg-slate-950 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
                      <code>{cmd.example}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Bring Live Code Intelligence to Your Agent</h2>
            <p className="text-slate-400 mb-8">
              Download Devscriptor and expose 38 LSP tools across 21 language servers — found where
              you already have them, or installed when you ask.
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
                href="/mcp-tools/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
              >
                <Code2 className="w-4 h-4" />
                View MCP Tools
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
