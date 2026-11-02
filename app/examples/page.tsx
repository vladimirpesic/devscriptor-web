import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { CodeBlock } from '@/components/code-block'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code2, Terminal, Sparkles, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Examples - Devscriptor',
  description:
    'Copy-paste examples for Devscriptor: scan and embed a codebase, keyword and semantic search, static analysis, the real-time watcher, MCP client configuration, and LSP setup.',
}

const examples = [
  {
    id: 'scan',
    title: 'Scan a Codebase',
    description: 'Build the knowledge graph. Fast structural scan — no model loaded.',
    code: `# Fast structural scan (FTS5 search ready in seconds)
devscriptor scan ./my-project

# Only Python files, exclude tests
devscriptor scan ./my-project -i py -e tests/,*_test.py

# Re-scan only changed files
devscriptor scan ./my-project --incremental

# Scan + embed inline (needs ~4 GB free RAM)
devscriptor scan ./my-project --embed`,
    language: 'bash',
  },
  {
    id: 'search',
    title: 'Embed & Search',
    description: 'Add semantic search, then query by name or meaning.',
    code: `# Generate vectors once (idempotent, model unloads after)
devscriptor embed

# Entities by name, or one kind only
devscriptor search "getUserById"
devscriptor search "parse" -s function

# Hybrid search: keywords and meaning (vectors from embed)
devscriptor find-similar "database connection pooling"`,
    language: 'bash',
  },
  {
    id: 'analyze',
    title: 'Analyze & Inspect',
    description: 'Static analysis, call graphs, and a health check.',
    code: `# Dead-code and full analysis
devscriptor analyze -p ./my-project -k dead-code
devscriptor analyze -p ./my-project -k all -o json

# Call graph from an entry point (Mermaid output)
devscriptor call-graph --entity main --format mermaid --max-depth 3

# Database stats and health check
devscriptor status
devscriptor doctor`,
    language: 'bash',
  },
]

const mcpExamples = [
  {
    id: 'mcp-server',
    title: 'Run the MCP Server',
    description: 'Launch the unified MCP server (75 tools over JSON-RPC on stdio), shared by every agent of a workspace.',
    code: `# The unified MCP server — this is what agents spawn. It relays to
# the workspace's shared server, starting it when none answers.
devscriptor mcp

# Debug logs on stderr, from a server in this process (RUST_LOG is
# not read; the shared server logs to its own log)
devscriptor --verbose mcp --no-daemon

# Point it at a specific database. Without --database, mcp opens a
# shared, working-directory independent database (unlike other commands).
devscriptor mcp --database ./devscriptor.db`,
    language: 'bash',
  },
  {
    id: 'watch',
    title: 'Real-time Watcher',
    description: 'Keep the knowledge graph current automatically as you code.',
    code: `# Watch the current project (structural updates only)
devscriptor watch .

# Watch a specific database with a snappier debounce
devscriptor --database ./devscriptor.db watch ./my-project --debounce-ms 250

# Also re-embed changed entities inline (keeps the model resident; ~4 GB RAM)
devscriptor watch . --embed`,
    language: 'bash',
  },
]

const configExamples = [
  {
    id: 'claude-desktop',
    title: 'Claude Desktop / Claude Code / Cline',
    description: 'Point your client at the devscriptor binary on your PATH, with the mcp subcommand.',
    code: `{
  "mcpServers": {
    "devscriptor": {
      "command": "devscriptor",
      "args": ["mcp"]
    }
  }
}`,
    language: 'json',
  },
  {
    id: 'cursor',
    title: 'Cursor',
    description: 'Add to your Cursor MCP config (~/.cursor/mcp.json). Same shape on every platform.',
    code: `{
  "mcpServers": {
    "devscriptor": {
      "command": "devscriptor",
      "args": ["mcp"]
    }
  }
}`,
    language: 'json',
  },
]

const lspExamples = [
  {
    id: 'lsp-setup',
    title: 'LSP Setup',
    description: 'Detect languages and resolve or install language servers.',
    code: `# Detect the project's languages and install what it needs
devscriptor lsp setup            # interactive
devscriptor lsp setup --yes      # skip prompts

# Inspect resolution without installing
devscriptor lsp detect
devscriptor lsp status

# Install servers by id or language, whatever the project
devscriptor lsp setup kotlin bash

# Check a specific server (and its prerequisites)
devscriptor lsp check rust-analyzer
devscriptor lsp batch-check rust-analyzer gopls pyright`,
    language: 'bash',
  },
  {
    id: 'lsp-config',
    title: 'LSP Config Override',
    description: 'Choose the servers in devscriptor-lsp.toml (Tier 1): the LSP tools then use exactly those.',
    code: `# devscriptor-lsp.toml (or the file DEVSCRIPTOR_LSP_CONFIG names)
[workspace]
roots = ["."]

[[lsp_servers]]
language_id = "rust"
command = "/home/user/.cargo/bin/rust-analyzer"
extensions = ["rs"]

# A project's file applies once you trust its exact content:
#   devscriptor lsp trust`,
    language: 'toml',
  },
]

const queryExamples = [
  {
    id: 'query-ai',
    title: 'Query with AI',
    description: 'Example prompts once the MCP server is connected.',
    code: `# Ask your AI agent (Claude, Cursor, Cline, …):

"Find all functions related to user authentication"

"What's the complexity of the payment module?"

"Show me potentially dead code in the codebase"

"Get the definition of the AuthMiddleware type"

"Find all references to the database connection function"

"What do we already know about the retry logic here?"`,
    language: 'text',
  },
]

function ExampleCard({ example }: { example: { title: string; description: string; code: string; language: string } }) {
  return (
    <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white">{example.title}</CardTitle>
        <p className="text-sm text-slate-400">{example.description}</p>
      </CardHeader>
      <CardContent>
        <CodeBlock code={example.code} language={example.language} />
      </CardContent>
    </Card>
  )
}

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Code2 className="w-3 h-3 mr-1" />
              Examples
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">See It In</span>
              <br />
              <span className="text-white">Action</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From scanning your codebase to querying it through your AI agent. Copy, paste, and run.
            </p>
          </div>
        </div>
      </section>

      {/* Examples Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="cli" className="max-w-6xl mx-auto">
            <TabsList className="w-full flex flex-wrap justify-center gap-2 mb-8 bg-transparent h-auto">
              <TabsTrigger value="cli" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <Terminal className="w-4 h-4 mr-2" /> CLI
              </TabsTrigger>
              <TabsTrigger value="mcp" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <Sparkles className="w-4 h-4 mr-2" /> MCP Server
              </TabsTrigger>
              <TabsTrigger value="config" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <Code2 className="w-4 h-4 mr-2" /> Config
              </TabsTrigger>
              <TabsTrigger value="lsp" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <Layers className="w-4 h-4 mr-2" /> LSP
              </TabsTrigger>
              <TabsTrigger value="queries" className="data-[state=active]:bg-slate-800 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-lg">
                <Terminal className="w-4 h-4 mr-2" /> AI Queries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cli">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {examples.map((example) => (
                  <ExampleCard key={example.id} example={example} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mcp">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mcpExamples.map((example) => (
                  <ExampleCard key={example.id} example={example} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="config">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {configExamples.map((example) => (
                  <ExampleCard key={example.id} example={example} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="lsp">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {lspExamples.map((example) => (
                  <ExampleCard key={example.id} example={example} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="queries">
              <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
                {queryExamples.map((example) => (
                  <ExampleCard key={example.id} example={example} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
