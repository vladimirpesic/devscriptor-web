import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Lock,
  WifiOff,
  Cpu,
  Database,
  Zap,
  Eye,
  Radio,
  FileCheck2,
  Server,
  KeyRound,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Security & Privacy - Devscriptor',
  description: 'Privacy-first, local code analysis. Scanning, indexing, and search make no network calls. No telemetry, no dynamic SQLite extension loading, memory-safe Rust, and air-gapped-ready operation.',
}

const securityFeatures = [
  {
    icon: Lock,
    title: 'Local-First Analysis',
    description: 'Scanning, parsing, indexing, and search make no network calls. Your source code and embeddings never leave your machine — there is no Devscriptor backend.',
    details: [
      'FTS5 keyword and sqlite-vec search run locally',
      'Embeddings computed on-device via pure-Rust ONNX inference (tract)',
      'No cloud dependencies, no code upload',
      'Verify with: strace -e trace=network devscriptor scan',
    ],
    accent: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Zap,
    title: 'No Telemetry',
    description: 'No usage data is ever collected or transmitted. No analytics, no tracking, no phone-home — your usage patterns stay entirely private.',
    details: [
      'No telemetry collection',
      'No analytics or usage statistics',
      'Devscriptor never checks for updates or updates itself',
      'The VS Code extension looks for a newer release only when you run its command',
    ],
    accent: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: WifiOff,
    title: 'One-Time Model Download',
    description: 'The embedding model downloads the first time it is needed (from Hugging Face at a pinned commit, with the Devscriptor mirror on GitHub as a fallback), then runs fully offline. Pre-stage it for air-gapped machines.',
    details: [
      'Downloads ~160 MB once, then caches locally',
      'Every file checked against a pinned SHA-256',
      'Runs offline after the first fetch',
      'Pre-populate the cache for zero network access',
    ],
    accent: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: Database,
    title: 'No Dynamic Extension Loading',
    description: 'Devscriptor never loads a SQLite extension from disk. The dynamic-extension API is never enabled, so there is no extension attack surface at all — nothing to allow-list, nothing to verify at runtime.',
    details: [
      'sqlite-vec is a statically linked Rust crate',
      'Registered via sqlite3_auto_extension, before any connection opens',
      'FTS5 and JSON1 compiled into the bundled SQLite',
      'No enable_load_extension / dlopen anywhere in the codebase',
    ],
    accent: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Shield,
    title: 'Respects Your Secrets',
    description: 'Three independent filters decide what is opened at all: .gitignore, a built-in exclude list, and an extension allow-list. Devscriptor indexes only inside the path you point it at.',
    details: [
      'Native .gitignore support (ignore crate)',
      'Extension allow-list: SSH keys and credential files are never opened',
      'Built-in excludes: node_modules, target, .venv, dist, vendor…',
      'json/yaml/toml/xml are in the allow-list — exclude them if sensitive',
    ],
    accent: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Cpu,
    title: 'Memory-Safe Rust',
    description: 'Written in Rust for memory safety without garbage collection. Shipped code has sixteen unsafe blocks, each small, each listed with its reason in the security documentation.',
    details: [
      'Memory-mapped reads of large files, and the sqlite-vec FFI callback',
      'Platform memory queries, and process setup for servers it starts',
      'A zero-copy tensor read, and ASCII lowercasing in a search hot path',
      'Dependencies pinned in Cargo.lock; cargo audit runs in CI',
    ],
    accent: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Server,
    title: 'No Network Port',
    description: 'The agents of a workspace share one Devscriptor server, reached over a local socket — a named pipe on Windows — that only your user can use. Nothing listens on the network.',
    details: [
      'Unix socket in a directory only its user may enter (0700, socket 0600)',
      'The peer’s credentials must name the same user',
      'On Windows, a named pipe that refuses remote clients',
      'Language servers talk over stdin and stdout',
    ],
    accent: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: KeyRound,
    title: 'Nothing Runs Unasked',
    description: 'A cloned repository cannot make Devscriptor start programs: a project’s own devscriptor-lsp.toml is ignored until you trust its exact content, and language servers install only when you ask.',
    details: [
      'devscriptor lsp trust shows the servers a file would start first',
      'Editing the file withdraws the trust',
      'Installs only from lsp setup or lsp_arch_setup',
      'Every download checked against a pinned or published SHA-256',
    ],
    accent: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
  },
]

const egressMonitors = [
  {
    platform: 'Linux',
    tools: 'tcpdump · Wireshark · OpenSnitch · strace',
    cmd: `# watch every outbound packet, system-wide
sudo tcpdump -n -i any tcp or udp
# or trace the process's network syscalls directly
strace -f -e trace=network devscriptor scan .`,
  },
  {
    platform: 'macOS',
    tools: 'Little Snitch · LuLu · Wireshark · nettop',
    cmd: `# Little Snitch / LuLu prompt on ANY connection attempt.
# Or sniff the wire and watch per-process traffic:
sudo tcpdump -n -i any
nettop -p "$(pgrep -x devscriptor)"`,
  },
  {
    platform: 'Windows',
    tools: 'Wireshark · TCPView · GlassWire · Defender Firewall',
    cmd: `# Sysinternals TCPView lists every socket, live.
# Or list the process's connections in PowerShell:
Get-NetTCPConnection -OwningProcess (Get-Process devscriptor).Id`,
  },
]

const checksumVerify = [
  { platform: 'Linux', cmd: 'sha256sum -c devscriptor-<ver>-<target>.tar.gz.sha256' },
  { platform: 'macOS', cmd: 'shasum -a 256 -c devscriptor-<ver>-<target>.tar.gz.sha256' },
  {
    platform: 'Windows (PowerShell)',
    cmd: '(Get-FileHash -Algorithm SHA256 devscriptor-<ver>-<target>.zip).Hash.ToLower()\nGet-Content devscriptor-<ver>-<target>.zip.sha256   # the two hashes must match',
  },
]

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Security First
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">Your Code Never Leaves</span>
              <br />
              <span className="text-white">Your Machine</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Privacy-first, local processing. No telemetry, no cloud backend — built for private and
              proprietary codebases.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {securityFeatures.map((feature, index) => (
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

      {/* Prove it yourself — egress falsifiability */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                <Eye className="w-3 h-3 mr-1" />
                Don&apos;t trust us — verify it
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Point Wireshark at it. We&apos;ll wait.
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                A &ldquo;no telemetry&rdquo; claim is worth little on its own. Both tools are open
                source, so you can read every request they make — or simply watch the wire.
              </p>
            </div>

            <Card className="bg-slate-900/50 border-slate-800 mb-8">
              <CardContent className="p-6 sm:p-8 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  From the moment you install it, Devscriptor is{' '}
                  <span className="font-semibold text-white">dead to the outside world</span>. Scan, index,
                  search, embed — not a single byte leaves your machine. The only packets you will ever see are the{' '}
                  <span className="text-white">one-time embedding-model download</span> (pre-stage it and even that
                  disappears), the <span className="text-white">LSP-server installs you explicitly ask for</span>, and
                  the VS Code extension&apos;s update check when you run it. The language servers it starts are
                  programs of their own: some fetch a project&apos;s dependencies while loading it, as cargo and the
                  Go module proxy do. Everything else is silence.
                </p>
                <p>
                  The same holds for Rusta — except for the one thing it exists to do: talk to the model provider{' '}
                  <span className="text-white">you configured</span>. That is its model endpoint (the chats, and the
                  model list each model&apos;s limits come from); the provider&apos;s own web search and page reader
                  when the agent uses them — Kimi&apos;s, Z.AI&apos;s or DeepSeek&apos;s Search and Fetch APIs;
                  on the GLM Coding Plan, Z.AI&apos;s MCP servers (the vision server is fetched from npm by{' '}
                  <code className="text-slate-400">npx</code>); the MCP servers you add; and the pages the
                  agent&apos;s tools fetch while it works. No telemetry, no phone-home.
                </p>
                <p>
                  This is a promise we <span className="font-semibold text-white">cannot fake</span>. The source is
                  public, and a phone-home is trivial to catch — five minutes with any packet sniffer — and for
                  tools that live inside your private code, getting caught would be the end of us. That asymmetry <span className="text-white">is</span>{' '}
                  the guarantee: falsifiability beats a privacy policy. &ldquo;Point Wireshark at it, we&apos;ll
                  wait&rdquo; is a dare only an honest vendor can afford to make — so we&apos;re making it.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {egressMonitors.map((p) => (
                <Card key={p.platform} className="border-slate-800 bg-slate-950">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base text-white">
                      <Radio className="h-4 w-4 text-cyan-400" /> {p.platform}
                    </CardTitle>
                    <p className="text-xs text-slate-500">{p.tools}</p>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-emerald-400">
                      <code>{p.cmd}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-slate-500">
              Run any of these, then exercise both tools hard. Filter out your model provider and its services, the
              first-run model fetch and the pages the agent&apos;s tools fetch, and the capture stays empty.
            </p>
          </div>
        </div>
      </section>

      {/* Verify your download — checksums */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <FileCheck2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="mb-2 text-2xl font-bold text-white">Verify your download</h2>
                <p className="text-slate-400">
                  Every archive ships with a <code className="text-slate-300">.sha256</code> checksum file right
                  next to it. Confirm your download is byte-for-byte what we published before you run it — swap in
                  your exact filename. On Linux and macOS the <code className="text-slate-300">-c</code> flag checks
                  it for you and prints <code className="text-slate-300">OK</code>; on Windows, compare the two
                  printed hashes yourself.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {checksumVerify.map((c) => (
                <Card key={c.platform} className="border-slate-800 bg-slate-950">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white">{c.platform}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-emerald-400">
                      <code>{c.cmd}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Rusta archives are published the same way — every <code className="text-slate-400">.tar.gz</code> and{' '}
              <code className="text-slate-400">.zip</code> has a matching <code className="text-slate-400">.sha256</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Promise */}
      <section className="py-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900/50 border-emerald-500/30">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Privacy Promise</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Devscriptor is designed with privacy as the foundational principle. We believe your code is your intellectual property,
                  and it should never be shared with third parties. That&apos;s why scanning, indexing, and search run entirely on your
                  machine — with no telemetry, no analytics, and no cloud backend. The only network activity is the one-time
                  model download and the LSP installs you ask for, both of which can be pre-staged for fully air-gapped use,
                  and the extension&apos;s update check, which runs only when you ask for it.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    No Telemetry
                  </span>
                  <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    No Analytics
                  </span>
                  <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    100% Local
                  </span>
                  <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Air-gapped Ready
                  </span>
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
