import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Terminal,
  Search,
  GitGraph,
  Layers,
  Settings,
  Database,
  ChevronRight,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'CLI Reference - Devscriptor',
  description:
    'Complete reference for the Devscriptor CLI: the two-phase scan/embed workflow, search, static analysis, LSP management, the Context Graph, and the unified MCP server.',
}

interface Command {
  name: string
  usage: string
  description: string
  options: { flag: string; description: string }[]
  examples: string[]
}

// Indexing & embedding
const indexCommands: Command[] = [
  {
    name: 'scan',
    usage: 'scan [OPTIONS] <PATH>',
    description: 'Parse a codebase and build the knowledge graph. Fast: without --embed it never loads the model.',
    options: [
      { flag: '-i, --include <EXTS>', description: 'Comma-separated file extensions to include; replaces the project’s scan.include' },
      { flag: '-e, --exclude <PATTERNS>', description: 'Comma-separated glob patterns to exclude; replaces the project’s scan.exclude' },
      { flag: '--max-file-size <MB>', description: 'Skip larger files (default: the project’s, else 50)' },
      { flag: '--batch-size <N>', description: 'Files per database transaction (default 50)' },
      { flag: '--incremental', description: 'Skip unchanged files (mtime+size+hash manifest)' },
      { flag: '--embed', description: 'Embed inline after scanning (needs ~4 GB free RAM; skipped when short)' },
      { flag: '--skip-embeddings', description: 'Skip embeddings even with --embed (useful in CI)' },
      { flag: '--bulk-load', description: 'Rebuild FTS5 at the end: faster for fresh full scans, unsafe for incremental' },
      { flag: '--metrics', description: 'Print entity/language distribution, cache-hit rate and peak RSS' },
    ],
    examples: [
      'devscriptor scan ./my-project',
      'devscriptor scan ./my-project -i py -e tests/,*_test.py',
      'devscriptor scan ./my-project --incremental',
      'devscriptor scan ./my-project --bulk-load',
    ],
  },
  {
    name: 'watch',
    usage: 'watch [OPTIONS] <PATH>',
    description: 'An incremental scan, then a re-index on every source change until Ctrl-C.',
    options: [
      { flag: '-i, --include <EXTS>', description: 'Restrict to these extensions' },
      { flag: '-e, --exclude <GLOBS>', description: 'Exclude paths matching these globs' },
      { flag: '--embed', description: 'Re-embed changed entities inline after each re-scan' },
      { flag: '--debounce-ms <MS>', description: 'Quiet period before a re-scan (default 400)' },
    ],
    examples: [
      'devscriptor watch .',
      'devscriptor --database ./devscriptor.db watch ./my-project --debounce-ms 250',
    ],
  },
  {
    name: 'embed',
    usage: 'embed [OPTIONS]',
    description: 'Generate 768-dim vectors for the entities that lack them, then unload the model (~1.3 GB freed). Idempotent.',
    options: [
      { flag: '--batch-size <N>', description: 'Entities per inference run; 0 = auto (default)' },
      { flag: '--force', description: 'Re-embed entities that already have vectors' },
      { flag: '--daemon', description: 'Embed in a background process and return at once' },
      { flag: '--status', description: 'Show the latest background job’s progress' },
    ],
    examples: [
      'devscriptor embed',
      'devscriptor embed --daemon && devscriptor embed --status',
      'devscriptor embed --force',
    ],
  },
]

// Search
const searchCommands: Command[] = [
  {
    name: 'search',
    usage: 'search [OPTIONS] <QUERY>',
    description: 'Search entities by name: by default, every entity whose name contains the query.',
    options: [
      { flag: '-s, --search-type <TYPE>', description: 'symbol (default), function, class, or semantic (the hybrid search of find-similar)' },
      { flag: '-l, --limit <N>', description: 'Maximum results (default 20)' },
      { flag: '-o, --output <FMT>', description: 'text (default), json, or markdown' },
    ],
    examples: [
      'devscriptor search "getUserById"',
      'devscriptor search "parse" -s function',
      'devscriptor search "auth middleware" -s semantic -o json',
    ],
  },
  {
    name: 'find-similar',
    usage: 'find-similar [OPTIONS] <QUERY>',
    description: 'Hybrid search: FTS5 keyword and vector rankings fused; vectors cover what embed has embedded.',
    options: [{ flag: '-l, --limit <N>', description: 'Maximum results (default 10)' }],
    examples: [
      'devscriptor find-similar "database connection pooling"',
      'devscriptor find-similar "error handling pattern" -l 20',
    ],
  },
  {
    name: 'search-function / search-class',
    usage: 'search-function <NAME> [-f] [-l N]',
    description: 'Optimised name search scoped to a single entity type.',
    options: [
      { flag: '-f, --fuzzy', description: 'Enable fuzzy matching' },
      { flag: '-l, --limit <N>', description: 'Maximum results (default 50)' },
    ],
    examples: [
      'devscriptor search-function getUser --fuzzy',
      'devscriptor search-class User',
    ],
  },
  {
    name: 'search-pattern',
    usage: 'search-pattern <PATTERN> [-t <TYPE>] [-l <LANG>]',
    description: 'Search entities by name pattern, optionally scoped by type and language.',
    options: [
      { flag: '-t, --entity-type <TYPE>', description: 'Restrict to an entity type' },
      { flag: '-l, --language <LANG>', description: 'Restrict to a language' },
    ],
    examples: ['devscriptor search-pattern "parse_" -t function -l rust'],
  },
]

// Analysis
const analysisCommands: Command[] = [
  {
    name: 'analyze',
    usage: 'analyze [OPTIONS] --kind <KIND>',
    description: 'Static analysis of the indexed codebase (scan it first): dead code, complexity, clones, code smells, and more.',
    options: [
      { flag: '-p, --path <PATH>', description: 'Path to the codebase (default: the current directory)' },
      { flag: '-k, --kind <KIND>', description: 'dead-code, complexity, clones, cross-reference, call-graph, code-smells, cross-file, all' },
      { flag: '--severity <LEVEL>', description: 'Minimum severity: info, low, medium (default), high, critical' },
      { flag: '-o, --output <FMT>', description: 'text (default), json, or markdown' },
    ],
    examples: [
      'devscriptor analyze -p ./my-project -k dead-code',
      'devscriptor analyze -p ./my-project -k all -o json',
      'devscriptor analyze -p ./my-project -k code-smells --severity high',
    ],
  },
  {
    name: 'call-graph',
    usage: 'call-graph --entity <NAME> [OPTIONS]',
    description: 'A graph of every relationship of an entity — calls, uses, members, imports — up to a depth.',
    options: [
      { flag: '-e, --entity <NAME>', description: 'The entity to start from' },
      { flag: '-f, --format <FMT>', description: 'text (default), json, dot, or mermaid' },
      { flag: '-m, --max-depth <N>', description: 'Traversal depth (default 3)' },
      { flag: '--direction <DIR>', description: 'both (default), incoming, or outgoing' },
    ],
    examples: ['devscriptor call-graph -e main -f mermaid -m 3'],
  },
  {
    name: 'architecture-report',
    usage: 'architecture-report [OPTIONS]',
    description: 'Generate an architecture overview of the indexed codebase.',
    options: [
      { flag: '-p, --path <PATH>', description: 'Path to the codebase' },
      { flag: '-f, --format <FMT>', description: 'text (default), json, or markdown' },
      { flag: '-o, --output <FILE>', description: 'Write the report to a file (default: stdout)' },
    ],
    examples: ['devscriptor architecture-report -f markdown -o report.md'],
  },
]

// LSP
const lspCommands: Command[] = [
  {
    name: 'lsp setup',
    usage: 'lsp setup [TARGETS]... [-y]',
    description:
      "For a project (default .), detect its languages and install the servers it lacks, after asking; for a server named by id or language, install it.",
    options: [{ flag: '-y, --yes', description: 'Install without asking' }],
    examples: ['devscriptor lsp setup', 'devscriptor lsp setup --yes', 'devscriptor lsp setup kotlin bash'],
  },
  {
    name: 'lsp detect',
    usage: 'lsp detect [PATH]',
    description: 'Detect project languages and where their servers resolve, without installing.',
    options: [],
    examples: ['devscriptor lsp detect'],
  },
  {
    name: 'lsp status',
    usage: 'lsp status',
    description: 'Show the 21 servers, grouped by where each resolves.',
    options: [],
    examples: ['devscriptor lsp status'],
  },
  {
    name: 'lsp check / batch-check',
    usage: 'lsp check <SERVER_ID>',
    description: 'Check one or several servers: where each resolves, or what it lacks to run.',
    options: [],
    examples: [
      'devscriptor lsp check rust-analyzer',
      'devscriptor lsp batch-check rust-analyzer gopls pyright',
    ],
  },
  {
    name: 'lsp trust / untrust',
    usage: 'lsp trust [FILE]',
    description:
      "Show the servers a project's devscriptor-lsp.toml (the default FILE) would start, then trust that exact content; untrust withdraws it. Until trusted, a project's file is ignored.",
    options: [],
    examples: ['devscriptor lsp trust', 'devscriptor lsp untrust'],
  },
  {
    name: 'definition / references',
    usage: 'definition <FILE_PATH> -l <LINE> -c <CHAR>',
    description: 'Go-to-definition / find-references through a live language server; FILE_PATH is absolute, positions 0-indexed.',
    options: [
      { flag: '-l, --line <N>', description: 'Line number (0-indexed)' },
      { flag: '-c, --character <N>', description: 'Character position (0-indexed, UTF-16 code units)' },
      { flag: '--include-declaration [true|false]', description: 'references: include the declaration (default true)' },
    ],
    examples: [
      'devscriptor definition "$PWD/src/main.rs" -l 42 -c 8',
      'devscriptor references "$PWD/src/main.rs" -l 42 -c 8',
    ],
  },
]

// Utility / database / MCP
const utilityCommands: Command[] = [
  {
    name: 'status / stats',
    usage: 'status [-p <PATH>]',
    description: 'The database’s file, entity and relationship counts; stats prints them as JSON for scripts and CI.',
    options: [],
    examples: ['devscriptor status', 'devscriptor stats'],
  },
  {
    name: 'doctor',
    usage: 'doctor',
    description: 'Health check: the model cache, the project config, the database, missing vectors, disk space, memory and the grammars.',
    options: [],
    examples: ['devscriptor doctor'],
  },
  {
    name: 'cache-stats / perf-stats',
    usage: 'cache-stats',
    description: 'Parser cache hit/miss stats, and performance metrics collected during the session.',
    options: [],
    examples: ['devscriptor cache-stats', 'devscriptor perf-stats'],
  },
  {
    name: 'clean',
    usage: 'clean',
    description: 'Remove the database file, with its -wal and -shm files (the model cache is untouched).',
    options: [],
    examples: ['devscriptor clean'],
  },
  {
    name: 'repl',
    usage: 'repl',
    description: 'An interactive query session: run scans, searches and analyses without relaunching the binary.',
    options: [],
    examples: ['devscriptor repl'],
  },
  {
    name: 'template',
    usage: 'template <SUBCOMMAND>',
    description: 'Configuration templates: list, show, apply, analyze, create, export — apply writes one as devscriptor.yaml.',
    options: [],
    examples: ['devscriptor template analyze .', 'devscriptor template apply <NAME>'],
  },
  {
    name: 'profile',
    usage: 'profile <SUBCOMMAND>',
    description: 'Configuration profiles, the same set as template: list, show, create, apply, delete.',
    options: [],
    examples: ['devscriptor profile list', 'devscriptor profile apply <NAME>'],
  },
  {
    name: 'validate',
    usage: 'validate [CONFIG_FILE]',
    description: 'Check a project configuration (default: --config, else devscriptor.yaml): a setting that cannot apply is an error, a doubtful one a warning.',
    options: [],
    examples: ['devscriptor validate', 'devscriptor validate devscriptor.yaml'],
  },
  {
    name: 'context',
    usage: 'context <SUBCOMMAND>',
    description: 'Manage the Context Graph: add, list, search, show, delete, prune, entity, concept.',
    options: [],
    examples: [
      'devscriptor context add -t "Use rustls" -c "..." -n adr',
      'devscriptor context search "auth"',
    ],
  },
  {
    name: 'mcp',
    usage: 'mcp [OPTIONS]',
    description:
      'The 75-tool MCP server, over stdio (no TCP port). By default it relays to the workspace’s shared server, starting it when none answers. Unlike the other commands, it defaults to a shared database that does not depend on the working directory.',
    options: [
      { flag: '--lsp-startup <lazy|eager>', description: 'When language servers start (default lazy)' },
      { flag: '--no-watch', description: 'Do not watch the scanned project it runs in' },
      { flag: '--no-daemon', description: 'Serve in this process instead of the shared server' },
    ],
    examples: [
      'devscriptor mcp',
      'devscriptor --database ./devscriptor.db mcp',
      'devscriptor --verbose mcp --no-daemon',
    ],
  },
  {
    name: 'serve',
    usage: 'serve --workspace <DIR> [OPTIONS]',
    description:
      'The workspace’s shared server, which every devscriptor mcp started there relays to, over a local socket (a named pipe on Windows). mcp starts it; run it yourself to watch its log.',
    options: [
      { flag: '--workspace <DIR>', description: 'The workspace to serve' },
      { flag: '--lsp-startup <lazy|eager>', description: 'When language servers start, as for mcp' },
      { flag: '--no-watch', description: 'Do not watch the workspace’s scanned root' },
    ],
    examples: ['devscriptor serve --workspace .'],
  },
]

function CommandCard({ command }: { command: Command }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-mono text-white group-hover:text-blue-400 transition-colors whitespace-normal break-words">
          {command.name}
        </CardTitle>
        <div className="mt-1 overflow-x-auto">
          <code className="text-xs text-slate-500 font-mono">{command.usage}</code>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <p className="text-sm text-slate-400">{command.description}</p>

        {command.options.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Options</h4>
            <div className="space-y-1.5">
              {command.options.map((opt, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-sm">
                  <code className="text-xs font-mono text-emerald-400 flex-shrink-0">{opt.flag}</code>
                  <span className="text-slate-400 text-xs">{opt.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Examples</h4>
          <div className="space-y-1.5">
            {command.examples.map((example, index) => (
              <div key={index} className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-slate-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1 overflow-x-auto">
                  <code className="text-xs font-mono text-slate-300">{example}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CommandSection({ title, commands, icon: Icon, color }: { title: string; commands: Command[]; icon: React.ElementType; color: string }) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-500/10',
    violet: 'bg-violet-500/10',
    emerald: 'bg-emerald-500/10',
    amber: 'bg-amber-500/10',
    cyan: 'bg-cyan-500/10',
  }
  const textColors: Record<string, string> = {
    blue: 'text-blue-400',
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    cyan: 'text-cyan-400',
  }
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl ${bgColors[color]} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${textColors[color]}`} />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
        <Badge variant="outline" className="ml-auto border-slate-700 text-slate-400 flex-shrink-0">
          {commands.length}
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {commands.map((command) => (
          <CommandCard key={command.name} command={command} />
        ))}
      </div>
    </div>
  )
}

export default function CLIReferencePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
              <Terminal className="w-3 h-3 mr-1" />
              Reference
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">CLI Reference</span>
              <br />
              <span className="text-white">One Binary, Every Command</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Index and embed your codebase, search it, analyze it, manage language servers, and launch
              the MCP server — all from the single <code className="text-slate-300">devscriptor</code> binary.
            </p>
            <div className="mx-auto max-w-2xl rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-left">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Global options</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <code className="text-slate-300">-d, --database &lt;FILE&gt;</code>
                <code className="text-slate-300">--config &lt;FILE&gt;</code>
                <code className="text-slate-300">-v, --verbose</code>
                <code className="text-slate-300">-V, --version</code>
                <code className="text-slate-300">-h, --help</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commands Reference */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="index" className="max-w-6xl mx-auto">
            <TabsList className="w-full flex flex-wrap justify-center gap-2 mb-12 bg-transparent h-auto">
              <TabsTrigger value="index" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <Database className="w-4 h-4 mr-2" /> Index &amp; Embed
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <Search className="w-4 h-4 mr-2" /> Search
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <GitGraph className="w-4 h-4 mr-2" /> Analyze
              </TabsTrigger>
              <TabsTrigger value="lsp" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <Layers className="w-4 h-4 mr-2" /> LSP
              </TabsTrigger>
              <TabsTrigger value="utility" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <Settings className="w-4 h-4 mr-2" /> Utility &amp; MCP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="index" className="mt-0">
              <CommandSection title="Index & Embed" commands={indexCommands} icon={Database} color="blue" />
            </TabsContent>
            <TabsContent value="search" className="mt-0">
              <CommandSection title="Search" commands={searchCommands} icon={Search} color="violet" />
            </TabsContent>
            <TabsContent value="analysis" className="mt-0">
              <CommandSection title="Analyze" commands={analysisCommands} icon={GitGraph} color="cyan" />
            </TabsContent>
            <TabsContent value="lsp" className="mt-0">
              <CommandSection title="LSP" commands={lspCommands} icon={Layers} color="emerald" />
            </TabsContent>
            <TabsContent value="utility" className="mt-0">
              <CommandSection title="Utility & MCP" commands={utilityCommands} icon={Settings} color="amber" />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Two-phase tip */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  The two-phase workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span><code className="text-slate-300">devscriptor scan</code> is fast and, without <code className="text-slate-300">--embed</code>, never loads the model — FTS5 keyword search and structural queries are ready as soon as it ends.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span><code className="text-slate-300">devscriptor embed</code> backfills semantic vectors when you choose (sized for 4 GB of available RAM; with less it runs fewer inferences at once) and is idempotent — re-runs only embed what changed.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>Run <code className="text-slate-300">devscriptor --help</code> or <code className="text-slate-300">devscriptor &lt;command&gt; --help</code> for full details on any command.</span>
                  </li>
                </ul>
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
