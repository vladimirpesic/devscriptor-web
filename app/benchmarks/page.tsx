import { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { CodeBlock } from '@/components/code-block'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ARMS,
  BENCHMARK_ARCHIVE,
  FOLLOW_UPS,
  LANGUAGE_RESULTS,
  LEADERBOARD,
  LEFTOVER_READS,
  LOCATING,
  MODEL_RESULTS,
  MULTILINGUAL,
  OVERLAP,
  REQUEST_TOKENS,
  STANDING_ORDERS,
  TASK_PROMPT,
  WITHOUT_SENTENCE,
  type ArmResult,
  type BenchmarkModelId,
  type FollowUpRow,
  type ModelResult,
} from '@/lib/benchmarks'
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Columns2,
  Compass,
  Download,
  FileArchive,
  FlaskConical,
  GitBranch,
  Languages,
  ListChecks,
  Lock,
  Receipt,
  RefreshCw,
  Scale,
  Scissors,
  Server,
  Target,
  Trophy,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'SWE-bench Multilingual Results - Devscriptor',
  description:
    'Rusta with Devscriptor resolved 81.3% of SWE-bench Multilingual with DeepSeek V4.1-Flash, 78.7% with GLM-5.3 and 75.3% with Kimi K2.8 Preview: 300 real GitHub issues in nine languages, one attempt each, scored by the official harness. Run again with and without Devscriptor, DeepSeek resolved about as many tasks either way: why, and what Rusta 1.0.2 and Devscriptor 1.0.7 changed. Every prediction, report and trajectory is published.',
}

// The vendors' colours, as on the Rusta page.
const TONES: Record<BenchmarkModelId, { text: string; border: string; bg: string; bar: string }> = {
  deepseek: { text: 'text-blue-300', border: 'border-blue-500/20', bg: 'bg-blue-500/5', bar: 'bg-blue-400' },
  glm: { text: 'text-red-300', border: 'border-red-500/20', bg: 'bg-red-500/5', bar: 'bg-red-400' },
  kimi: { text: 'text-emerald-300', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', bar: 'bg-emerald-400' },
}

const pct = (part: number, whole: number, digits = 1) => `${((100 * part) / whole).toFixed(digits)}%`
const share = (fraction: number) => `${(100 * fraction).toFixed(1)}%`
const millions = (n: number) => {
  const digits = n >= 1e8 ? 0 : 1
  return `${(n / 1e6).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })} M`
}
const points = (tasks: number) => ((100 * tasks) / MULTILINGUAL.tasks).toFixed(1)

const byId = Object.fromEntries(MODEL_RESULTS.map((m) => [m.id, m])) as Record<BenchmarkModelId, ModelResult>

const thousands = (n: number) => n.toLocaleString('en-US')
const more = (value: number, base: number) => `${Math.round((100 * (value - base)) / base)}%`
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const word = (n: number) => WORDS[n] ?? String(n)
const ORDINALS = ['', 'first', 'second', 'third', 'fourth', 'fifth']
const ordinal = (n: number) => ORDINALS[n] ?? `${n}th`
const capitalized = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

// The two arms, how soon their runs found the code, and the calls the guidance asked for.
const ARM_WITH = ARMS.rows.find((r) => r.devscriptor) as ArmResult
const ARM_WITHOUT = ARMS.rows.find((r) => !r.devscriptor) as ArmResult
const ARM_MODEL = byId[ARMS.model]
const locate = (arm: ArmResult) => LOCATING.rows.find((r) => r.folder === arm.folder) as (typeof LOCATING.rows)[number]
const ORDERED_CALLS = STANDING_ORDERS.tools.reduce((sum, [, calls]) => sum + calls, 0)

// What Devscriptor adds to the first request, before and after Rusta 1.0.2 and Devscriptor 1.0.7.
const added = (setup: typeof REQUEST_TOKENS.before) => setup.total - REQUEST_TOKENS.without
const PARTS: { key: keyof typeof REQUEST_TOKENS.before.parts; label: string }[] = [
  { key: 'toolDefinitions', label: 'Its tool definitions' },
  { key: 'toolList', label: 'The list of its other tools' },
  { key: 'guidance', label: 'The guidance: Rusta’s and Devscriptor’s own' },
  { key: 'reminder', label: 'The reminder beside the first prompt' },
]

// The follow-ups: a fifth of the tasks, then those whose runs called the Context Graph.
const [LEAN, NOTES] = FOLLOW_UPS
const run = (followUp: (typeof FOLLOW_UPS)[number], folder: string) =>
  followUp.rows.find((r) => r.folder === folder) as FollowUpRow
const FOLLOW_UP_LABELS: Record<string, string> = {
  'without-devscriptor': 'Without Devscriptor',
  'with-devscriptor': `Rusta ${ARMS.rusta} · Devscriptor ${ARMS.devscriptor}`,
  'devscriptor-lean': 'Builds of Rusta 1.0.2 · Devscriptor 1.0.7',
  'devscriptor-notes': 'Rusta 1.0.2 · the Devscriptor build',
}

const RESCORE = `base=${BENCHMARK_ARCHIVE.url.slice(0, BENCHMARK_ARCHIVE.url.lastIndexOf('/'))}
curl -LO $base/${BENCHMARK_ARCHIVE.name}
curl -LO $base/${BENCHMARK_ARCHIVE.name}.sha256
sha256sum -c ${BENCHMARK_ARCHIVE.name}.sha256
tar -xzf ${BENCHMARK_ARCHIVE.name}
cd ${BENCHMARK_ARCHIVE.name.replace(/\.tar\.gz$/, '')}

# Docker must be running: each task is scored in its own image.
pip install swebench==${MULTILINGUAL.harness}
python -m swebench.harness.run_evaluation \\
  -d ${MULTILINGUAL.dataset} \\
  -p deepseek/all_preds.jsonl \\
  --max_workers 4 -id rusta-deepseek`

function SectionHeading({
  icon: Icon,
  badge,
  tone,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  badge: string
  tone: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="mb-12 text-center">
      <Badge className={`mb-4 ${tone}`}>
        <Icon className="mr-1 h-3 w-3" />
        {badge}
      </Badge>
      <h2 className="mb-4 text-3xl font-bold text-white">{title}</h2>
      <p className="mx-auto max-w-3xl text-lg text-slate-400">{children}</p>
    </div>
  )
}

function Bar({ value, className }: { value: number; className: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div className={`h-full rounded-full ${className}`} style={{ width: `${value}%` }} />
    </div>
  )
}

function ModelCard({ model }: { model: ModelResult }) {
  const tone = TONES[model.id]
  const facts: { label: string; value: ReactNode }[] = [
    { label: '95% interval', value: `${share(model.interval[0])} – ${share(model.interval[1])}` },
    {
      label: 'Time on a task',
      value: `${model.minutes.median.toFixed(1)} min median, ${model.minutes.mean.toFixed(1)} mean`,
    },
    { label: 'Model requests', value: `${model.steps.median} median` },
    {
      label: 'Tokens in',
      value: `${millions(model.tokens.input)}, ${pct(model.tokens.cached, model.tokens.input)} from cache`,
    },
    { label: 'Tokens out', value: millions(model.tokens.output) },
    { label: 'Cost', value: model.cost },
    { label: 'Used Devscriptor', value: `in ${model.devscriptor.runs} of ${model.tasks} runs` },
  ]
  return (
    <Card className={`border ${tone.border} ${tone.bg}`}>
      <CardHeader className="pb-4">
        <div className="text-sm text-slate-400">{model.vendor}</div>
        <CardTitle className={`text-xl ${tone.text}`}>{model.name}</CardTitle>
        <code className="text-xs text-slate-500">{model.modelId}</code>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="text-5xl font-bold text-white">{pct(model.resolved, model.tasks)}</div>
          <div className="mt-1 text-sm text-slate-400">
            {model.resolved} of {model.tasks} tasks resolved
          </div>
          <div className="mt-3">
            <Bar value={(100 * model.resolved) / model.tasks} className={tone.bar} />
          </div>
        </div>
        <dl className="space-y-2 text-sm">
          {facts.map((f) => (
            <div key={f.label} className="flex justify-between gap-4 border-t border-slate-800/60 pt-2">
              <dt className="text-slate-500">{f.label}</dt>
              <dd className="text-right text-slate-300">{f.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

function SetupCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: ReactNode
}) {
  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
            <Icon className="h-5 w-5 text-cyan-400" />
          </div>
          <CardTitle className="text-base text-white">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm leading-relaxed text-slate-400">{children}</CardContent>
    </Card>
  )
}

const ORDER: BenchmarkModelId[] = ['deepseek', 'glm', 'kimi']

export default function BenchmarksPage() {
  const best = (row: (typeof LANGUAGE_RESULTS)[number]) =>
    Math.max(...ORDER.map((id) => row.resolved[id]))

  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 border-cyan-500/30 bg-cyan-500/20 text-cyan-300">
              <Trophy className="mr-1 h-3 w-3" />
              Benchmark
            </Badge>
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              <span className="text-gradient">SWE-bench Multilingual</span>
              <br />
              <span className="text-white">Rusta + Devscriptor</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              {MULTILINGUAL.tasks} real GitHub issues from {MULTILINGUAL.repositories} repositories in{' '}
              {MULTILINGUAL.languages} languages. Rusta, with Devscriptor’s code intelligence, resolved{' '}
              {pct(byId.kimi.resolved, MULTILINGUAL.tasks)} to {pct(byId.deepseek.resolved, MULTILINGUAL.tasks)}{' '}
              of them with models from DeepSeek, Z.AI and Moonshot AI — one attempt per task, scored by
              the official SWE-bench harness.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              {[
                ['Tasks', `${MULTILINGUAL.tasks}, all of them`],
                ['Attempts', 'One per task (pass@1)'],
                ['Scoring', `swebench ${MULTILINGUAL.harness}`],
                ['Stack', `Rusta ${MULTILINGUAL.rusta} · Devscriptor ${MULTILINGUAL.devscriptor}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2">
                  <span className="text-slate-400">{label}:</span>
                  <span className="ml-2 font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-sm text-slate-400">
              Run again with and without Devscriptor, {ARM_MODEL.name} resolved about as many tasks
              either way.{' '}
              <a href="#devscriptor" className="text-cyan-400 hover:text-cyan-300">
                Why, and what Rusta {REQUEST_TOKENS.after.rusta} and Devscriptor{' '}
                {REQUEST_TOKENS.after.devscriptor} changed
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              icon={BarChart3}
              badge="Results"
              tone="border-cyan-500/30 bg-cyan-500/20 text-cyan-300"
              title="Three models, one stack"
            >
              Every model ran every task once, at reasoning effort {MULTILINGUAL.effort}, with the
              same prompt, the same tools and the same limits. A task counts as resolved when the
              harness finds that the tests written for its fix now pass, and that the tests that
              passed before still do.
            </SectionHeading>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {MODEL_RESULTS.map((m) => (
                <ModelCard key={m.id} model={m} />
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-slate-500">
              The interval is where the true rate lies with 95% confidence, given 300 tasks. A run
              that changed no file counts as unresolved: one for GLM and one for Kimi, on the same
              task. Tokens are summed over all 300 tasks.
            </p>
          </div>
        </div>
      </section>

      {/* By language */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              icon={Languages}
              badge="By language"
              tone="border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
              title="Where each model does well"
            >
              Go is the hardest for all three. DeepSeek has the best result in six of the eight
              rows, two of them shared with GLM; GLM leads in PHP and shares C++ with Kimi. The
              best result in each row is highlighted.
            </SectionHeading>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="p-3 font-semibold text-slate-500">Language</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Tasks</th>
                      {ORDER.map((id) => (
                        <th key={id} className={`p-3 text-right font-semibold ${TONES[id].text}`}>
                          {byId[id].name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LANGUAGE_RESULTS.map((row, i) => (
                      <tr key={row.language} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                        <td className="p-3 text-slate-300">{row.language}</td>
                        <td className="p-3 text-right text-slate-500">{row.tasks}</td>
                        {ORDER.map((id) => {
                          const resolved = row.resolved[id]
                          const top = resolved === best(row)
                          return (
                            <td
                              key={id}
                              className={`p-3 text-right ${top ? 'font-semibold text-white' : 'text-slate-400'}`}
                            >
                              {pct(resolved, row.tasks, 0)}
                              <span className="ml-2 text-xs text-slate-500">
                                {resolved}/{row.tasks}
                              </span>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-800 px-4 py-3 text-xs leading-relaxed text-slate-500">
                JavaScript and TypeScript share a row: several of their repositories hold both. With
                12 to 44 tasks a language, a difference of a few tasks is within chance.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { value: OVERLAP.all, label: 'tasks resolved by all three' },
                {
                  value: OVERLAP.any,
                  label: `by at least one (${pct(OVERLAP.any, MULTILINGUAL.tasks)})`,
                },
                { value: OVERLAP.none, label: 'by none of them' },
                {
                  value: OVERLAP.only.deepseek + OVERLAP.only.glm + OVERLAP.only.kimi,
                  label: `by one alone: DeepSeek ${OVERLAP.only.deepseek}, GLM ${OVERLAP.only.glm}, Kimi ${OVERLAP.only.kimi}`,
                },
              ].map((tile) => (
                <div key={tile.label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center">
                  <div className="text-3xl font-bold text-white">{tile.value}</div>
                  <div className="mt-1 text-sm text-slate-400">{tile.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Against the leaderboard */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              icon={Scale}
              badge="Context"
              tone="border-amber-500/30 bg-amber-500/20 text-amber-300"
              title="Next to the official leaderboard"
            >
              SWE-bench’s own leaderboard runs every model in the same minimal agent,{' '}
              {LEADERBOARD.agent}, so it compares models. This page measures one agent with one
              set of tools. The scale is the same; the setups are not.
            </SectionHeading>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white">Rusta + Devscriptor</CardTitle>
                    <p className="text-sm text-slate-500">
                      {MULTILINGUAL.runDates} · one attempt per task
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {MODEL_RESULTS.map((m) => (
                      <div key={m.id}>
                        <div className="mb-1 flex justify-between gap-4 text-sm">
                          <span className={TONES[m.id].text}>{m.name}</span>
                          <span className="font-semibold text-white">{pct(m.resolved, m.tasks)}</span>
                        </div>
                        <Bar value={(100 * m.resolved) / m.tasks} className={TONES[m.id].bar} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                    Why the two lists do not rank against each other
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400">
                    <li>
                      <span className="text-slate-300">Newer models.</span> None of the three models here
                      is on the leaderboard. The entries nearest to them are their predecessors: DeepSeek
                      V3.2, GLM 5 and Kimi K2.5.
                    </li>
                    <li>
                      <span className="text-slate-300">A different agent.</span> A full coding agent with
                      code intelligence is expected to do better than a minimal one with only a shell.
                      How much of the gap is Rusta or the newer models, these runs cannot tell apart;
                      for DeepSeek, Devscriptor’s share is measured{' '}
                      <a href="#devscriptor" className="text-cyan-400 hover:text-cyan-300">
                        below
                      </a>
                      .
                    </li>
                    <li>
                      <span className="text-slate-300">A generous budget.</span> Reasoning effort{' '}
                      {MULTILINGUAL.effort}, up to {MULTILINGUAL.maxSteps} model requests and{' '}
                      {MULTILINGUAL.hoursPerTask} hours of work per task, in an environment prepared so
                      that the project builds and its tests run offline.
                    </li>
                    <li>
                      <span className="text-slate-300">Not an official entry.</span> SWE-bench accepts
                      Multilingual submissions only from academic teams and research institutions with a
                      publication. These results are published here instead, with every file needed to
                      check them.
                    </li>
                  </ul>
                </div>
              </div>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white">Official leaderboard</CardTitle>
                  <p className="text-sm text-slate-500">
                    {LEADERBOARD.agent} · {LEADERBOARD.dated} · one attempt per task
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {LEADERBOARD.entries.map((e) => (
                    <div key={e.name}>
                      <div className="mb-1 flex justify-between gap-4 text-sm">
                        <span className="text-slate-300">
                          {e.name}
                          <span className="ml-2 text-xs text-slate-500">{e.org}</span>
                        </span>
                        <span className="text-slate-300">{e.resolved.toFixed(1)}%</span>
                      </div>
                      <Bar value={e.resolved} className="bg-slate-500" />
                    </div>
                  ))}
                  <p className="pt-2 text-xs text-slate-500">
                    From{' '}
                    <a href={LEADERBOARD.url} className="text-cyan-400 hover:text-cyan-300" target="_blank" rel="noopener noreferrer">
                      swebench.com
                    </a>
                    , Multilingual tab.
                  </p>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Setup */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              icon={FlaskConical}
              badge="Method"
              tone="border-blue-500/30 bg-blue-500/20 text-blue-300"
              title="How the runs were made"
            >
              Rusta ran inside each task’s own container, as a developer would work on the
              project, cut off from anything that could hold the answer.
            </SectionHeading>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SetupCard icon={Bot} title="The agent">
                <p>
                  Rusta {MULTILINGUAL.rusta}, headless, with every tool allowed except the web
                  tools, which were denied. Each run could make up to {MULTILINGUAL.maxSteps} model
                  requests and work for {MULTILINGUAL.hoursPerTask} hours; no run reached either
                  limit.
                </p>
                <p>
                  Devscriptor {MULTILINGUAL.devscriptor} was connected over MCP, with the task’s
                  repository indexed before the run began. The prompt asked the model to use it.
                </p>
              </SetupCard>
              <SetupCard icon={Lock} title="The environment">
                <p>
                  Each run started from the task’s own SWE-bench image, at the commit the issue was
                  reported against, with 2 CPUs and 8 GB of memory. Its only way out was an
                  allowlisting proxy that reached the model provider’s API and nothing else.
                </p>
                <p>
                  Before a run, the task’s build and test steps ran once on the unfixed code, so the
                  project built and its tests ran without the network. The tests written for the
                  fix were never in the environment.
                </p>
              </SetupCard>
              <SetupCard icon={GitBranch} title="No way to the fix">
                <p>
                  The repository’s git history was cut at the task’s base commit: every later
                  commit, branch and remote was removed and checked gone, so the upstream fix could
                  not be read from history. The model had no web access, and its prompt gave the
                  issue and general instructions: no hints, no test names.
                </p>
              </SetupCard>
              <SetupCard icon={ListChecks} title="The patch and its score">
                <p>
                  The patch is every change the agent made to the repository. Scoring used the
                  official harness, swebench {MULTILINGUAL.harness}, in the task’s original image,
                  and every patch was scored.
                </p>
                <p>
                  Files that the build step created and the agent then changed, such as a test
                  runner’s cache, were left out of the patch, since the scoring image lacks them.
                  This touched 3 PHP tasks for each model.
                </p>
              </SetupCard>
              <SetupCard icon={Target} title="One attempt per task">
                <p>
                  Each model ran each task once, and every result counts. A restart of the runner
                  interrupted 4 runs before they had made a patch. They started again from scratch;
                  none had been scored, so no result was picked from two.
                </p>
                <p>
                  An earlier smoke test ran 8 of the tasks with a prompt that did not mention
                  Devscriptor. Those tasks were run again with the final prompt, and only the new
                  results count. The earlier runs are compared below, and are in the archive.
                </p>
              </SetupCard>
              <SetupCard icon={AlertTriangle} title="The warm-up’s leftovers">
                <p>
                  The build-and-test step left its reports, caches and logs in the environment, such
                  as Maven’s surefire reports, PHPUnit’s result cache and, in the Go tasks, the
                  tests’ output in Go’s build cache. They name the existing tests that the scoring
                  runs, which hints at where the fix belongs.
                </p>
                <p>
                  Some runs named them in a tool call: DeepSeek {LEFTOVER_READS.deepseek.runs} (
                  {LEFTOVER_READS.deepseek.resolved} resolved), GLM {LEFTOVER_READS.glm.runs} (
                  {LEFTOVER_READS.glm.resolved}) and Kimi {LEFTOVER_READS.kimi.runs} (
                  {LEFTOVER_READS.kimi.resolved}), over {LEFTOVER_READS.tasks} tasks. Even if every
                  one of those resolutions came from the hint, the rates would fall by at most{' '}
                  {points(LEFTOVER_READS.deepseek.resolved)}, {points(LEFTOVER_READS.glm.resolved)}{' '}
                  and {points(LEFTOVER_READS.kimi.resolved)} percentage points.
                </p>
              </SetupCard>
            </div>

            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="border-b border-slate-800 px-4 py-3">
                <h3 className="text-sm font-semibold text-white">The prompt every run got</h3>
                <p className="mt-1 text-xs text-slate-500">
                  The task’s issue goes in place of @PROBLEM_STATEMENT@.
                </p>
              </div>
              <pre className="m-0 overflow-x-auto rounded-none rounded-b-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-300">
                <code>{TASK_PROMPT}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Devscriptor in the runs */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              icon={Server}
              badge="Devscriptor"
              tone="border-purple-500/30 bg-purple-500/20 text-purple-300"
              title="How the models used Devscriptor"
            >
              Most runs called Devscriptor, about twice a run. Across the three models, semantic
              search and the function search were the tools called most.
            </SectionHeading>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="p-3 font-semibold text-slate-500">Model</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Runs using it</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Calls</th>
                      <th className="p-3 font-semibold text-slate-500">Most-called tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODEL_RESULTS.map((m, i) => (
                      <tr key={m.id} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                        <td className={`p-3 ${TONES[m.id].text}`}>{m.name}</td>
                        <td className="p-3 text-right text-slate-300">
                          {m.devscriptor.runs} of {m.tasks}
                        </td>
                        <td className="p-3 text-right text-slate-300">
                          {m.devscriptor.calls}
                          <span className="ml-2 text-xs text-slate-500">
                            {(m.devscriptor.calls / m.tasks).toFixed(1)} a run
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400">
                          {m.devscriptor.tools
                            .slice(0, 3)
                            .map(([tool, count]) => `${tool} ${count}`)
                            .join(' · ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-800 px-4 py-3 text-xs leading-relaxed text-slate-500">
                Runs that called Devscriptor resolved{' '}
                {MODEL_RESULTS.map((m) => `${m.devscriptor.resolvedWith} of ${m.devscriptor.runs}`).join(', ')};
                the rest resolved{' '}
                {MODEL_RESULTS.map(
                  (m) => `${m.devscriptor.resolvedWithout} of ${m.tasks - m.devscriptor.runs}`,
                ).join(', ')}{' '}
                (DeepSeek, GLM, Kimi). The two groups are not alike: the runs without a Devscriptor
                call needed fewer model requests, which suggests easier tasks. Measuring what
                Devscriptor adds takes the same tasks run without it, which {ARM_MODEL.name} did:{' '}
                <a href="#devscriptor" className="text-cyan-400 hover:text-cyan-300">
                  see below
                </a>
                .
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="border-b border-slate-800 px-4 py-3">
                <h3 className="text-sm font-semibold text-white">Without the prompt’s sentence</h3>
                <p className="mt-1 text-xs text-slate-500">
                  The smoke test’s {WITHOUT_SENTENCE.tasks} tasks, one in each of eight languages,
                  run by the three models with Devscriptor {MULTILINGUAL.devscriptor}:{' '}
                  {WITHOUT_SENTENCE.runs} runs a row.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="p-3 font-semibold text-slate-500">Rusta</th>
                      <th className="p-3 font-semibold text-slate-500">Prompt</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Runs using it</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Calls</th>
                      <th className="p-3 font-semibold text-slate-500">DeepSeek · GLM · Kimi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WITHOUT_SENTENCE.rows.map((row, i) => (
                      <tr key={row.folder ?? 'full-run'} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                        <td className="p-3 text-white">{row.rusta}</td>
                        <td className="p-3 text-slate-300">
                          {row.sentence ? 'With the sentence (the full run)' : 'Without the sentence'}
                        </td>
                        <td className="p-3 text-right text-slate-300">
                          {row.using} of {WITHOUT_SENTENCE.runs}
                        </td>
                        <td className="p-3 text-right text-slate-300">{row.calls}</td>
                        <td className="p-3">
                          {MODEL_RESULTS.map((m, j) => (
                            <span key={m.id}>
                              {j > 0 && <span className="text-slate-600"> · </span>}
                              <span className={TONES[m.id].text}>{row.byModel[m.id].using}</span>
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-800 px-4 py-3 text-xs leading-relaxed text-slate-500">
                Rusta 1.0.0 loads every Devscriptor tool on demand, and without the sentence the
                models mostly searched with grep and read files instead, which is why the full run’s
                prompt has it. Rusta 1.0.1 takes its place: Devscriptor’s twelve most-used tools are
                in the tool table from the first request, and a reminder to start with them comes
                with the first prompt. The models then made about as many Devscriptor calls as with
                the sentence, in somewhat fewer runs. Eight tasks are too few to compare resolution
                rates; the archive holds these runs in full. Rusta {REQUEST_TOKENS.after.rusta} keeps{' '}
                {word(REQUEST_TOKENS.after.preloaded)} of them, for a smaller share of each request
                (below).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* With and without Devscriptor */}
      <section id="devscriptor" className="scroll-mt-20 border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              icon={Columns2}
              badge="With and without"
              tone="border-amber-500/30 bg-amber-500/20 text-amber-300"
              title="The same tasks without Devscriptor"
            >
              {ARM_MODEL.name} ran every task twice more, side by side: once with Devscriptor and
              once without it. Without it, the model resolved as many tasks, and spent less.
            </SectionHeading>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="p-3 font-semibold text-slate-500">Arm</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Resolved</th>
                      <th className="p-3 text-right font-semibold text-slate-500">95% interval</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Input tokens</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Cost</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Devscriptor calls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[ARM_WITH, ARM_WITHOUT].map((r, i) => (
                      <tr key={r.folder} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                        <td className="p-3 text-white">
                          {r.devscriptor ? `With Devscriptor ${ARMS.devscriptor}` : 'Without Devscriptor'}
                        </td>
                        <td className="p-3 text-right text-slate-300">
                          {pct(r.resolved, ARMS.tasks)}
                          <span className="ml-2 text-xs text-slate-500">
                            {r.resolved}/{ARMS.tasks}
                          </span>
                        </td>
                        <td className="p-3 text-right text-slate-400">
                          {share(r.interval[0])} – {share(r.interval[1])}
                        </td>
                        <td className="p-3 text-right text-slate-300">{millions(r.tokens.input)}</td>
                        <td className="p-3 text-right text-slate-300">${r.usd.toFixed(2)}</td>
                        <td className="p-3 text-right text-slate-300">
                          {r.devscriptor ? `${r.devscriptorCalls}, in ${r.devscriptorRuns} runs` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-800 px-4 py-3 text-xs leading-relaxed text-slate-500">
                Both arms resolved {ARMS.paired.both} tasks, and neither resolved {ARMS.paired.neither}.
                Of the {ARMS.paired.onlyWith + ARMS.paired.onlyWithout} tasks only one arm resolved,{' '}
                {ARMS.paired.onlyWith} went to the arm with Devscriptor and {ARMS.paired.onlyWithout} to
                the arm without it: a gap well within chance (exact McNemar test, p ={' '}
                {ARMS.paired.p.toFixed(2)}). With Devscriptor, the runs read{' '}
                {more(ARM_WITH.tokens.input, ARM_WITHOUT.tokens.input)} more input tokens and cost{' '}
                {more(ARM_WITH.usd, ARM_WITHOUT.usd)} more.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="p-3 font-semibold text-slate-500">Resolved by language</th>
                      {LANGUAGE_RESULTS.map((l) => (
                        <th key={l.language} className="p-3 text-right font-semibold text-slate-500">
                          {l.language === 'JavaScript / TypeScript' ? 'JS / TS' : l.language}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[ARM_WITH, ARM_WITHOUT].map((r, i) => (
                      <tr key={r.folder} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                        <td className="p-3 text-slate-300">{r.devscriptor ? 'With Devscriptor' : 'Without'}</td>
                        {r.byLanguage.map((n, j) => (
                          <td key={LANGUAGE_RESULTS[j].language} className="p-3 text-right text-slate-400">
                            {n}
                            <span className="text-xs text-slate-600">/{LANGUAGE_RESULTS[j].tasks}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <SetupCard icon={FlaskConical} title="How the arms ran">
                <p>
                  Both arms used Rusta {ARMS.rusta} and the same prompt, which does not mention
                  Devscriptor. The arm without it had no Devscriptor at all: not in its
                  configuration, not in its container. The model, its effort, the limits and the
                  environment were the full run’s, and both arms ran on {ARMS.runDates}.
                </p>
                <p>
                  Their images were warmed up without leftovers: after the build-and-test step, its
                  reports, caches and logs were removed, and the dependencies and builds kept.
                </p>
              </SetupCard>
              <SetupCard icon={Scale} title="What it shows">
                <p>
                  On these tasks, with this model, Devscriptor did not change how many issues were
                  resolved, and it made the runs cost more. The next section shows why.
                </p>
                <p>
                  Whether that holds for GLM and Kimi, which ran only with Devscriptor, these runs do
                  not show.
                </p>
              </SetupCard>
            </div>
          </div>
        </div>
      </section>

      {/* Why it did not pay off */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              icon={Compass}
              badge="Why"
              tone="border-rose-500/30 bg-rose-500/20 text-rose-300"
              title="Why Devscriptor did not pay off"
            >
              Three reasons, each measured in the arms’ runs.
            </SectionHeading>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <SetupCard icon={Compass} title="Finding the code was not the hard part">
                <p className="text-2xl font-bold text-white">
                  {capitalized(ordinal(locate(ARM_WITH).medianStep))} request, either way
                </p>
                <p>
                  The first model request whose tool calls named a source file the fix changes was
                  the{' '}
                  {locate(ARM_WITH).medianStep === locate(ARM_WITHOUT).medianStep
                    ? `${ordinal(locate(ARM_WITH).medianStep)} at the median, with Devscriptor and without it`
                    : `${ordinal(locate(ARM_WITH).medianStep)} at the median with Devscriptor, and the ${ordinal(locate(ARM_WITHOUT).medianStep)} without it`}
                  . By the third request,{' '}
                  {locate(ARM_WITH).byThird} of {ARMS.tasks} runs with it had named one, and{' '}
                  {locate(ARM_WITHOUT).byThird} without it, which searched with grep, ls and file
                  reads.
                </p>
                <p>
                  Only {LOCATING.issueNamesFile} of the {LOCATING.tasks} issues name such a file
                  themselves. Finding the code by meaning is what Devscriptor is best at; on these
                  tasks a plain search found it as soon.
                </p>
              </SetupCard>
              <SetupCard icon={ListChecks} title="Calls the guidance asked for, not the task">
                <p className="text-2xl font-bold text-white">
                  {pct(ORDERED_CALLS, STANDING_ORDERS.calls, 0)} of the calls
                </p>
                <p>
                  Of Devscriptor’s {STANDING_ORDERS.calls} calls, {ORDERED_CALLS} went where Rusta{' '}
                  {ARMS.rusta}’s guidance sent the model on every task: the index’s statistics before
                  anything else, and the Context Graph’s notes —{' '}
                  {STANDING_ORDERS.tools.map(([tool, calls]) => `${tool} ${calls}`).join(', ')}.
                </p>
                <p>
                  None of them could help: every run started with its index built, and with no note
                  in its Context Graph, since no earlier session had worked on the task.
                </p>
              </SetupCard>
              <SetupCard icon={Receipt} title="A cost on every request">
                <p className="text-2xl font-bold text-white">
                  +{thousands(added(REQUEST_TOKENS.before))} tokens a request
                </p>
                <p>
                  Devscriptor’s tool definitions, the list of its other tools and its guidance go with
                  every request. DeepSeek counted Rusta {ARMS.rusta}’s first request of a task:{' '}
                  {thousands(REQUEST_TOKENS.without)} tokens without Devscriptor,{' '}
                  {thousands(REQUEST_TOKENS.before.total)} with it,{' '}
                  {more(REQUEST_TOKENS.before.total, REQUEST_TOKENS.without)} more.
                </p>
                <p>
                  A run made {ARM_WITH.steps.median} requests at the median. Most of the extra input
                  came from the prompt cache, which is cheap, so the arm with Devscriptor read{' '}
                  {more(ARM_WITH.tokens.input, ARM_WITHOUT.tokens.input)} more input tokens and cost{' '}
                  {more(ARM_WITH.usd, ARM_WITHOUT.usd)} more.
                </p>
              </SetupCard>
            </div>
          </div>
        </div>
      </section>

      {/* What changed */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              icon={Scissors}
              badge={`Rusta ${REQUEST_TOKENS.after.rusta} · Devscriptor ${REQUEST_TOKENS.after.devscriptor}`}
              tone="border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
              title="Devscriptor costs less per request"
            >
              Rusta {REQUEST_TOKENS.after.rusta} and Devscriptor {REQUEST_TOKENS.after.devscriptor} cut
              Devscriptor’s share of every request from {thousands(added(REQUEST_TOKENS.before))} tokens
              to {thousands(added(REQUEST_TOKENS.after))}, and stop the calls no task asked for.
            </SectionHeading>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-300">
                    <li>
                      <span className="font-medium text-white">
                        {capitalized(word(REQUEST_TOKENS.after.preloaded))} tools are loaded up front
                        instead of {word(REQUEST_TOKENS.before.preloaded)}:
                      </span>{' '}
                      the searches by meaning and by name, a file’s summary, an entity’s details and a
                      symbol’s references. The others load with select_tools when a task needs one.
                    </li>
                    <li>
                      <span className="font-medium text-white">
                        The other tools are listed by the first clause of their description
                      </span>
                      , not the whole of it.
                    </li>
                    <li>
                      <span className="font-medium text-white">The guidance is shorter.</span>{' '}
                      Devscriptor’s answers now say when the workspace is not indexed (notice) and which
                      Context Graph notes match a search (context_notes). So the guidance no longer
                      asks for the index’s statistics first or for the notes on every task: the model
                      scans when an answer says to, and reads a note when a search lists it.
                    </li>
                    <li>
                      <span className="font-medium text-white">
                        Devscriptor’s tool descriptions are a third shorter:
                      </span>{' '}
                      how positions count is said once, in its instructions, instead of in each tool
                      that takes one.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-left">
                        <th className="p-3 font-semibold text-slate-500">Devscriptor’s share</th>
                        <th className="whitespace-nowrap p-3 text-right font-semibold text-slate-500">
                          {REQUEST_TOKENS.before.rusta} · {REQUEST_TOKENS.before.devscriptor}
                        </th>
                        <th className="whitespace-nowrap p-3 text-right font-semibold text-emerald-300">
                          {REQUEST_TOKENS.after.rusta} · {REQUEST_TOKENS.after.devscriptor}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {PARTS.map((part, i) => (
                        <tr key={part.key} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                          <td className="p-3 text-slate-300">{part.label}</td>
                          <td className="p-3 text-right text-slate-400">
                            {thousands(REQUEST_TOKENS.before.parts[part.key])}
                          </td>
                          <td className="p-3 text-right text-white">
                            {thousands(REQUEST_TOKENS.after.parts[part.key])}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-slate-800">
                        <td className="p-3 font-semibold text-white">Every request</td>
                        <td className="p-3 text-right text-slate-400">
                          +{thousands(added(REQUEST_TOKENS.before))}
                          <span className="ml-1 text-xs text-slate-500">
                            ({more(REQUEST_TOKENS.before.total, REQUEST_TOKENS.without)})
                          </span>
                        </td>
                        <td className="p-3 text-right font-semibold text-emerald-300">
                          +{thousands(added(REQUEST_TOKENS.after))}
                          <span className="ml-1 text-xs text-slate-500">
                            ({more(REQUEST_TOKENS.after.total, REQUEST_TOKENS.without)})
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="border-t border-slate-800 px-4 py-3 text-xs leading-relaxed text-slate-500">
                  Tokens of Rusta’s first request of a task, counted by DeepSeek, beyond the{' '}
                  {thousands(REQUEST_TOKENS.without)} of the same request without Devscriptor. Each
                  part is what the count lost when it was taken out. The requests and their counts
                  are in the archive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checked again */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              icon={RefreshCw}
              badge="Checked again"
              tone="border-cyan-500/30 bg-cyan-500/20 text-cyan-300"
              title="Every fifth task, run again"
            >
              On this sample, Devscriptor now costs about the same as running without it.
            </SectionHeading>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="p-3 font-semibold text-slate-500">{LEAN.tasks} tasks</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Resolved</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Requests</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Input tokens</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Cost, off-peak</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Devscriptor calls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEAN.rows.map((r, i) => {
                      const latest = i === LEAN.rows.length - 1
                      return (
                        <tr key={r.folder} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                          <td className={`p-3 ${latest ? 'font-semibold text-emerald-300' : 'text-white'}`}>
                            {FOLLOW_UP_LABELS[r.folder]}
                          </td>
                          <td className="p-3 text-right text-slate-300">
                            {r.resolved}/{LEAN.tasks}
                          </td>
                          <td className="p-3 text-right text-slate-300">{thousands(r.requests)}</td>
                          <td className="p-3 text-right text-slate-300">{millions(r.input)}</td>
                          <td className={`p-3 text-right ${latest ? 'font-semibold text-white' : 'text-slate-300'}`}>
                            ${r.usd.toFixed(3)}
                          </td>
                          <td className="p-3 text-right text-slate-300">{r.devscriptorCalls || '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-800 px-4 py-3 text-xs leading-relaxed text-slate-500">
                The last row ran on {LEAN.runDates}, with builds of the changes above; Devscriptor’s
                tools, descriptions and instructions in it are those 1.0.7 released. The other rows
                are the arms’ runs of the same tasks. Costs are at DeepSeek’s off-peak prices, since
                the runs were made at different hours. With less added to each request and{' '}
                {thousands(run(LEAN, 'without-devscriptor').requests - run(LEAN, 'devscriptor-lean').requests)}{' '}
                fewer requests, the runs read less input than those without Devscriptor. {LEAN.tasks}{' '}
                tasks are too few to compare the resolution rates.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="border-b border-slate-800 px-4 py-3">
                <h3 className="text-sm font-semibold text-white">The notes, only when a search lists them</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Those runs still called the Context Graph’s tools,{' '}
                  {run(LEAN, 'devscriptor-lean').contextGraphCalls} times, in the hope that an earlier
                  session had left notes. Rusta 1.0.2’s guidance sends the model to the notes only when
                  a search lists them in context_notes. The {NOTES.tasks} tasks whose runs had called
                  them ran again on {NOTES.runDates}.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="p-3 font-semibold text-slate-500">{NOTES.tasks} tasks</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Resolved</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Context Graph calls</th>
                      <th className="p-3 text-right font-semibold text-slate-500">Cost, off-peak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NOTES.rows.map((r, i) => {
                      const latest = i === NOTES.rows.length - 1
                      return (
                        <tr key={r.folder} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                          <td className={`p-3 ${latest ? 'font-semibold text-emerald-300' : 'text-white'}`}>
                            {FOLLOW_UP_LABELS[r.folder]}
                          </td>
                          <td className="p-3 text-right text-slate-300">
                            {r.resolved}/{NOTES.tasks}
                          </td>
                          <td className="p-3 text-right text-slate-300">
                            {r.folder === 'without-devscriptor' ? '—' : r.contextGraphCalls}
                          </td>
                          <td className={`p-3 text-right ${latest ? 'font-semibold text-white' : 'text-slate-300'}`}>
                            ${r.usd.toFixed(3)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-800 px-4 py-3 text-xs leading-relaxed text-slate-500">
                The last row ran Rusta 1.0.2 as released, with the same Devscriptor build. It resolved
                one task fewer: its patch made the fix’s test pass but broke
                three tests that had passed before, and neither of its Devscriptor calls failed.{' '}
                {capitalized(word(NOTES.tasks))} tasks, picked for their calls, are too few to compare
                the resolution rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What it shows */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              icon={Scale}
              badge="Reading the results"
              tone="border-rose-500/30 bg-rose-500/20 text-rose-300"
              title="What these results show, and what they do not"
            >
              A benchmark score is only as useful as the conditions behind it. These are the
              conditions.
            </SectionHeading>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  They show
                </h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
                  <li>
                    Rusta with Devscriptor resolves three quarters or more of SWE-bench Multilingual
                    in a single attempt, with models from three vendors.
                  </li>
                  <li>
                    The same agent and configuration resolve more than half of the tasks in every
                    language, for every model.
                  </li>
                  <li>
                    With {ARM_MODEL.name}, Devscriptor made no measurable difference to the share
                    resolved: {ARM_WITH.resolved} tasks with it and {ARM_WITHOUT.resolved} without it,
                    run side by side. It did not help find the code, and it cost more.
                  </li>
                  <li>
                    DeepSeek V4.1-Flash scored highest, for ${byId.deepseek.usd} for all{' '}
                    {MULTILINGUAL.tasks} tasks: under 5 cents a task, with{' '}
                    {pct(byId.deepseek.tokens.cached, byId.deepseek.tokens.input)} of its input read
                    from the prompt cache.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-500/15 bg-rose-500/5 p-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-rose-400">
                  They do not show
                </h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
                  <li>
                    What Devscriptor does for GLM and Kimi: only {ARM_MODEL.name} ran the tasks
                    without it.
                  </li>
                  <li>
                    Whether Rusta {REQUEST_TOKENS.after.rusta} and Devscriptor{' '}
                    {REQUEST_TOKENS.after.devscriptor} change the share resolved: {LEAN.tasks} tasks
                    are too few to tell.
                  </li>
                  <li>
                    A ranking against other agents, which would need the same models, budget and
                    environment on both sides.
                  </li>
                  <li>
                    Results free of what the models learned in training. The issues and their fixes
                    are public; at least one trajectory shows a model trying to recall the upstream
                    fix. With the history cut and the web closed, it could not look it up.
                  </li>
                  <li>
                    Rates finer than their intervals: each is uncertain by about 4 to 5 points.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data */}
      <section id="data" className="scroll-mt-20 border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              icon={FileArchive}
              badge="Data"
              tone="border-cyan-500/30 bg-cyan-500/20 text-cyan-300"
              title="Every file, to check for yourself"
            >
              The predictions, the harness’s reports and the full trajectories of all 900 runs,
              and of the {2 * ARMS.tasks + LEAN.tasks + NOTES.tasks} runs with and without
              Devscriptor, in one archive.
            </SectionHeading>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="space-y-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="break-all font-mono text-sm text-white">{BENCHMARK_ARCHIVE.name}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {BENCHMARK_ARCHIVE.sizeMb} MB ·{' '}
                      <a href={BENCHMARK_ARCHIVE.sha256Url} className="text-cyan-400 hover:text-cyan-300">
                        SHA-256
                      </a>
                    </div>
                  </div>
                  <a
                    href={BENCHMARK_ARCHIVE.url}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-400">
                  <li>
                    For each model: the predictions as the harness reads them, each task’s outcome,
                    and the harness’s files for each task it scored, including the full test output.
                  </li>
                  <li>
                    Each run’s trajectory: every message in order, with the model’s reasoning, its
                    tool calls and their results; and each run’s record of steps, tools, tokens and
                    time.
                  </li>
                  <li>The prompt and the Rusta configuration every run used.</li>
                  <li>
                    The smoke test’s runs without the prompt’s sentence, with Rusta 1.0.0 and 1.0.1,
                    laid out the same way, with the prompt each task got.
                  </li>
                  <li>
                    {ARM_MODEL.name}’s runs with and without Devscriptor and the two that checked
                    again, laid out the same way, with their prompt, their configurations, the clean
                    warm-up’s steps and a report of what they show.
                  </li>
                  <li>
                    Rusta’s first request of a task with and without Devscriptor, as sent, and
                    DeepSeek’s count of each and of Devscriptor’s parts.
                  </li>
                  <li>
                    In a few runs the agent printed its environment, which held the provider’s API
                    key. Each such key is replaced with [REDACTED]; nothing else is redacted.
                  </li>
                </ul>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-white">Score the predictions again</h3>
                  <CodeBlock code={RESCORE} language="bash" />
                </div>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-sm text-slate-500">
              Tasks from{' '}
              <a href={MULTILINGUAL.aboutUrl} className="text-cyan-400 hover:text-cyan-300" target="_blank" rel="noopener noreferrer">
                SWE-bench Multilingual
              </a>{' '}
              (
              <a href={MULTILINGUAL.datasetUrl} className="text-cyan-400 hover:text-cyan-300" target="_blank" rel="noopener noreferrer">
                {MULTILINGUAL.dataset}
              </a>
              ). Run {MULTILINGUAL.runDates}.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
