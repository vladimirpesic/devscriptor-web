import { Metadata } from 'next'
import { DownloadSection } from '@/components/download-section'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CURRENT_VERSION,
  RUSTA_VERSION,
  RELEASE_TARGETS,
  archiveName,
  linuxDownloadCommand,
  repoUrl,
  type ProductId,
} from '@/lib/github'
import { supportNav } from '@/lib/navigation'
import { LICENSE_BADGE, LICENSE_NAME, LICENSE_SUMMARY } from '@/lib/licensing'
import { PlatformLogo } from '@/components/platform-logo'
import {
  ShieldCheck,
  HardDrive,
  Sparkles,
  Bot,
  Database,
  ArrowDown,
  HandHeart,
  Heart,
  Github,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Download Devscriptor & Rusta',
  description: `Download Devscriptor ${CURRENT_VERSION} and Rusta ${RUSTA_VERSION} for Linux (x86_64/aarch64), macOS (Apple Silicon and Intel), and Windows (x86_64). Open source under the ${LICENSE_NAME} — self-contained binaries with no OpenSSL or extra packages; Linux glibc 2.17+, macOS 11+ or Windows 10+ is all you need.`,
}

const systemRequirements = [
  { label: 'RAM (scan)', value: 'No requirement — the structural scan never loads the embedding model' },
  { label: 'RAM (embed)', value: '4 GB free minimum, 8 GB recommended — the model takes about 1.3 GB while it runs' },
  { label: 'CPU', value: '2 cores minimum, 4+ recommended' },
  { label: 'Disk', value: '256 MB for the embedding model (512 MB recommended)' },
  { label: 'Linux', value: 'glibc 2.17 or newer (Ubuntu 14.04+, Debian 8+, RHEL/CentOS 7+), x86_64 or aarch64 — no OpenSSL, no C++ runtime, no extra packages' },
  { label: 'macOS', value: 'macOS 11 Big Sur or newer — Apple Silicon (aarch64) and Intel (x86_64)' },
  { label: 'Windows', value: 'Windows 10 / 11, 64-bit (x86_64)' },
]

const devscriptorSteps = [
  {
    n: 1,
    title: 'Scan your codebase',
    desc: 'The structural scan — keyword search and the entity and relationship graph are ready as soon as it finishes. No model is loaded.',
    code: 'devscriptor scan ./my-project',
  },
  {
    n: 2,
    title: 'Add semantic search (optional)',
    desc: 'Compute the vectors once. The model (~160 MB) downloads on first use — from Hugging Face, with the Devscriptor mirror as a fallback — and unloads when done. Needs about 4 GB of free RAM.',
    code: 'devscriptor embed',
  },
  {
    n: 3,
    title: 'Set up language servers (optional)',
    desc: 'Detect the project’s languages, find their servers on your system, and install the missing ones — after asking.',
    code: 'devscriptor lsp setup ./my-project',
  },
  {
    n: 4,
    title: 'Connect your AI agent',
    desc: 'Point Claude Desktop, Claude Code, Cursor or Cline at the devscriptor binary with args ["mcp"] for all 75 MCP tools over stdio. Rusta finds it on its own.',
    code: 'devscriptor mcp',
  },
]

const rustaSteps = [
  {
    n: 1,
    title: 'Pick a provider and paste a key',
    desc: 'init asks which provider you use — Kimi, GLM, DeepSeek or an OpenAI-compatible endpoint — and, for Kimi and GLM, which kind of key you hold: a Coding Plan subscription and pay-per-token credits are different keys for different endpoints. It verifies the key before saving anything.',
    code: 'rusta init',
  },
  {
    n: 2,
    title: 'Check your setup',
    desc: 'doctor reports the endpoint, the key and the model, every MCP server, and whether Devscriptor was found. For Kimi it names the Coding host that accepts the key; for GLM it checks the model against your plan; for DeepSeek it shows the models and the balance.',
    code: 'rusta doctor',
  },
  {
    n: 3,
    title: 'Run a prompt, or open the REPL',
    desc: 'Headless with -p for scripts and CI; without it, the interactive REPL. Defaults: kimi-for-coding (K2.8 Preview) on Kimi’s Coding Plan, glm-5.3 on GLM, deepseek-flash on DeepSeek.',
    code: 'rusta -p "Explain this repository"',
  },
]

function ManualInstall({ product }: { product: ProductId }) {
  const bin = product === 'devscriptor' ? 'devscriptor' : 'rusta'
  const linux = archiveName(product, RELEASE_TARGETS[0])
  const linuxFolder = linux.replace(/\.tar\.gz$/, '')
  const windows = archiveName(product, RELEASE_TARGETS[4])
  const windowsFolder = windows.replace(/\.zip$/, '')
  return (
    <>
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-white">
          <span className="flex items-center gap-1.5">
            <PlatformLogo platform="macos" className="h-4 w-4" />
            <PlatformLogo platform="linux" className="h-4 w-4" />
          </span>
          macOS &amp; Linux
        </h3>
        <pre className="mt-4 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-300 sm:text-sm">
          <code>{`# Example: Linux x86_64 (swap the target for your platform)
# Downloads the archive and its checksum.
${linuxDownloadCommand(product)}
# Verify integrity — must print "OK" (macOS: shasum -a 256 -c …):
sha256sum -c ${linux}.sha256
tar -xzf ${linux}
sudo mv ${linuxFolder}/${bin} /usr/local/bin/
${bin} --version`}</code>
        </pre>
        <p className="mt-3 text-xs text-slate-500">
          The macOS binaries are not signed: if Gatekeeper blocks the first launch, clear the
          quarantine flag with{' '}
          <code className="whitespace-normal break-words text-slate-400">
            xattr -d com.apple.quarantine /usr/local/bin/{bin}
          </code>
          . The Intel build also runs on Apple Silicon through Rosetta 2, but prefer the native one
          there.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-white">
          <PlatformLogo platform="windows" className="h-4 w-4" /> Windows (PowerShell)
        </h3>
        <pre className="mt-4 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-300 sm:text-sm">
          <code>{`# Verify integrity: the printed hash must match the .sha256 file
# published next to the archive.
(Get-FileHash -Algorithm SHA256 ${windows}).Hash.ToLower()
Get-Content ${windows}.sha256
# The .zip holds one folder containing ${bin}.exe.
Expand-Archive -Path ${windows} -DestinationPath "$env:LOCALAPPDATA\\Programs"
# Add that folder to your PATH for this session (System settings make it permanent):
$env:Path += ";$env:LOCALAPPDATA\\Programs\\${windowsFolder}"
${bin} --version`}</code>
        </pre>
      </div>
    </>
  )
}

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 border-emerald-500/30 bg-emerald-500/20 text-emerald-300">
              <Sparkles className="mr-1 h-3 w-3" />
              {LICENSE_BADGE}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Download the <span className="text-primary">Toolkit</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Two single-binary tools that work better together.{' '}
              <span className="text-white">Devscriptor</span> turns your codebase into a local
              knowledge graph; <span className="text-white">Rusta</span> is the coding agent that
              drives it. Download a release, or build either from source.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
              {LICENSE_SUMMARY}{' '}
              <a href="/terms/" className="text-slate-400 underline underline-offset-4 hover:text-white">
                License
              </a>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <span className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-slate-300">
                <PlatformLogo platform="linux" className="h-4 w-4" /> Linux x86_64 / aarch64
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-slate-300">
                <PlatformLogo platform="macos" className="h-4 w-4" /> macOS (Apple Silicon / Intel)
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-slate-300">
                <PlatformLogo platform="windows" className="h-4 w-4" /> Windows x86_64
              </span>
            </div>

            {/* Jump bar */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#devscriptor"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm font-medium text-blue-300 transition-colors hover:bg-blue-500/20"
              >
                <Database className="h-4 w-4" />
                Devscriptor {CURRENT_VERSION}
                <ArrowDown className="h-3.5 w-3.5" />
              </a>
              <a
                href="#rusta"
                className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
              >
                <Bot className="h-4 w-4" />
                Rusta {RUSTA_VERSION}
                <ArrowDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ DEVSCRIPTOR ══════════════════ */}
      <section id="devscriptor" className="scroll-mt-20 border-t border-slate-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <Database className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Devscriptor {CURRENT_VERSION}</h2>
              <p className="text-sm text-slate-400">
                Local code-intelligence engine · 26 languages · 75 MCP tools · 21 language servers
              </p>
            </div>
          </div>
          <DownloadSection variant="full" product="devscriptor" />
        </div>
      </section>

      {/* Devscriptor manual install */}
      <section className="border-t border-slate-800 bg-slate-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Install Devscriptor from the archive</h2>
              <p className="mt-2 text-sm text-slate-400">
                Every archive holds one folder with the license and a single executable —{' '}
                <code className="text-slate-300">devscriptor</code> — bundling the CLI, the
                language-server integration, the Context Graph and the MCP server. Agents start the
                server with <code className="text-slate-300">devscriptor mcp</code>.
              </p>
            </div>

            <ManualInstall product="devscriptor" />

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-6">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <Github className="h-4 w-4" /> Or build from source
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                With Rust 1.95 or newer and a C compiler (the tree-sitter grammars and the bundled
                SQLite are C):
              </p>
              <pre className="mt-3 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-300 sm:text-sm">
                <code>{`git clone ${repoUrl('devscriptor')}.git && cd devscriptor
cargo build --release -p devscriptor-cli       # target/release/devscriptor`}</code>
              </pre>
            </div>

            {/* First-time setup */}
            <div className="pt-4">
              <h3 className="mb-6 text-xl font-bold text-white">First-time setup</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {devscriptorSteps.map((step) => (
                  <Card key={step.n} className="border-slate-800 bg-slate-900/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 font-bold text-blue-400">
                          {step.n}
                        </div>
                        <CardTitle className="text-base text-white">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-400">{step.desc}</p>
                      <pre className="overflow-x-auto rounded bg-slate-950 p-3 text-xs text-emerald-400">
                        <code>{step.code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ RUSTA ══════════════════ */}
      <section id="rusta" className="scroll-mt-20 border-t border-slate-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <Bot className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Rusta {RUSTA_VERSION}</h2>
              <p className="text-sm text-slate-400">
                Coding agent for Kimi, GLM &amp; DeepSeek · auto-wires Devscriptor&apos;s 75 MCP tools ·{' '}
                <a href="/rusta/" className="text-amber-400 underline-offset-4 hover:underline">
                  learn more
                </a>
              </p>
            </div>
          </div>
          <DownloadSection variant="full" product="rusta" />
        </div>
      </section>

      {/* Rusta manual install */}
      <section className="border-t border-slate-800 bg-slate-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Install Rusta from the archive</h2>
              <p className="mt-2 text-sm text-slate-400">
                Every archive holds one folder with the license and a single executable —{' '}
                <code className="text-slate-300">rusta</code> — bundling the agent, the providers,
                the MCP client and the REPL. The terminal UI is a build option, not part of the
                release binaries.
              </p>
            </div>

            <ManualInstall product="rusta" />

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-6">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <Github className="h-4 w-4" /> Or build from source
              </h3>
              <p className="mt-2 text-sm text-slate-400">With Rust 1.88 or newer:</p>
              <pre className="mt-3 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-300 sm:text-sm">
                <code>{`git clone ${repoUrl('rusta')}.git && cd rusta
cargo build --release -p rusta-cli                  # target/release/rusta
cargo build --release -p rusta-cli --features tui   # with the terminal UI`}</code>
              </pre>
            </div>

            <div className="pt-4">
              <h3 className="mb-6 text-xl font-bold text-white">First run</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {rustaSteps.map((step) => (
                  <Card key={step.n} className="border-slate-800 bg-slate-900/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 font-bold text-amber-400">
                          {step.n}
                        </div>
                        <CardTitle className="text-base text-white">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-400">{step.desc}</p>
                      <pre className="overflow-x-auto rounded bg-slate-950 p-3 text-xs text-amber-400">
                        <code>{step.code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <Bot className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">Install Devscriptor first</span> and Rusta
                finds it — on <code className="text-slate-400">PATH</code>, in the usual install
                directories, or at <code className="text-slate-400">$DEVSCRIPTOR_BIN</code> — and
                registers its 75 MCP tools on startup, with no configuration and no trust prompt,
                since it comes from your own install. Confirm with{' '}
                <code className="text-slate-400">rusta doctor</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="border-t border-slate-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
              <HardDrive className="h-5 w-5 text-primary" /> System requirements
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              The resources are Devscriptor&apos;s optional embedding step&apos;s. Rusta itself is a
              lightweight client: it needs a network path to your model endpoint, or a local one.
              On the GLM Coding Plan, Z.AI&apos;s vision server, which describes images for a model
              that cannot see them, runs through <code className="text-slate-300">npx</code> and
              needs Node.js 22 or newer. Devscriptor&apos;s language servers need their own runtimes
              — Node.js, Java, .NET and so on — and{' '}
              <code className="text-slate-300">devscriptor lsp check &lt;server&gt;</code> names
              what one lacks.
            </p>
            <div className="mt-6 overflow-hidden rounded-lg border border-slate-800">
              {systemRequirements.map((req, i) => (
                <div
                  key={req.label}
                  className={`flex flex-col gap-1 p-4 sm:flex-row sm:gap-4 ${
                    i % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/40'
                  }`}
                >
                  <span className="w-full flex-shrink-0 text-sm font-medium text-slate-300 sm:w-40">
                    {req.label}
                  </span>
                  <span className="text-sm text-slate-400">{req.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <p className="text-sm text-slate-300">
                Devscriptor&apos;s scanning, indexing and search make no network calls. Its only
                outbound traffic is the one-time embedding-model download (Hugging Face, with the
                Devscriptor mirror as a fallback) and the language servers you ask it to install —
                both of which can be staged in advance for fully air-gapped use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support — at the end of the whole download and setup flow. Optional;
          grants nothing. */}
      <section className="border-t border-slate-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
                <HandHeart className="h-6 w-6 text-rose-400" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white">Enjoying the tools?</h2>
              <p className="mx-auto mb-6 max-w-xl text-slate-400">
                They are open source and stay that way. If they earn a place in your workflow and
                you&apos;d like to help fund the work, you can chip in — entirely optional, and it
                unlocks nothing you don&apos;t already have.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {supportNav.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-5 py-2.5 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/20"
                  >
                    <Heart className="h-4 w-4" />
                    {link.label}
                  </a>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Handled by Polar, the merchant of record. Nothing about your code is involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
