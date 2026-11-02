import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, Mail, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - Devscriptor',
  description: 'Frequently asked questions about Devscriptor and Rusta: MCP integration, local-first privacy, 26 languages & frameworks, LSP code intelligence, licensing, and more.',
}

const faqs = [
  {
    question: 'What is Devscriptor?',
    answer: 'Devscriptor is a high-performance code analysis engine built in Rust that builds a knowledge graph of your codebase in a single SQLite file. It extracts entities (functions, classes, etc.), relationships (calls, inheritance), enables semantic search, and provides LSP code intelligence—making your codebase queryable by AI agents through the Model Context Protocol (MCP).',
    category: 'General',
  },
  {
    question: 'How does MCP integration work?',
    answer: 'Devscriptor includes a native, unified MCP (Model Context Protocol) server that exposes 75 tools over JSON-RPC on stdio to AI agents like Claude Desktop, Cursor, and Cline. This includes 32 core tools for scanning, search, analysis, the Context Graph, and the real-time watcher; 38 LSP tools for live code intelligence (go-to-definition, hover, completions, diagnostics); and 5 architecture tools for LSP detection and setup. Configure your client with command "devscriptor" and args ["mcp"] — one binary, one name, on every platform. The agents working in one workspace share one Devscriptor server, so they share its index, watcher, model and language servers. Rusta finds Devscriptor on your PATH and registers it with no configuration.',
    category: 'Integration',
  },
  {
    question: 'Is my code sent to any external service?',
    answer: 'No. Your code never leaves your machine. Scanning, parsing, indexing, and search make no network calls, all data lives in a local SQLite file, and there is no telemetry, no analytics, and no tracking of any kind. Devscriptor only touches the network to fetch things you ask for: the one-time embedding-model download the first time the model is needed, the LSP server installs you request, and the VS Code extension’s update check when you run it. None transmits your code, and the first two can be pre-staged so the tool runs fully air-gapped. This makes it well suited for proprietary codebases and environments with strict data-security requirements.',
    category: 'Security',
  },
  {
    question: 'Does it work with local LLMs?',
    answer: 'Yes. Devscriptor is an MCP server, not an LLM — it works with any MCP-compatible client, including agents backed by locally hosted models. Because all of Devscriptor’s own analysis runs on your machine, nothing about your code depends on a cloud provider. Your AI client (Claude Desktop, Cursor, Cline, etc.) connects to Devscriptor over stdio and can route to whatever model you choose.',
    category: 'Integration',
  },
  {
    question: 'What languages are supported?',
    answer: 'Devscriptor parses 26 languages and frameworks with tree-sitter 0.27: Python, Rust, TypeScript/TSX, JavaScript, Go, Java, C, C++, C#, Ruby, PHP, Swift, Kotlin, Scala, Dart, Bash, SQL, Solidity, F#, GraphQL, HTML, Objective-C, CUDA, and VB.NET — plus the Vue and Svelte frameworks. It extracts functions, classes, structs, enums, interfaces, components, and their relationships (calls, inherits, implements, uses).',
    category: 'Features',
  },
  {
    question: 'What is LSP Code Intelligence?',
    answer: 'LSP (Language Server Protocol) integration provides real-time IDE features: go-to-definition, hover information, completions, diagnostics, call hierarchy, and type hierarchy. Devscriptor includes 38 LSP tools and 5 architecture tools, and ships 21 pre-configured language servers, each looked for in four places (a configuration file → Devscriptor’s own installs → the system → editor extensions) and, where none has it, installed when you ask — checksum-verified. Servers include rust-analyzer, pyright, typescript-language-server, gopls, clangd, and more.',
    category: 'Features',
  },
  {
    question: 'What is the Context Graph?',
    answer: 'Context Graph is an AI memory system that persists across sessions in the same local SQLite database as the code graph. It stores notes using 9 structured types: adr (architecture decisions), standard (coding standards), optimization, failure, practice, reflection, general, file_description, and modification. Notes can be linked to concrete code entities and abstract concepts, and retrieved by keyword, semantic, or hybrid search. When you return to a project weeks later, your AI recalls the context.',
    category: 'Features',
  },
  {
    question: 'How does semantic search work?',
    answer: 'Devscriptor generates 768-dimensional vector embeddings for your code using the local jina-embeddings-v2-base-code model (INT8-quantized, ~160 MB). No API keys are required — the model downloads once, then runs offline. These embeddings capture the semantic meaning of code, so you can search by concept (e.g., "functions that handle authentication") rather than keywords. Vector search uses cosine similarity via sqlite-vec, and can be fused with FTS5 keyword results using Reciprocal Rank Fusion.',
    category: 'Features',
  },
  {
    question: 'Is it suitable for large codebases?',
    answer: 'Yes. Devscriptor is built in Rust and uses parallel, gitignore-aware file discovery, memory-mapped parsing, and a streamed cross-file analysis pass with bounded memory. Incremental scanning (mtime+size+XXH3) and a content-hash embedding cache make re-analysis fast. A scan stays under ~400 MB of memory, and under memory pressure the pipeline slows down instead of failing. Embedding is CPU-bound and takes longest: minutes to an hour or two for a small or medium repository, and it can run in the background, incrementally.',
    category: 'Performance',
  },
  {
    question: 'How do I get started?',
    answer: 'Download the archive for your platform from the Download page (it comes from GitHub Releases), check it against its .sha256 file, extract it, and put the devscriptor binary on your PATH. Then run "devscriptor scan ./your-project" to build the knowledge graph, and optionally "devscriptor embed" for semantic search. For AI integration, configure your MCP client with command "devscriptor" and args ["mcp"]. See the Download page for full setup instructions.',
    category: 'Getting Started',
  },
  {
    question: 'Why Rust?',
    answer: 'Rust provides memory safety without garbage collection, zero-cost abstractions, and predictable performance. Devscriptor leans on that with multi-threaded parsing (scaling to num_cpus), memory-mapped file reading, a pure-Rust ONNX embedding engine (tract) with a RAM- and core-aware auto-tuner, batched WAL-mode SQLite transactions, and content-hash caches that skip redundant work. The result is a fast, low-overhead engine that stays responsive on large codebases while keeping strong safety guarantees.',
    category: 'Technical',
  },
  {
    question: 'What is Rusta?',
    answer: 'Rusta is a coding agent for the terminal, built in Rust for Kimi, GLM and DeepSeek models — and any OpenAI-compatible endpoint, such as one serving their open weights. It speaks each vendor’s API natively: preserved reasoning, where the effort setting goes, sampling and output budgets, each as that vendor wants them. It finds Devscriptor on your PATH and registers its 75 tools with no configuration. It is a separate download, under the same license, the GNU GPL v3.0; see the Rusta page.',
    category: 'Rusta',
  },
  {
    question: 'Do I need Rusta to use Devscriptor?',
    answer: 'No. Devscriptor works with any MCP client — Claude Desktop, Claude Code, Cursor, Cline and others. Rusta is one such client, built to use it well, and Rusta works without Devscriptor too.',
    category: 'Rusta',
  },
  {
    question: 'Is Devscriptor free?',
    answer: 'Yes. Devscriptor and Rusta are free software under the GNU General Public License v3.0: free for personal, open-source and commercial use alike, with no license key, no account and no expiry. Pre-built archives for Linux (x86_64 and aarch64), macOS (Apple Silicon and Intel) and Windows (x86_64) are on GitHub Releases — download, extract and run — or build them from source.',
    category: 'General',
  },
  {
    question: 'Can I use it at work, or commercially?',
    answer: 'Yes. The license places no conditions on running the tools — on company code, for paid client work, on as many machines as you like — or on changing them for your own use, and there are no seats to count. Its conditions apply when you pass copies on, changed or not: they go under the same license, with its text and their complete source. The License page sums it up.',
    category: 'General',
  },
  {
    question: 'Does the GPL apply to my own code?',
    answer: 'No. It covers Devscriptor and Rusta themselves, not the code you work on with them: the code Devscriptor indexes, the answers it gives and the code Rusta writes are not covered, since the license covers a program’s output only when, given its content, it is a covered work itself. Any MCP client, proprietary ones included, can use Devscriptor: running it asks nothing of you.',
    category: 'General',
  },
  {
    question: 'Is there a license key to install?',
    answer: 'No. There is nothing to activate and no phone-home: the release archives are built from the public source by GitHub Actions, and run the same on a laptop, in a dev container, or on a CI runner with no outbound internet.',
    category: 'General',
  },
]

const categories = Array.from(new Set(faqs.map(faq => faq.category)))

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              <HelpCircle className="w-3 h-3 mr-1" />
              FAQ
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Frequently Asked</span>
              <br />
              <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Answers to common questions about Devscriptor
            </p>
          </div>
        </div>
      </section>

      {/* FAQ by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            {categories.map((category) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {category}
                  </Badge>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {faqs
                    .filter((faq) => faq.category === category)
                    .map((faq, index) => (
                      <Card
                        key={index}
                        className="h-full bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-white leading-snug">
                            {faq.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-400 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
                <p className="text-slate-400 mb-6">
                  We&apos;re here to help. Reach out and we&apos;ll get back to you as soon as possible.
                </p>
                <a
                  href="mailto:contact@devscriptor.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  contact@devscriptor.com
                </a>
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
