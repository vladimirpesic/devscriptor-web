import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Brain,
  Sparkles,
  FileText,
  Scale,
  Zap,
  AlertTriangle,
  Award,
  Lightbulb,
  BookOpen,
  FileCode,
  GitCommit,
  Link,
  Search,
  Database,
  Terminal,
  Archive,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Context Graph - Devscriptor',
  description:
    'Long-term memory for AI coding agents. Persist architectural decisions, standards, and knowledge across sessions with 9 note types, entity/concept links, and hybrid search — in the same local SQLite database.',
}

interface NoteType {
  icon: React.ComponentType<{ className?: string }>
  type: string
  title: string
  meaning: string
  accent: string
  bgColor: string
}

const noteTypes: NoteType[] = [
  { icon: FileText, type: 'adr', title: 'Architecture Decision Record', meaning: 'Capture a significant architectural decision and its rationale.', accent: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { icon: Scale, type: 'standard', title: 'Coding Standard', meaning: 'A coding convention or standard the codebase follows.', accent: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { icon: Zap, type: 'optimization', title: 'Optimization', meaning: 'Record a performance optimization and its impact.', accent: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { icon: AlertTriangle, type: 'failure', title: 'Failure', meaning: 'A failure or mistake worth remembering to avoid repeats.', accent: 'text-red-400', bgColor: 'bg-red-500/10' },
  { icon: Award, type: 'practice', title: 'Best Practice', meaning: 'Documented best-practice guidance for the project.', accent: 'text-violet-400', bgColor: 'bg-violet-500/10' },
  { icon: Lightbulb, type: 'reflection', title: 'Reflection', meaning: 'A reflection or retrospective on work done.', accent: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  { icon: BookOpen, type: 'general', title: 'General', meaning: 'General knowledge note — the default type.', accent: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
  { icon: FileCode, type: 'file_description', title: 'File Description', meaning: "A description of a file's contents and purpose.", accent: 'text-teal-400', bgColor: 'bg-teal-500/10' },
  { icon: GitCommit, type: 'modification', title: 'Modification', meaning: 'A record of a code modification.', accent: 'text-pink-400', bgColor: 'bg-pink-500/10' },
]

const noteFields = [
  { name: 'note_type', desc: 'One of the 9 types (default general)' },
  { name: 'title / content', desc: 'Required title and body' },
  { name: 'summary', desc: 'Optional short summary' },
  { name: 'author', desc: 'Defaults to agent' },
  { name: 'priority', desc: 'Integer 1–10 (default 5); higher ranks first' },
  { name: 'status', desc: 'active, superseded, or archived (new notes are active)' },
  { name: 'tags', desc: 'Optional list of strings' },
  { name: 'created_at / updated_at', desc: 'Timestamps, set automatically' },
  { name: 'effective_from / until', desc: 'Optional validity window' },
  { name: 'structured_data / metadata', desc: 'Optional JSON blobs' },
]

const keyFeatures = [
  {
    icon: Database,
    title: 'Same Local SQLite Database',
    description: 'Notes live in the same database as the code graph — persisting across sessions and processes, with no separate setup. This is what makes it long-term memory.',
  },
  {
    icon: Link,
    title: 'Linked to Code & Concepts',
    description: 'Attach a note to concrete entities (by type/name/file) or to abstract concepts and patterns, then recall "what do I know about this?" by association later.',
  },
  {
    icon: Search,
    title: 'Keyword, Semantic & Hybrid Search',
    description: 'search_context runs keyword, vector-semantic, or RRF-fused hybrid search, with optional note_type, status, and min_priority filters.',
  },
  {
    icon: Archive,
    title: 'Pruning, Previewed First',
    description: 'Pruning archives the active notes not updated within a window (90 days by default), and deletes those left archived for more than twice it; max_notes caps the active notes kept. prune_context only previews until you pass dry_run: false.',
  },
]

const mcpTools = [
  {
    name: 'add_context_note',
    description: 'Create a note, optionally linked to code entities and concepts.',
    example: `{
  "note_type": "adr",
  "title": "Use rustls instead of OpenSSL",
  "content": "All HTTPS goes through rustls...",
  "tags": ["tls", "dependencies"],
  "priority": 8,
  "related_entities": [
    { "entity_type": "function",
      "entity_name": "build_http_client",
      "file_path": "src/net.rs" }
  ]
}`,
  },
  {
    name: 'search_context',
    description: 'Keyword / semantic / hybrid search over notes, with filters.',
    example: `{
  "query": "auth token verification",
  "search_type": "hybrid",
  "note_type": "adr",
  "top_k": 5
}`,
  },
  {
    name: 'get_related_context',
    description: 'Retrieve notes linked to an entity type, optionally narrowed to one name and file.',
    example: `{
  "entity_type": "function",
  "entity_name": "verify_token",
  "file_path": "src/auth.rs"
}`,
  },
  {
    name: 'prune_context',
    description: 'Archive old and surplus notes and delete long-archived ones (a dry run by default).',
    example: `{
  "max_age_days": 180,
  "max_notes": 500,
  "dry_run": true
}`,
  },
  {
    name: 'get_context_statistics',
    description: 'Totals, counts by type, and average priority.',
    example: `{}`,
  },
]

const cliSubcommands = [
  { cmd: 'context add', desc: 'Add a note (--title, --content, --note-type, --entities, --entity-type)' },
  { cmd: 'context list', desc: 'List notes with pagination (--limit, --offset)' },
  { cmd: 'context search', desc: 'Keyword search, as search_context’s keyword strategy (--limit)' },
  { cmd: 'context show', desc: 'Show a single note by ID' },
  { cmd: 'context delete', desc: 'Delete a note by ID' },
  { cmd: 'context prune', desc: 'Archive notes not updated in N days, and delete those archived for twice that (--max-age-days, --dry-run)' },
  { cmd: 'context entity', desc: 'List notes linked to a given entity type' },
  { cmd: 'context concept', desc: 'List notes linked to a concept' },
]

function NoteTypeCard({ noteType }: { noteType: NoteType }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl ${noteType.bgColor} flex items-center justify-center flex-shrink-0`}>
            <noteType.icon className={`w-5 h-5 ${noteType.accent}`} />
          </div>
          <div className="min-w-0">
            <Badge className={`mb-2 ${noteType.bgColor} text-slate-300 border-slate-700 font-mono`}>
              {noteType.type}
            </Badge>
            <CardTitle className="text-base text-white">{noteType.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-400">{noteType.meaning}</p>
      </CardContent>
    </Card>
  )
}

function ToolCard({ tool }: { tool: { name: string; description: string; example: string } }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
            <Terminal className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm sm:text-base font-mono text-white break-all">
              {tool.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-400 mb-3">{tool.description}</p>
        <pre className="bg-slate-950 rounded-lg p-3 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
          <code>{tool.example}</code>
        </pre>
      </CardContent>
    </Card>
  )
}

export default function ContextGraphPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Brain className="w-3 h-3 mr-1" />
              AI Memory
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">Context Graph</span>
              <br />
              <span className="text-white">Long-Term Memory for AI Agents</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A persistent, queryable store of notes — decisions, standards, optimizations, reflections
              — that an agent records about a codebase and recalls in later sessions, linked to the code
              entities and concepts they describe.
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <Database className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Persistent Storage</h3>
                  <p className="text-slate-400">Knowledge survives across AI sessions in the same local database. No re-explaining project context.</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <Sparkles className="w-8 h-8 text-pink-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">9 Note Types</h3>
                  <p className="text-slate-400">Structured types with a shared schema keep documentation consistent and searchable.</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <Link className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Code Integration</h3>
                  <p className="text-slate-400">Notes link to entities and concepts, so an agent can retrieve what it knows about a function or module.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Note Types */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-pink-500/20 text-pink-300 border-pink-500/30">9 Note Types</Badge>
              <h2 className="text-3xl font-bold text-white mb-4">Structured Knowledge Capture</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Every note shares one schema and is tagged with a type, so context stays searchable and
                machine-readable.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noteTypes.map((noteType) => (
                <NoteTypeCard key={noteType.type} noteType={noteType} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Note Anatomy */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">Note Anatomy</Badge>
              <h2 className="text-3xl font-bold text-white mb-4">One Shared Schema</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Five tables hold the notes: the notes themselves, an FTS5 index, their entity and
                concept links, and their embeddings for semantic search — created automatically with
                the database.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {noteFields.map((field) => (
                <div key={field.name} className="flex items-start gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                  <code className="text-sm font-mono text-purple-300 flex-shrink-0">{field.name}</code>
                  <span className="text-sm text-slate-400">{field.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Key Features</Badge>
              <h2 className="text-3xl font-bold text-white mb-4">How Context Graph Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyFeatures.map((feature, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white mb-2">{feature.title}</CardTitle>
                        <p className="text-slate-400">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MCP Tools */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <Terminal className="w-3 h-3 mr-1" />
                MCP Tools
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">5 Context Graph Tools</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Five of Devscriptor&apos;s 32 core MCP tools manage the Context Graph.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mcpTools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLI */}
      <section className="py-16 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
                <Terminal className="w-3 h-3 mr-1" />
                CLI
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">devscriptor context</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                The same Context Graph is available from the command line.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cliSubcommands.map((sub) => (
                <div key={sub.cmd} className="flex flex-col gap-1 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                  <code className="text-sm font-mono text-emerald-400">devscriptor {sub.cmd}</code>
                  <span className="text-sm text-slate-400">{sub.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
