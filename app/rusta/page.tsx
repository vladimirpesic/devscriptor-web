import { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { DownloadSection } from '@/components/download-section'
import { VendorTabs, type VendorId } from '@/components/vendor-tabs'
import { RustaLogo } from '@/components/rusta-logo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RUSTA_VERSION, repoUrl } from '@/lib/github'
import { LICENSE_BADGE, LICENSE_SPDX, LICENSE_SUMMARY, RUSTA_NOT_AFFILIATED } from '@/lib/licensing'
import {
  AlertTriangle,
  Bot,
  Boxes,
  Brain,
  Cpu,
  Download,
  Gauge,
  GitBranch,
  Github,
  KeyRound,
  Layers,
  Lock,
  Network,
  Repeat,
  Ruler,
  Scissors,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Webhook,
  Workflow,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rusta — The Coding Agent Built for Kimi, GLM & DeepSeek',
  description:
    'Rusta is an open-source, native Rust coding agent for the terminal, built for Kimi (Moonshot AI), GLM (Z.AI) and DeepSeek models, with first-class Devscriptor code intelligence over MCP. Each request is shaped to what its endpoint documents.',
}

// ── Why a dedicated harness ──────────────────────────────────────────────────
const shimProblems = [
  {
    icon: Brain,
    title: 'Reasoning is thrown away every turn',
    generic:
      'A generic client drops the reasoning a model streamed once the turn is over, so the model re-derives what it already worked out.',
    rusta:
      'Preserved Thinking replays each stored reasoning block unchanged — what Kimi and GLM ask for, and what DeepSeek requires: a DeepSeek request that carries tools and drops the earlier reasoning fails with HTTP 400.',
  },
  {
    icon: Gauge,
    title: 'Reasoning effort goes where it is ignored — or refused',
    generic:
      'A generic client sends one top-level reasoning_effort to every model. Kimi Code reads the level inside the thinking object and answers an unknown one with HTTP 400; GLM-5.3 runs at max, its costliest level, when the field is missing; each vendor has a ladder of its own.',
    rusta:
      'Rusta sends effort where each model reads it — thinking.effort on Kimi Code, a top-level reasoning_effort on Kimi’s platform K3 series, GLM-5.2 and newer, and DeepSeek — folded onto the levels the model lists, and never a value the endpoint would refuse.',
  },
  {
    icon: Ruler,
    title: 'Sampling is sent where it is fixed',
    generic:
      'A generic client sends a temperature and a top-p. Every model Kimi serves fixes both and answers any other value with HTTP 400; DeepSeek ignores the temperature while it thinks.',
    rusta:
      'Rusta never sends sampling to Kimi — a configured value is dropped, with a warning — clamps GLM’s to the ranges Z.AI documents, and adds no temperature for DeepSeek.',
  },
  {
    icon: Scissors,
    title: 'The output budget is left to the endpoint',
    generic:
      'A generic client sends no max_tokens. DeepSeek’s default is then 8K without thinking and 64K with it, which cuts a long reasoning reply short.',
    rusta:
      'Rusta always sends DeepSeek an explicit cap — the room the window has left, up to 256K — and compacts a DeepSeek conversation before it eats into that room.',
  },
]

// ── Preserved Thinking, per vendor ───────────────────────────────────────────
const preservedThinking = [
  { field: 'Wire field', kimi: 'thinking.keep', glm: 'thinking.clear_thinking', deepseek: 'reasoning_content, echoed in the history' },
  { field: 'Enabled', kimi: '"all"', glm: 'false', deepseek: 'always, on requests that carry tools' },
  { field: 'Disabled', kimi: 'field omitted', glm: 'true', deepseek: '—' },
  {
    field: 'Sent to',
    kimi: 'kimi-for-coding*, the Kimi Code k ids, kimi-k2.6 and newer',
    glm: 'every thinking model',
    deepseek: 'every model',
  },
  { field: 'Default when unset', kimi: 'on, whenever thinking is on', glm: 'the endpoint decides', deepseek: 'replayed' },
]

// ── The harness ──────────────────────────────────────────────────────────────
const harness = [
  {
    icon: GitBranch,
    title: 'Concurrent tool calls',
    desc: 'The calls of one step whose resource accesses do not conflict — two reads of one file, edits of different files — run concurrently, and their results keep the order of the calls. Identical calls in one step run once.',
  },
  {
    icon: Layers,
    title: 'Progressive tool disclosure',
    desc: 'A large MCP server does not flood the tool table. A server with more than ten tools is deferred: announced by name and description, and loaded with select_tools when the model needs it — except the tools its preload list keeps in the table, which the model holds from the first request. deferred = true/false on a server, or default_deferred under [mcp], overrides the rule.',
  },
  {
    icon: Brain,
    title: 'Compaction that summarizes',
    desc: 'Past 90 % of the model’s window — 786,432 tokens on DeepSeek, which keeps 256K for output — the model writes a handoff summary: goals and constraints, decisions, commands run and files changed, what is still unknown, and the plan. Your oldest and most recent messages stay verbatim, with the live todo list and a pointer to the replaced lines in the records. A context overrun the provider reports, Z.AI’s 1261 included, takes the same path.',
  },
  {
    icon: Repeat,
    title: 'Repeated-call guard',
    desc: 'A tool call repeated across steps draws a reminder at 3, 5 and 8 in a row, and on repeats interleaved with other calls; twelve in a row stop the turn. repeat_breaker = false turns both off.',
  },
  {
    icon: Gauge,
    title: 'Turns that hand the work back',
    desc: 'max_turns (--max-turns, RUSTA_MAX_TURNS; default 100) caps a turn’s model round-trips. When it, or the repeated-call guard, stops a turn, the model gets one more step, with tools refused, to say what it completed, what is blocked and what comes next. The result carries a stop_reason.',
  },
  {
    icon: Network,
    title: 'Sub-agents and swarms',
    desc: 'agent delegates to a sub-agent, and agent_swarm runs many at once — only when you ask for delegation, and swarms only in swarm mode, which you turn on. Delegation nests one level unless max_subagent_depth raises it. Each sub-agent keeps an agent_id and its records, so one that stopped, failed or ran past its deadline can be resumed.',
  },
  {
    icon: Boxes,
    title: 'Profiles and a model pool',
    desc: 'Four profiles are built in — explore and plan (read-only), coder and default — and YAML profiles add your own. Declare [subagent.models] and the delegation tools gain a model parameter, so a file-locating sub-agent runs on a small fast model while the session stays on the flagship. An unknown alias fails the call rather than billing the flagship.',
  },
  {
    icon: GitBranch,
    title: 'Forking a sub-agent',
    desc: 'agent takes fork: true: the sub-agent starts from a one-time snapshot of the calling conversation, with its instructions, tools and model, so its first request repeats the caller’s prefix and hits the prompt cache. The agent call that created it is answered as “still executing when you were spawned; outcome unknown”, not left dangling.',
  },
  {
    icon: Lock,
    title: 'Write safety',
    desc: 'write_file overwrites only a file this agent has read and that has not changed on disk since — judged on length, modification time and a content digest, since the first two miss an equal-length rewrite inside one clock tick. edit_file needs its old_string to match exactly once. Creating a file needs no read.',
  },
  {
    icon: ShieldCheck,
    title: 'Permissions and guardrails',
    desc: 'Three modes — default, accept_edits, bypass_permissions — and ordered rules, the first match winning; a compound shell command is matched per segment. Writes to secrets (.env*, .ssh/, *.key, *.pem, …) and git push, reset, rebase, checkout -f and clean -f ask in every mode, --yes included. No command, hook or MCP server Rusta starts sees the variables it reads its API keys from.',
  },
  {
    icon: AlertTriangle,
    title: 'Dangerous-command guard',
    desc: 'In the default and accept_edits modes, bash asks before rm -rf, shutdown, mkfs, wipefs, dd to a device and the like — checked across the whole chain, sudo, sh -c, eval and command substitutions included — and before a command whose name is known only at run time. rm -rf on literal /tmp paths is exempt.',
  },
  {
    icon: KeyRound,
    title: 'Workspace trust',
    desc: 'A cloned repository’s .rusta.toml cannot start MCP servers, redirect requests or your key, loosen permissions or reach outside the folder until you trust it, and cannot declare hooks at all. An interactive session lists those settings and asks; a headless run leaves them out and says so. rusta trust trusts a folder ahead of time.',
  },
  {
    icon: Workflow,
    title: 'Plan mode, reviewed by you',
    desc: 'Only you turn plan mode on — /plan, --plan, or plan = true. The agent researches and writes a plan, and every edit waits until you approve the plan in exit_plan_mode’s review, in every permission mode. A headless --yes run has nobody to review it: plan = true from the config is not applied there, and an explicit --plan ends the run with the plan unapproved and nothing edited.',
  },
  {
    icon: Boxes,
    title: 'Background work and scheduling',
    desc: 'Background commands and sub-agents outlive the step that started them: task_list, task_output and task_stop manage them, and wait_for blocks inside the turn until one finishes. cron_create schedules a prompt, re-injected into this session when it is idle.',
  },
  {
    icon: Scissors,
    title: 'Bounded tool output',
    desc: 'No single result floods the context: each is capped at 50,000 characters, with the full output saved to a spill file the model can read. read_file returns 100,000 characters a call by default, with the exact offset to continue from, and images are downsampled to 256 KiB and 2000 px.',
  },
  {
    icon: Webhook,
    title: 'Hooks',
    desc: 'Run your own commands on session, turn and tool events — PreToolUse, UserPromptSubmit and Stop can block. Hooks live in your own config only, and fail open, so a broken script never blocks work.',
  },
  {
    icon: Sparkles,
    title: 'Web content stays data',
    desc: 'fetch refuses loopback, private, link-local and cloud-metadata addresses, checked after DNS resolution and on every redirect. A fetched page cannot pose as the harness: the system-reminder tags in web results are escaped, and the model is told web content is untrusted data.',
  },
  {
    icon: Terminal,
    title: 'Headless, REPL and sessions',
    desc: 'Headless (-p) for scripts and CI, with --stream-json events, and an interactive REPL; a terminal UI builds with --features tui. Sessions are JSONL records, written by one process at a time: --resume continues one, rusta fork copies one, and rusta export packs one into a ZIP archive.',
  },
]

// ── Built-in tools (26; pinned by builtin_tools_snapshot.rs) ─────────────────
const builtinTools = [
  { category: 'Filesystem', tools: ['read_file', 'write_file', 'edit_file', 'list_dir', 'glob', 'grep'] },
  { category: 'Execution', tools: ['bash'] },
  { category: 'Web', tools: ['fetch', 'web_search'] },
  { category: 'Planning', tools: ['todo_list', 'exit_plan_mode'] },
  { category: 'Delegation', tools: ['agent', 'agent_swarm'] },
  { category: 'Background work', tools: ['task_list', 'task_output', 'task_stop', 'wait_for'] },
  { category: 'Scheduling', tools: ['cron_create', 'cron_list', 'cron_delete'] },
  { category: 'Goals', tools: ['create_goal', 'get_goal'] },
  { category: 'Interaction', tools: ['ask_user', 'ask_user_question'] },
  { category: 'Media', tools: ['read_media'] },
  { category: 'Tool disclosure', tools: ['select_tools'] },
]

// ── Every provider ───────────────────────────────────────────────────────────
const endpointTable = [
  { provider: 'kimi', billing: 'subscription', isDefault: true, model: 'kimi-for-coding', baseUrl: 'https://api.kimi.com/coding/v1' },
  { provider: 'kimi', billing: 'api', isDefault: false, model: 'kimi-k3.1-pro', baseUrl: 'https://api.moonshot.ai/v1' },
  { provider: 'glm (zai)', billing: 'subscription', isDefault: true, model: 'glm-5.3', baseUrl: 'https://api.z.ai/api/coding/paas/v4' },
  { provider: 'glm (zai)', billing: 'api', isDefault: false, model: 'glm-5.3', baseUrl: 'https://api.z.ai/api/paas/v4' },
  { provider: 'deepseek', billing: '—', isDefault: false, model: 'deepseek-flash', baseUrl: 'https://api.deepseek.com' },
  { provider: 'openai', billing: '—', isDefault: false, model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1' },
]

// ── Vendor panels ────────────────────────────────────────────────────────────
interface Tone {
  text: string
  border: string
  bg: string
  code: string
}

const TONES: Record<VendorId, Tone> = {
  kimi: { text: 'text-emerald-300', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', code: 'text-emerald-300' },
  glm: { text: 'text-red-300', border: 'border-red-500/20', bg: 'bg-red-500/5', code: 'text-red-300' },
  deepseek: { text: 'text-blue-300', border: 'border-blue-500/20', bg: 'bg-blue-500/5', code: 'text-blue-300' },
}

interface Table {
  title: string
  note?: string
  head: string[]
  rows: string[][]
}

interface Vendor {
  id: VendorId
  name: string
  summary: ReactNode
  facts: { label: string; value: ReactNode }[]
  tables: Table[]
  features: { title: string; body: ReactNode }[]
  transcript: { title: string; text: string }
  openWeights: ReactNode
}

const code = (s: string) => <code className="text-slate-300">{s}</code>

const hfLink = (repo: string) => (
  <a
    href={`https://huggingface.co/${repo}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-300 underline-offset-4 hover:underline"
  >
    {repo}
  </a>
)

const vendors: Vendor[] = [
  // ── Kimi ──
  {
    id: 'kimi',
    name: 'Kimi (Moonshot AI)',
    summary: (
      <>
        <code className="text-slate-300">--provider kimi</code>, the default. Kimi sells its models
        twice — a Coding Plan subscription and pay-per-token credits — at separate doors, and names
        them differently at each: the billing picks the door, and with it the model.
      </>
    ),
    facts: [
      { label: 'API key', value: code('KIMI_API_KEY') },
      { label: 'Model override', value: <>{code('--model')} · {code('KIMI_MODEL_NAME')}</> },
      {
        label: 'Keys from',
        value: (
          <>
            {code('kimi.com/code/console')} (Coding Plan) · {code('platform.kimi.ai/console/api-keys')}{' '}
            (pay-per-token)
          </>
        ),
      },
    ],
    tables: [
      {
        title: 'Endpoints',
        head: ['--billing', 'Default model', 'Base URL'],
        rows: [
          ['subscription (default)', 'kimi-for-coding', 'https://api.kimi.com/coding/v1, or https://api.kimi.ai/coding/v1 for kimi.ai accounts'],
          ['api', 'kimi-k3.1-pro', 'https://api.moonshot.ai/v1, or https://api.moonshot.cn/v1 with --region china'],
        ],
      },
      {
        title: 'Coding Plan models',
        note: 'kimi-for-coding is the Coding Plan’s name for Kimi’s current coding model, upgraded in place. Rusta defaults to it: every plan that includes coding runs it with a 1M window, while k3 and k3.1-pro get 1M only from Pro.',
        head: ['Model id', 'Model', 'Context', 'Input', 'Effort (default)', 'Plans'],
        rows: [
          ['kimi-for-coding', 'K2.8 Preview', '1,048,576', 'image, video', 'low / high / max (max)', 'Plus and above'],
          ['kimi-for-coding-highspeed', 'K2.7 Code Highspeed: ~6× speed, ~3× quota', '262,144', 'image, video', 'none; always thinks', 'Pro and above'],
          ['k3', 'K3', '1,048,576 from Pro, 262,144 on Plus', 'image, video', 'low / high / max (high)', 'Plus and above'],
          ['k3-256k', 'K3, about half k3’s quota', '262,144', 'image', 'low / high / max (high)', 'Plus and above'],
          ['k3.1-pro', 'K3.1 Pro', '1,048,576 from Pro, 262,144 on Plus', 'image, video', 'low / high / max (high)', 'Plus and above'],
          ['k3.1-pro-highspeed', 'K3.1 Pro Highspeed: ~2–3× speed, ~2× quota', '1,048,576', 'image, video', 'low / high / max (high)', 'Pro and above'],
        ],
      },
      {
        title: 'Pay-per-token models',
        note: 'kimi-k3.1-pro, Kimi’s flagship, which the platform unlocks after a top-up of at least $1. All of them take images; video goes through Kimi’s Files API, which Rusta uses on the Kimi Code endpoints only.',
        head: ['Model id', 'Context', 'Thinking', 'Effort (default)', 'Dynamic tools'],
        rows: [
          ['kimi-k3.1-pro', '1,048,576', 'always', 'low / high / max (max)', 'yes'],
          ['kimi-k3.1-pro-highspeed', '1,048,576', 'always', 'low / high / max (max)', 'yes'],
          ['kimi-k3', '1,048,576', 'always', 'low / high / max (max)', 'yes'],
          ['kimi-k2.7-code', '262,144', 'always', 'none', 'no'],
          ['kimi-k2.7-code-highspeed', '262,144', 'always', 'none', 'no'],
          ['kimi-k2.6', '262,144', 'on request', 'none', 'no'],
        ],
      },
      {
        title: 'Reasoning effort',
        note: 'Sent only to models that list effort levels: inside the thinking object as thinking.effort on Kimi Code, where Kimi validates it, and as a top-level reasoning_effort, with no thinking object, on the platform’s K3 series. A model without the mapped level gets the nearest one it has.',
        head: ['You pass', 'Kimi receives'],
        rows: [
          ['ultra, max, xhigh', 'max'],
          ['high, medium', 'high'],
          ['low, minimum, minimal, light', 'low'],
          ['off, none, disabled', 'thinking off, or the lowest effort where it cannot be turned off'],
          ['unset or unrecognized', 'nothing, so the model default applies (Kimi answers an unknown effort with HTTP 400)'],
        ],
      },
    ],
    features: [
      {
        title: 'Two Coding hosts, one key',
        body: (
          <>
            The Coding Plan has two hosts — {code('api.kimi.com')} for kimi.com accounts,{' '}
            {code('api.kimi.ai')} for kimi.ai accounts — and each refuses the other’s keys with the
            same invalid_authentication_error a mistyped key gets. {code('rusta init')} asks both and
            pins the one that accepts the key; an unpinned run whose key is refused tries the other
            host once; {code('rusta doctor')} names the host. A refusal that names a plan limit — no
            K3 access, K3 past 256K, no HighSpeed — is reported as it is.
          </>
        ),
      },
      {
        title: 'The live model list',
        body: (
          <>
            Each model’s window, image and video input, thinking and effort levels come from the
            endpoint’s {code('GET /models')}, cached per host for a day in {code('~/.cache/rusta/')}{' '}
            and refreshed in the background, so a new model or a changed window needs no Rusta
            release. {code('/provider refresh')} fetches it at once; the tables above are the
            fallback for a machine that has never reached the endpoint. {code('/model')} lists the
            models with Kimi’s names ({code('kimi-for-coding — K2.8 Preview')}).
          </>
        ),
      },
      {
        title: 'Thinking off, where it can be',
        body: (
          <>
            kimi-for-coding, kimi-for-coding-highspeed, k3, k3-256k and kimi-k2.6 get{' '}
            {code('thinking: {"type": "disabled"}')} (Kimi Code serves the first four with K2.8
            Preview, without thinking). K3.1 Pro answers disabled with HTTP 400, the platform’s K3
            series has no off switch, and kimi-k2.7-code’s thinking cannot be disabled: these run at
            their lowest effort instead, as Kimi advises for K3.1 Pro.
          </>
        ),
      },
      {
        title: 'Sampling left to Kimi',
        body: (
          <>
            Every model Kimi serves fixes its temperature (1.0; 0.6 for kimi-k2.6 without thinking)
            and its top-p (0.95), and answers any other value with HTTP 400. So the Kimi provider
            sends neither: a configured {code('temperature')} or {code('top_p')} is dropped, with a
            warning once per run.
          </>
        ),
      },
      {
        title: 'Prompt cache, kept warm',
        body: (
          <>
            Every request carries a {code('prompt_cache_key')} — the session id, or a per-run id.
            The platform bills each cache write for its K3 series once, for five minutes by default
            or an hour at twice the write price: an interactive session asks for {code('1h')}, since
            its turns wait on you, and a headless run takes {code('5m')}; {code('--prompt-cache-ttl')}{' '}
            chooses. Kimi Code and the K2 models bill no writes. Changing effort mid-session
            invalidates the cache, so pick one per session.
          </>
        ),
      },
      {
        title: 'Tools loaded mid-session',
        body: (
          <>
            Models whose list marks dynamic tools — kimi-for-coding, the k ids and the platform’s K3
            series — take a tool loaded with {code('select_tools')} on a system message, so the
            request’s tool list, and the cached prefix with it, stays unchanged. Kimi’s own{' '}
            {code('$web_search')} built-in is offered too, and passed through as Kimi’s{' '}
            {code('builtin_function')}.
          </>
        ),
      },
      {
        title: 'Schemas Moonshot accepts',
        body: (
          <>
            Moonshot’s validator is stricter than OpenAI’s, and realistic MCP tool schemas bounce.
            Rusta rewrites each one before it is sent: local {code('$ref')}s dereferenced, circular
            references kept, unreferenced definitions dropped, missing types filled in, and{' '}
            {code('enum')}/{code('const')} conflicts with {code('type')} repaired.
          </>
        ),
      },
      {
        title: 'Confirmed model switches',
        body: (
          <>
            On the Coding Plan, {code('/model <id>')} confirms the switches Kimi asks to confirm — to
            K3.1 inside a session begun on another model, which lowers output quality and cache
            hits, and to K3.1 Pro Highspeed, at about twice K3.1 Pro’s quota. Kimi serves the rules
            itself. In a session that has begun, the reply offers {code('/new')}, {code('/compact')},
            or the same command again; in a new one the switch is made at once, with Kimi’s note.
          </>
        ),
      },
      {
        title: 'Kimi Code’s own services',
        body: (
          <>
            With the same key: {code('/search')} and {code('/fetch')} back {code('web_search')},{' '}
            {code('$web_search')} and {code('web_reader')} (the page comes back as Markdown; if the
            fetch fails, Rusta fetches the page itself), {code('/tools')} writes session titles, and{' '}
            {code('/files')} takes images and video by reference — uploaded once, referenced as{' '}
            {code('ms://<id>')} afterwards, and uploaded again if Kimi no longer has it. A transient
            402 “Unable to verify membership benefits” is retried, as Kimi documents.
          </>
        ),
      },
    ],
    transcript: {
      title: 'rusta init, with a Kimi Coding Plan key',
      text: `$ rusta init

  Rusta setup

  Which provider?
    1) Kimi   (Moonshot)  — kimi-for-coding / K2.8 Preview, 1M context
    2) GLM    (z.ai)      — glm-5.3, 1M context
    3) DeepSeek           — deepseek-flash, 1M context, hybrid thinking, vision
    4) OpenAI-compatible endpoint
  Provider [1]: 1

  Which key do you have? (they are not interchangeable)
    1) Coding Plan subscription
    2) API credits (pay-per-token)
  Key type [1]: 1

  endpoint  https://api.kimi.com/coding/v1
  model     kimi-for-coding

  Create a key: https://www.kimi.com/code/console
  Paste your API key:
  checking… key accepted

  models on https://api.kimi.com/coding/v1:
    kimi-for-coding (K2.8 Preview), 1M context, image and video input, effort low/high/max (default max)
    kimi-for-coding-highspeed (K2.7 Code Highspeed), 256K context, image and video input
    k3 (K3), 1M context, image and video input, effort low/high/max (default high)
    k3-256k (K3-256k), 256K context, image input, effort low/high/max (default high)
    k3.1-pro (K3.1 Pro), 1M context, image and video input, effort low/high/max (default high)
    k3.1-pro-highspeed (K3.1 Pro Highspeed 2x Usage Cost), 1M context, image and video input, effort low/high/max (default high)

  saved to ~/.config/rusta/config.toml
  using kimi-for-coding on https://api.kimi.com/coding/v1`,
    },
    openWeights: (
      <>
        Kimi publishes open weights for K3, K2.7 Code and K2.6 ({hfLink('moonshotai/Kimi-K3')},{' '}
        {hfLink('moonshotai/Kimi-K2.7-Code')}, {hfLink('moonshotai/Kimi-K2.6')}). K3.1 Pro and the
        K2.8 Preview that kimi-for-coding serves have none.
      </>
    ),
  },

  // ── GLM ──
  {
    id: 'glm',
    name: 'GLM (Z.AI)',
    summary: (
      <>
        <code className="text-slate-300">--provider glm</code> (alias{' '}
        <code className="text-slate-300">zai</code>). Z.AI serves glm-5.3 at both of its doors — the
        Coding Plan and pay-per-token — so there the billing changes the URL, and which web tools
        the session gets.
      </>
    ),
    facts: [
      { label: 'API key', value: <>{code('ZAI_API_KEY')} · {code('RUSTA_ZAI_API_KEY')} for Z.AI’s own services</> },
      { label: 'Model override', value: <>{code('--model')} · {code('ZAI_MODEL_NAME')}</> },
      { label: 'Keys from', value: code('z.ai/manage-apikey/apikey-list') },
    ],
    tables: [
      {
        title: 'Endpoints',
        note: 'Z.AI takes a key at either endpoint and bills it by its type, so --billing must match the key. An older key made for an account with a Coding Plan is billed by the endpoint, so at the pay-per-token one it uses the account balance — error 1113, “Insufficient balance”, when there is none, which Rusta explains.',
        head: ['--billing', 'Default model', 'Base URL'],
        rows: [
          ['subscription (default)', 'glm-5.3', 'https://api.z.ai/api/coding/paas/v4, or https://open.bigmodel.cn/api/coding/paas/v4 with --region china'],
          ['api', 'glm-5.3', 'https://api.z.ai/api/paas/v4, or https://open.bigmodel.cn/api/paas/v4 with --region china'],
        ],
      },
      {
        title: 'Models',
        head: ['Model id', 'Context', 'Max output', 'Input', 'Effort (default)'],
        rows: [
          ['glm-5.3 (default)', '1,048,576', '131,072', 'text', 'low / high / max (max); always thinks'],
          ['glm-5.3-flash', '1,048,576', '131,072', 'image, video', 'low / high / max (max); always thinks'],
          ['glm-5.3-flashx', '—', '—', 'image', 'the faster GLM-5.3-Flash, pay-per-token only'],
        ],
        note: 'GLM’s vision line takes images: glm-5.3-flash*, glm-5v-turbo, glm-4.6v* (128K) and glm-4.5v (64K). Every other GLM is text-only, and Z.AI refuses an image sent to one with error 1210.',
      },
      {
        title: 'What the Coding Plan answers',
        note: 'The Coding Plan serves two models; other ids still get an answer, often from another model. Rusta follows the model that actually answers — its window, thinking and effort — so on the plan glm-5.1 is a 1M-context GLM-5.3. The pay-per-token endpoint serves every id as itself.',
        head: ['Requested', 'On the Coding Plan'],
        rows: [
          ['glm-5.3, glm-5.3-flash', 'Served'],
          ['glm-5, glm-5.1, glm-5.2', 'Answered by glm-5.3'],
          ['glm-4.5, glm-4.5-air, glm-4.6, glm-4.7, glm-5-turbo', 'Answered by glm-5.3-flash'],
          ['glm-4.5-flash, glm-4.7-flash, glm-4.6v, glm-4.6v-flash, glm-4.5v', 'Served under their own names, but undocumented'],
          ['glm-5v-turbo, glm-5.3-flashx', 'Refused with 1311'],
          ['glm-4.5-x, glm-4.5-airx, glm-4.7-flashx, glm-4.6v-flashx, glm-4-32b-0414-128k', 'Refused with 1113: billed per token, outside the plan'],
        ],
      },
      {
        title: 'Z.AI’s hosted MCP servers',
        note: 'Connected with a Coding Plan key on the platform that issued it — api.z.ai, or open.bigmodel.cn with --region china. Z.AI serves them to Coding Plan keys only. The search, reader and Zread servers only read, so Rusta marks them read-only and the explore and plan sub-agents get their tools.',
        head: ['Server', 'Tools', 'Loaded'],
        rows: [
          ['zai_web_search', 'web_search_prime', 'Always'],
          ['zai_web_reader', 'webReader', 'Always'],
          ['zai_zread', 'search_doc, get_repo_structure, read_file — for public GitHub repositories', 'On demand, with select_tools'],
          ['zai_vision', 'analyze_image and specialised image tools; analyze_video (MP4, MOV, M4V up to 8 MB)', 'Only for a model that cannot see'],
        ],
      },
    ],
    features: [
      {
        title: 'GLM-5.3 always thinks',
        body: (
          <>
            Z.AI rejects {code('thinking: {type: "disabled"}')} for GLM-5.3, so Rusta never sends it
            there: {code('thinking = false')} and {code('--reasoning-effort none')} become{' '}
            {code('reasoning_effort: "low"')}, as Z.AI’s migration guide prescribes, rather than a
            failed request.
          </>
        ),
      },
      {
        title: 'Three rungs, nothing dropped',
        body: (
          <>
            GLM-5.3 serves {code('low')}, {code('high')} and {code('max')}. Rusta accepts the full
            seven-rung vocabulary and folds it onto those three: a dropped{' '}
            {code('reasoning_effort')} would fall back to max, the most expensive setting.
          </>
        ),
      },
      {
        title: 'Streamed tool arguments',
        body: (
          <>
            {code('tool_stream: true')} goes on every streaming request that carries tools, for the
            glm-4.6, glm-4.7 and glm-5 lines Z.AI documents it for, so a long edit payload arrives as
            it is generated instead of in one stall at the end.
          </>
        ),
      },
      {
        title: 'Every rule version-gated',
        body: (
          <>
            Older GLM models keep the request body they document: {code('reasoning_effort')} goes to
            GLM-5.2 and newer only, and only while thinking is on. Sampling is clamped to Z.AI’s
            ranges — temperature 0.0–1.0, top-p 0.01–1.0.
          </>
        ),
      },
      {
        title: 'GLM-5.3-Flash sees',
        body: (
          <>
            glm-5.3-flash is GLM-5.3 with image and video input. Images go out as {code('data:')}{' '}
            URLs in PNG, JPEG or WebP — GIF and BMP are converted first, since Z.AI reads only a
            GIF’s first frame and refuses BMP — and video goes inline. Z.AI checks images against
            the requested id, so a routed glm-4.7 still takes none.
          </>
        ),
      },
      {
        title: 'Plan-aware doctor',
        body: (
          <>
            {code('/model')} lists the two plan models. {code('rusta doctor')} checks the model
            against the Coding Plan — a warning for a routed or undocumented id, an error for a
            refused one — and the vision server’s key and platform; a 1311 error names the models
            to use instead.
          </>
        ),
      },
      {
        title: 'The vision server',
        body: (
          <>
            {code('zai_vision')} is {code('@z_ai/mcp-server')}, run with {code('npx')} (Node.js 22 or
            newer), with the key as {code('Z_AI_API_KEY')} and the platform as {code('Z_AI_MODE')}. It
            describes an image {code('read_media')} reads for a model without vision, and analyses
            video for one that cannot take it; it is not started when every GLM model the session
            runs reads images natively. {code('Z_AI_VISION_MCP_URL')} points it at a remote server.
          </>
        ),
      },
      {
        title: '128 tools a request',
        body: (
          <>
            Z.AI accepts at most 128 tools per request. The tool table is trimmed to fit, and{' '}
            {code('select_tools')} loads nothing past the cap, and says why.
          </>
        ),
      },
      {
        title: 'Web tools by plan',
        body: (
          <>
            On a Coding Plan, the hosted {code('zai_web_search')} and {code('zai_web_reader')}{' '}
            servers search and read. On pay-per-token, {code('web_search')} and {code('web_reader')}{' '}
            use Z.AI’s own {code('/web_search')} (engine {code('search-prime')}, or{' '}
            {code('search_pro')} on open.bigmodel.cn) and {code('/reader')}, which are paid per use.
          </>
        ),
      },
      {
        title: 'Reasoning on the Coding Plan',
        body: (
          <>
            The Coding Plan endpoint — Rusta’s default GLM base URL — preserves reasoning by default;
            the standard API endpoint does not. Leaving {code('thinking_keep')} unset lets the
            endpoint’s default stand. A session title on GLM-5.3, which cannot turn thinking off, is
            written at its lightest thinking.
          </>
        ),
      },
    ],
    transcript: {
      title: 'rusta init and rusta doctor, with a GLM Coding Plan key',
      text: `$ rusta init

  Rusta setup

  Which provider?
    1) Kimi   (Moonshot)  — kimi-for-coding / K2.8 Preview, 1M context
    2) GLM    (z.ai)      — glm-5.3, 1M context
    3) DeepSeek           — deepseek-flash, 1M context, hybrid thinking, vision
    4) OpenAI-compatible endpoint
  Provider [1]: 2

  Which key do you have? (they are not interchangeable)
    1) Coding Plan subscription
    2) API credits (pay-per-token)
  Key type [1]: 1

  Which region?
    1) Global
    2) Mainland China
  Region [1]: 1

  endpoint  https://api.z.ai/api/coding/paas/v4
  model     glm-5.3

  Create a key: https://z.ai/manage-apikey/apikey-list
  Paste your API key:
  checking… key accepted
  Z.AI accepts any key here and bills it by its type: for a Coding Plan subscription it must be a Personal Coding Plan (or Team Coding Plan) key, as z.ai's API Keys page lists it.

  saved to ~/.config/rusta/config.toml
  using glm-5.3 on https://api.z.ai/api/coding/paas/v4

$ rusta doctor
ok     provider: provider set to glm
ok     endpoint: https://api.z.ai/api/coding/paas/v4  (Coding Plan subscription, Global)
ok     api key: API key is configured
warn   model: no model configured; defaulting to glm-5.3
ok     glm plan: glm-5.3 on the GLM Coding Plan
ok     vision mcp: npx with Z_AI_API_KEY and Z_AI_MODE set
ok     permissions: using default permission mode
ok     records: records will be written to ~/.local/share/rusta/records/default.jsonl
ok     devscriptor: code intelligence available as \`devscriptor\`
ok     mcp servers: 5 connected (devscriptor, zai_web_search, zai_web_reader, zai_zread, zai_vision)

9 check(s) passed, 1 warning(s), 0 error(s)`,
    },
    openWeights: (
      <>
        Z.AI publishes open weights for GLM-5.3 and GLM-5.3-Flash ({hfLink('zai-org/GLM-5.3')},{' '}
        {hfLink('zai-org/GLM-5.3-Flash')}).
      </>
    ),
  },

  // ── DeepSeek ──
  {
    id: 'deepseek',
    name: 'DeepSeek',
    summary: (
      <>
        <code className="text-slate-300">--provider deepseek</code> speaks DeepSeek’s
        OpenAI-compatible API. DeepSeek has one pay-as-you-go door and no subscription, so{' '}
        <code className="text-slate-300">--billing</code> and{' '}
        <code className="text-slate-300">--region</code> do not apply — a{' '}
        <code className="text-slate-300">billing</code> value in the config is accepted and ignored.
      </>
    ),
    facts: [
      { label: 'API key', value: code('DEEPSEEK_API_KEY') },
      { label: 'Model override', value: <>{code('--model')} · {code('DEEPSEEK_MODEL_NAME')}</> },
      { label: 'Keys from', value: code('platform.deepseek.com/api_keys') },
    ],
    tables: [
      {
        title: 'Endpoint',
        head: ['--billing', 'Default model', 'Base URL'],
        rows: [['—', 'deepseek-flash', 'https://api.deepseek.com']],
      },
      {
        title: 'Models',
        note: 'What each model can do comes from DeepSeek’s live catalogue (GET /models): its window, its output ceiling, whether it takes images, and the effort levels its thinking accepts — cached for a day and refreshed in the background, or at once with /provider refresh. Until one is cached, this built-in table applies. Neither takes video; a model id neither lists is taken as text-only.',
        head: ['Model id', 'Model', 'Context', 'Max output', 'Input'],
        rows: [
          ['deepseek-flash (default)', 'V4.1-Flash, the model DeepSeek recommends: ahead of V4-Pro on its agentic-coding benchmarks, and cheaper and faster. DeepSeek’s legacy deepseek-v4-flash* names resolve to it', '1,048,576', '393,216', 'JPEG, PNG, GIF and WebP images, in user messages and tool results'],
          ['deepseek-v4-pro', 'V4-Pro, the previous generation', '1,048,576', '393,216', 'text only'],
        ],
      },
      {
        title: 'Reasoning effort',
        note: 'Thinking is on by default, toggled with a top-level thinking: {type: "enabled" | "disabled"}; the effort goes as a top-level reasoning_effort, mapped as DeepSeek documents. A level the model does not list folds onto the nearest one it does.',
        head: ['You pass', 'DeepSeek receives'],
        rows: [
          ['ultra, max', 'max'],
          ['high, medium, xhigh', 'high'],
          ['low, minimum, minimal, light', 'low'],
          ['none, off', 'thinking off, effort none'],
          ['unset or unrecognized', 'nothing, so the model default applies: high'],
        ],
      },
    ],
    features: [
      {
        title: 'High by default, max for hard work',
        body: (
          <>
            DeepSeek recommends {code('high')} for everyday agent work, and Rusta takes its default.
            For hard tasks and benchmarks, pass {code('--reasoning-effort max')} (or{' '}
            {code('reasoning_effort = "max"')}): it spends more output tokens, and the output room
            below is sized for it.
          </>
        ),
      },
      {
        title: 'An output cap that fits the reasoning',
        body: (
          <>
            DeepSeek’s own default cap is low — 8K without thinking, 64K with it, 128K at max — and
            its ceiling is 384K (393,216). Unless you set one, Rusta always sends{' '}
            {code('min(context window − input, 256K)')}; a {code('--max-tokens')} of your own may go
            up to the model’s ceiling.
          </>
        ),
      },
      {
        title: 'Compaction keeps 256K free',
        body: (
          <>
            A DeepSeek conversation is compacted once it passes 786,432 tokens of the 1M window,
            rather than at 90 %, so a long reasoning reply at max effort still fits.
          </>
        ),
      },
      {
        title: 'Reasoning echoed back',
        body: (
          <>
            Earlier turns’ {code('reasoning_content')} is sent back in the history: DeepSeek rejects
            a request that carries tools and drops it, with HTTP 400. No temperature is injected —
            DeepSeek ignores it while thinking is on, every current model’s default.
          </>
        ),
      },
      {
        title: 'Images follow the model',
        body: (
          <>
            On deepseek-flash, pasted images and {code('read_media')} results go inline as{' '}
            {code('data:')} URLs, at most 4096 px per side, since DeepSeek rejects larger images once
            a request carries 15 of them. deepseek-v4-pro takes none: an image it reads is described
            by deepseek-flash, with thinking off, on the same key, and an image already in the
            history is replaced with a note.
          </>
        ),
      },
      {
        title: 'Inline, not the Files API',
        body: (
          <>
            Uploading would keep your images on DeepSeek’s servers for days and add an id cache with
            expiry and a storage quota to manage, to save only bandwidth. The 20 MB per-request media
            budget keeps every request well under DeepSeek’s 48 MiB limit, and inline images reuse
            the prompt cache just as file ids would.
          </>
        ),
      },
      {
        title: 'DeepSeek’s Search and Fetch APIs',
        body: (
          <>
            {code('web_search')} uses DeepSeek’s Search API ({code('/v1/tools/search')}) and{' '}
            {code('web_reader')} its Fetch API ({code('/v1/tools/fetch')}), with the session’s key,
            paid per successful request. A search sends the turn’s prompt, on one line and cut to 128
            characters, as {code('ori_question')}; each result shows DeepSeek’s summary, cut at 800
            characters. A fetched page comes back as Markdown without the backslash DeepSeek puts
            before each punctuation mark; if the fetch fails, Rusta fetches the page itself.
          </>
        ),
      },
      {
        title: 'Errors that say what happened',
        body: (
          <>
            A 402 means the account’s balance is spent: it surfaces as a fatal “insufficient DeepSeek
            balance” error pointing at the top-up page, not as a retry. 429s and 5xx are retried, and
            so is a generation DeepSeek cut short ({code('insufficient_system_resource')},{' '}
            {code('aborted')}), with nothing of it kept and none of its tool calls run.
          </>
        ),
      },
      {
        title: 'doctor proves the key for free',
        body: (
          <>
            {code('rusta doctor')} proves the key with a {code('GET /models')} — no tokens spent —
            lists what each model can do, caches the catalogue, and shows the account’s balance per
            currency, as an error when DeepSeek says the account cannot make requests. Session titles
            are written by deepseek-flash with thinking off.
          </>
        ),
      },
    ],
    transcript: {
      title: 'rusta init and rusta doctor, with a DeepSeek key',
      text: `$ rusta init

  Rusta setup

  Which provider?
    1) Kimi   (Moonshot)  — kimi-for-coding / K2.8 Preview, 1M context
    2) GLM    (z.ai)      — glm-5.3, 1M context
    3) DeepSeek           — deepseek-flash, 1M context, hybrid thinking, vision
    4) OpenAI-compatible endpoint
  Provider [1]: 3

  endpoint  https://api.deepseek.com
  model     deepseek-flash

  Create a key: https://platform.deepseek.com/api_keys
  Paste your API key:
  checking… key accepted

  saved to ~/.config/rusta/config.toml
  using deepseek-flash on https://api.deepseek.com

$ rusta doctor
ok     provider: provider set to deepseek
ok     endpoint: https://api.deepseek.com
ok     api key: API key is configured
warn   model: no model configured; defaulting to deepseek-flash
ok     deepseek: https://api.deepseek.com accepts the key; 2 models:
         deepseek-flash (DeepSeek-V4.1-Flash), 1M context, 384K max output, image input, effort low/high/max (default high)
         deepseek-v4-pro (DeepSeek-V4-Pro), 1M context, 384K max output, effort low/high/max (default high)
ok     deepseek balance: … USD
ok     permissions: using default permission mode
ok     records: records will be written to ~/.local/share/rusta/records/default.jsonl
ok     devscriptor: code intelligence available as \`devscriptor\`
ok     mcp servers: 1 connected (devscriptor)

9 check(s) passed, 1 warning(s), 0 error(s)`,
    },
    openWeights: (
      <>
        DeepSeek publishes open weights for both models, under the MIT license (
        {hfLink('deepseek-ai/DeepSeek-V4.1-Flash')}, {hfLink('deepseek-ai/DeepSeek-V4-Pro')}).
      </>
    ),
  },
]

function DataTable({ table }: { table: Table }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50">
      <div className="border-b border-slate-800 px-4 py-3">
        <h4 className="text-sm font-semibold text-white">{table.title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              {table.head.map((h) => (
                <th key={h} className="whitespace-nowrap p-3 font-semibold text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={row[0]} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`p-3 align-top ${j === 0 ? 'font-mono text-slate-300' : 'text-slate-400'}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && (
        <p className="border-t border-slate-800 px-4 py-3 text-xs leading-relaxed text-slate-500">
          {table.note}
        </p>
      )}
    </div>
  )
}

function VendorPanel({ vendor }: { vendor: Vendor }) {
  const tone = TONES[vendor.id]
  return (
    <div className="space-y-8">
      <div className={`rounded-xl border ${tone.border} ${tone.bg} p-6`}>
        <h3 className={`mb-2 text-xl font-bold ${tone.text}`}>{vendor.name}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{vendor.summary}</p>
        <dl className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
          {vendor.facts.map((f) => (
            <div key={f.label}>
              <dt className="uppercase tracking-wider text-slate-500">{f.label}</dt>
              <dd className="mt-1 break-words text-slate-400">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-6">
        {vendor.tables.map((t) => (
          <DataTable key={t.title} table={t} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {vendor.features.map((f) => (
          <div key={f.title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h4 className={`mb-2 font-semibold ${tone.text}`}>{f.title}</h4>
            <p className="text-sm leading-relaxed text-slate-400">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-slate-500">{vendor.transcript.title}</span>
        </div>
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-400">
          <code>{vendor.transcript.text}</code>
        </pre>
      </div>

      <div className={`flex items-start gap-3 rounded-xl border ${tone.border} ${tone.bg} p-5`}>
        <Lock className={`mt-0.5 h-5 w-5 flex-shrink-0 ${tone.text}`} />
        <p className="text-sm text-slate-300">
          <span className="font-medium text-white">Open weights.</span> {vendor.openWeights}
        </p>
      </div>
    </div>
  )
}

export default function RustaPage() {
  const panels = Object.fromEntries(
    vendors.map((v) => [v.id, <VendorPanel key={v.id} vendor={v} />])
  ) as Record<VendorId, ReactNode>

  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <RustaLogo
              priority
              className="mx-auto mb-8 h-48 w-48 drop-shadow-[0_12px_32px_rgba(245,158,11,0.3)]"
            />
            <Badge className="mb-4 border-amber-500/30 bg-amber-500/20 text-amber-300">
              <Bot className="mr-1 h-3 w-3" />
              Rusta v{RUSTA_VERSION}
            </Badge>
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              <span className="text-white">The Coding Agent Built</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                for Kimi, GLM &amp; DeepSeek
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-400">
              A lean, native Rust coding agent for the terminal, built for Kimi (Moonshot AI), GLM
              (Z.AI) and DeepSeek models — with first-class Devscriptor code intelligence over MCP.
              Not another OpenAI-compatible shim: each request carries exactly the fields its
              endpoint documents.
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-3 text-sm">
              {[
                { icon: Cpu, label: 'Native Rust · one binary' },
                { icon: Brain, label: 'Preserved Thinking' },
                { icon: Sparkles, label: 'Live model catalogues' },
                { icon: Server, label: 'Devscriptor’s 75 MCP tools' },
                { icon: Github, label: `Open source · ${LICENSE_SPDX}` },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-slate-300"
                >
                  <chip.icon className="h-4 w-4 text-amber-400" />
                  {chip.label}
                </span>
              ))}
            </div>

            <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                <span className="ml-3 font-mono text-xs text-slate-500">terminal</span>
              </div>
              <div className="overflow-x-auto p-4 text-left font-mono text-xs sm:text-sm">
                <div className="text-slate-500"># Pick a provider, plan and key — verified, then saved</div>
                <div className="text-emerald-400">$ rusta init</div>
                <div className="mt-2 text-slate-500"># One headless prompt</div>
                <div className="text-amber-400">$ rusta -p &quot;Explain this repository&quot;</div>
                <div className="mt-2 text-slate-500"># Or the interactive REPL</div>
                <div className="text-amber-400">$ rusta</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── Rationale ───────────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <Badge className="mb-4 border-rose-500/30 bg-rose-500/20 text-rose-300">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Rationale
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white">
                Frontier models, lowest-common-denominator plumbing
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-slate-400">
                Kimi, GLM and DeepSeek are among the strongest coding models available — and most
                agents reach them through a generic OpenAI-compatible interface that quietly
                discards what each one was built around. Rusta speaks each vendor’s own contract.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {shimProblems.map((p) => (
                <Card key={p.title} className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
                        <p.icon className="h-5 w-5 text-rose-400" />
                      </div>
                      <CardTitle className="text-base text-white">{p.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-lg border border-rose-500/15 bg-rose-500/5 p-3">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-rose-400">
                        Generic client
                      </div>
                      <p className="text-sm text-slate-400">{p.generic}</p>
                    </div>
                    <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-3">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Rusta
                      </div>
                      <p className="text-sm text-slate-300">{p.rusta}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Providers: every one ───────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <Badge className="mb-4 border-cyan-500/30 bg-cyan-500/20 text-cyan-300">
                <Network className="mr-1 h-3 w-3" />
                Providers
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white">Four providers, one binary</h2>
              <p className="mx-auto max-w-3xl text-lg text-slate-400">
                Each provider has its own wire handling in <code className="text-slate-300">lm-bridge</code>.
                Out of the box you get each vendor’s current coding model;{' '}
                <code className="text-slate-300">--model</code> and{' '}
                <code className="text-slate-300">--base-url</code> override it, whatever the billing
                implies, and any other <code className="text-slate-300">--provider</code> is
                rejected at startup.
              </p>
            </div>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-left">
                        <th className="p-3 font-semibold text-slate-500">--provider</th>
                        <th className="p-3 font-semibold text-slate-500">--billing</th>
                        <th className="p-3 font-semibold text-slate-500">Default model</th>
                        <th className="p-3 font-semibold text-slate-500">Base URL</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {endpointTable.map((row, i) => (
                        <tr
                          key={`${row.provider}-${row.billing}`}
                          className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}
                        >
                          <td className="p-3 align-top text-slate-300">{row.provider}</td>
                          <td className="p-3 align-top text-slate-500">
                            {row.billing}
                            {row.isDefault && (
                              <span className="ml-1 font-sans text-[10px] uppercase tracking-wider text-emerald-500">
                                default
                              </span>
                            )}
                          </td>
                          <td className="p-3 align-top text-slate-300">{row.model}</td>
                          <td className="p-3 align-top text-slate-500">{row.baseUrl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
                  <KeyRound className="h-4 w-4 text-amber-400" />
                  Two keys that look identical
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Kimi and Z.AI sell the same models twice — a Coding Plan subscription and
                  pay-per-token credits — so <code className="text-slate-300">--billing</code> picks
                  the endpoint that takes your key. Kimi refuses the other plan’s key with an{' '}
                  <code className="text-rose-300">invalid_authentication_error</code> that reads like
                  a typo; Z.AI takes either and bills it by its type.{' '}
                  <code className="text-slate-300">--region china</code> selects the mainland
                  deployments. DeepSeek has one door.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
                  <Server className="h-4 w-4 text-emerald-400" />
                  Any OpenAI-compatible endpoint
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  <code className="text-slate-300">--provider openai</code> speaks any{' '}
                  <code className="text-slate-300">/chat/completions</code> endpoint — OpenAI itself,
                  a gateway, or a server of your own with <code className="text-slate-300">--base-url</code>.
                  It reads the reasoning dialect each endpoint uses (
                  <code className="text-slate-300">reasoning_content</code>,{' '}
                  <code className="text-slate-300">reasoning</code> as GPT-OSS and vLLM send it, or{' '}
                  <code className="text-slate-300">reasoning_details</code>) and echoes thinking back
                  under the same key.
                </p>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              <code className="text-slate-400">model</code>,{' '}
              <code className="text-slate-400">base_url</code> and{' '}
              <code className="text-slate-400">api_key</code> belong to the provider they were
              configured for: switching provider derives them again, rather than sending a Kimi key
              to Z.AI.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── The vendors, one tab each ───────────────── */}
      <section id="vendors" className="scroll-mt-20 border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-amber-500/30 bg-amber-500/20 text-amber-300">
              <Cpu className="mr-1 h-3 w-3" />
              Under the hood
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-white">
              What &ldquo;provider-native&rdquo; means, vendor by vendor
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-400">
              The endpoints, models, effort ladders, caching and services of each vendor, and how
              Rusta handles each of them. Pick a vendor.
            </p>
          </div>
          <VendorTabs panels={panels} />
        </div>
      </section>

      {/* ───────────────── Preserved Thinking ───────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <Badge className="mb-4 border-violet-500/30 bg-violet-500/20 text-violet-300">
                <Brain className="mr-1 h-3 w-3" />
                Signature feature
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white">Preserved Thinking</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Carry a turn&apos;s reasoning into the next request instead of discarding it. Rusta
                replays each stored reasoning block back to the provider unchanged, which is what the
                vendors require — and each spells it differently. Rusta translates.
              </p>
            </div>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="p-4 text-left font-semibold text-slate-500"> </th>
                        <th className="p-4 text-left font-semibold text-emerald-300">Kimi</th>
                        <th className="p-4 text-left font-semibold text-red-300">GLM (Z.AI)</th>
                        <th className="p-4 text-left font-semibold text-blue-300">DeepSeek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preservedThinking.map((row, i) => (
                        <tr key={row.field} className={i % 2 === 0 ? 'bg-slate-950/40' : undefined}>
                          <td className="p-4 font-medium text-slate-300">{row.field}</td>
                          <td className="p-4 font-mono text-xs text-slate-400 sm:text-sm">{row.kimi}</td>
                          <td className="p-4 font-mono text-xs text-slate-400 sm:text-sm">{row.glm}</td>
                          <td className="p-4 font-mono text-xs text-slate-400 sm:text-sm">{row.deepseek}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">Why it matters:</span> a reasoning model
                that loses its reasoning every turn re-derives the same conclusions on the next one —
                spending tokens and time to arrive back where it started. Precedence is{' '}
                <code className="text-slate-400">--thinking-keep</code> →{' '}
                <code className="text-slate-400">KIMI_MODEL_THINKING_KEEP</code> →{' '}
                <code className="text-slate-400">thinking_keep</code> in the config file → the
                model&apos;s own default. A Kimi model whose schema lacks the field never receives it,
                and the platform&apos;s K3 series always keeps its reasoning and takes no thinking
                object at all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Devscriptor integration ───────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <Badge className="mb-4 border-blue-500/30 bg-blue-500/20 text-blue-300">
                <Workflow className="mr-1 h-3 w-3" />
                Deep integration
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white">Devscriptor, wired in on first run</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Rusta detects an installed Devscriptor and registers it as the{' '}
                <code className="text-slate-300">devscriptor</code> MCP server —{' '}
                <span className="font-semibold text-white">75 tools</span>, with no configuration.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Server className="h-5 w-5 text-blue-400" />
                    Discovery and startup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <ol className="space-y-2 text-sm text-slate-400">
                      {[
                        <>
                          <code className="text-slate-300">$DEVSCRIPTOR_BIN</code> — an explicit path
                        </>,
                        <>
                          <code className="text-slate-300">$PATH</code>
                        </>,
                        <>
                          The platform install directories — <code className="text-slate-300">/usr/local/bin</code>,{' '}
                          <code className="text-slate-300">~/.local/bin</code>,{' '}
                          <code className="text-slate-300">/opt/homebrew/bin</code>, …; on Windows,{' '}
                          <code className="text-slate-300">%LOCALAPPDATA%\Programs\devscriptor</code> and
                          the like
                        </>,
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-lg bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-500">
                    Started as <code className="text-slate-400">devscriptor mcp</code> in the
                    session&apos;s working directory, with an explicit absolute{' '}
                    <code className="text-slate-400">--database</code> — the workspace&apos;s{' '}
                    <code className="text-slate-400">devscriptor.db</code>, or, in a monorepo package
                    without one, the index further up the repository — a 60 s startup timeout and a
                    180 s per-tool timeout. An explicit{' '}
                    <code className="text-slate-400">[[mcp_servers]]</code> entry named{' '}
                    <code className="text-slate-400">devscriptor</code> always wins over detection.
                    The detected server comes from your own install, not from the repository, so it
                    needs no workspace trust. <code className="text-slate-400">rusta doctor</code>{' '}
                    reports whether it was found.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    Approvals that fit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400">
                    A tool its server declares read-only runs without asking. Devscriptor declares 59
                    of its 75 — every search, navigation and LSP query — so those run freely, while
                    in the default mode the 16 that change something (scans, notes, formatting,
                    renames, pruning, server stops) are asked about. To let the routine ones run for
                    the session:
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-relaxed text-slate-300">
                    <code>{`# ~/.config/rusta/config.toml — the first matching rule wins
[[permissions.rules]]
name   = "devscriptor-index-and-notes"
tool   = "mcp__devscriptor__{scan_codebase,start_analysis,generate_embeddings,add_context_note,start_watching}"
action = "allow"
scope  = "session"`}</code>
                  </pre>
                  <p className="text-xs text-slate-500">
                    Formatting, renames, pruning and server stops still ask. Path sandboxing applies
                    independently, so an <code className="text-slate-400">allow</code> rule never
                    escapes <code className="text-slate-400">allowed_paths</code>; in a project&apos;s{' '}
                    <code className="text-slate-400">.rusta.toml</code>, an allow rule applies only
                    once you trust the folder.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
              <Layers className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet-400" />
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">The main tools at hand, the rest on demand.</span>{' '}
                Devscriptor&apos;s 75 tools would swamp a tool table, so Rusta keeps the twelve that
                find and follow code there — search, definitions and references, relationships, the
                index&apos;s state and the Context Graph — and loads the rest with{' '}
                <code className="text-slate-400">select_tools</code> when needed. With Devscriptor
                connected, the system prompt carries its workflow — find code with it before grep,
                index first, record durable notes in the Context Graph — each conversation&apos;s
                first prompt comes with a reminder to start with it, and the{' '}
                <code className="text-slate-400">explore</code> and{' '}
                <code className="text-slate-400">plan</code> sub-agents get its read-only tools, so
                the agents that research code search it with Devscriptor too. A model reaches first
                for the tools it holds and for what comes with its task: on{' '}
                <a href="/benchmarks/" className="text-cyan-400 hover:text-cyan-300">
                  eight benchmark tasks
                </a>{' '}
                run by three models, Devscriptor was called in 5 of 24 runs with every tool behind a
                loading step, and in 19 with the main tools at hand and the reminder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── The harness ───────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <Badge className="mb-4 border-emerald-500/30 bg-emerald-500/20 text-emerald-300">
                <Boxes className="mr-1 h-3 w-3" />
                The harness
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white">Scaffolding that earns its keep</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                A good model still needs somewhere good to run.{' '}
                <code className="text-slate-300">agent-core</code> is the turn loop, the tool
                scheduler, the context manager and the guardrails — the same for every vendor.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {harness.map((h) => (
                <Card
                  key={h.title}
                  className="border-slate-800 bg-slate-900/50 transition-colors hover:border-slate-700"
                >
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                      <h.icon className="h-5 w-5 text-amber-400" />
                    </div>
                    <CardTitle className="text-base text-white">{h.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-slate-400">{h.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Built-in tools ───────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <Badge className="mb-4 border-slate-600 bg-slate-800 text-slate-300">
                <Terminal className="mr-1 h-3 w-3" />
                Tools
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white">26 built-in tools</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                What a fresh agent has before a single MCP server is attached. MCP tools are
                namespaced <code className="text-slate-300">mcp__&lt;server&gt;__&lt;tool&gt;</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {builtinTools.map((group) => (
                <div key={group.category} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">{group.category}</h3>
                    <Badge variant="outline" className="border-slate-700 text-xs text-slate-500">
                      {group.tools.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.tools.map((t) => (
                      <code key={t} className="rounded bg-slate-950 px-2 py-1 text-xs text-slate-400">
                        {t}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-slate-600">
              <code className="text-slate-500">update_goal</code> and{' '}
              <code className="text-slate-500">set_goal_budget</code> are registered too, but hidden
              until a goal is active. <code className="text-slate-500">web_reader</code> joins when
              the provider has a page reader — Kimi’s Coding Plan, Z.AI’s pay-per-token API, DeepSeek
              — and <code className="text-slate-500">skill</code> when skills are loaded. A tool that
              cannot work in the session is not offered at all. The table is pinned by a snapshot
              test, so adding or renaming a tool fails the build until its documentation is updated.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── Setup ───────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <Badge className="mb-4 border-emerald-500/30 bg-emerald-500/20 text-emerald-300">
                <KeyRound className="mr-1 h-3 w-3" />
                Setup
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white">One command, a key verified before it is saved</h2>
              <p className="mx-auto max-w-3xl text-slate-400">
                <code className="text-slate-300">rusta init</code> asks which provider you use, which
                kind of key you hold and, where it matters, the region; verifies the key against the
                endpoint before writing anything; and saves{' '}
                <code className="text-slate-300">~/.config/rusta/config.toml</code> with mode{' '}
                <code className="text-slate-300">600</code>. If the endpoint rejects the key, it
                offers the other plan rather than leaving you to guess. Re-run it to switch provider
                or rotate a key — it edits the config rather than replacing it. It is scriptable too:{' '}
                <code className="text-slate-300">echo &quot;$KEY&quot; | rusta init</code>. Each
                vendor&apos;s tab above shows a real session.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: 'Kimi Coding Plan', cmd: 'export KIMI_API_KEY=sk-...\nrusta' },
                { label: 'GLM (Z.AI)', cmd: 'export ZAI_API_KEY=...\nrusta --provider glm' },
                { label: 'DeepSeek', cmd: 'export DEEPSEEK_API_KEY=sk-...\nrusta --provider deepseek' },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <div className="mb-2 text-xs uppercase tracking-wider text-slate-500">
                    Or from the environment: {s.label}
                  </div>
                  <pre className="overflow-x-auto font-mono text-xs text-slate-300">
                    <code>{s.cmd}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Configuration ───────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <Badge className="mb-4 border-amber-500/30 bg-amber-500/20 text-amber-300">
                <Terminal className="mr-1 h-3 w-3" />
                Configuration
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white">Configure once, or not at all</h2>
              <p className="mx-auto max-w-2xl text-slate-400">
                Rusta layers <code className="text-slate-300">~/.config/rusta/config.toml</code>, then{' '}
                <code className="text-slate-300">.rusta.toml</code> in the session&apos;s working
                directory, then a <code className="text-slate-300">--config</code> file, each
                overriding the one below key by key. Environment variables override the files, and
                command-line flags override both. Every key is optional.
              </p>
            </div>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-0">
                <pre className="overflow-x-auto rounded-lg bg-slate-950 p-5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  <code>{`provider = "glm"
api_key  = "zai-..."

# Which quota the key is billed against: subscription (default) | api.
# This picks the endpoint, and with it the default model.
billing  = "subscription"
region   = "global"        # global (default) | china

# Both optional: leaving them out lets provider + billing choose the
# flagship and its endpoint. Set them to pin a specific one.
# model    = "glm-5.3"
# base_url = "https://api.z.ai/api/coding/paas/v4"

# Sampling / budget
thinking         = true
reasoning_effort = "high"  # none | minimal | low | medium | high | xhigh | max
max_turns        = 100

# Filesystem and context
allowed_paths                 = ["/srv/data"]
additional_dirs               = ["../sibling-repo"]
project_context_files         = ["NOTES.md"]
project_context_budget_tokens = 8192   # the default

permission_mode = "accept_edits"

# Sub-agents may run on a cheaper model than the session's own.
[subagent]
default_model = "fast"

[subagent.models.fast]
model            = "glm-5.3-flash"
description      = "Locating files, reading configs, simple lookups."
reasoning_effort = "low"

# Devscriptor is auto-detected — no entry needed here.
[[mcp_servers]]
name = "http-tools"
url  = "http://localhost:8000/mcp"

# Permission policy; the first matching rule wins.
[[permissions.rules]]
name    = "allow-cargo"
tool    = "bash"
command = "^cargo (build|test|check)"
action  = "allow"`}</code>
                </pre>
              </CardContent>
            </Card>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: 'Permission modes', value: 'default · accept_edits · bypass_permissions (--yes)' },
                { label: 'Reasoning effort', value: 'none · minimal · low · medium · high · xhigh · max' },
                {
                  label: 'Subcommands',
                  value: 'init · doctor · version · completions · sessions list · fork · trust · export',
                },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <div className="text-xs uppercase tracking-wider text-slate-500">{item.label}</div>
                  <div className="mt-1 font-mono text-xs text-slate-300">{item.value}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              A project&apos;s <code className="text-slate-400">.rusta.toml</code> cannot start MCP
              servers, redirect requests, loosen permissions or reach outside the folder until you
              trust it. The full reference is in the{' '}
              <a
                href={`${repoUrl('rusta')}/blob/main/docs/configuration.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 underline-offset-4 hover:underline"
              >
                configuration guide
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── Self-hosting ───────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <Card className="overflow-hidden border-emerald-500/25 bg-gradient-to-br from-emerald-900/20 to-slate-900/50">
              <CardContent className="p-8 sm:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Lock className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <Badge className="mb-1 border-emerald-500/30 bg-emerald-500/20 text-emerald-300">
                      Open weights
                    </Badge>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                      Own the whole stack, if you need to
                    </h2>
                  </div>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p>
                    All three vendors publish open weights for models Rusta runs — Kimi K3, K2.7 Code
                    and K2.6; GLM-5.3 and GLM-5.3-Flash; DeepSeek V4.1-Flash and V4-Pro — so a team
                    that cannot send source code to an outside provider can serve one on hardware it
                    controls. Each vendor tab names its models.
                  </p>
                  <p>
                    Point{' '}
                    <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-sm text-amber-300">
                      --provider openai --base-url
                    </code>{' '}
                    at your own OpenAI-compatible server, such as vLLM, and Rusta runs against weights
                    you host. Pair it with{' '}
                    <a href="/" className="font-semibold text-emerald-300 underline-offset-4 hover:underline">
                      Devscriptor
                    </a>
                    , which analyses code on your machine with no backend, and{' '}
                    <span className="font-semibold text-white">
                      every layer of the stack stays inside your perimeter
                    </span>
                    : the model, the code index, and the agent that drives them.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { label: 'The model', value: 'Open weights, self-hosted', icon: Brain },
                    { label: 'The code index', value: 'Devscriptor — a local SQLite file', icon: Server },
                    { label: 'The agent', value: 'Rusta — a single binary', icon: Bot },
                  ].map((layer) => (
                    <div key={layer.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                      <layer.icon className="mb-2 h-5 w-5 text-emerald-400" />
                      <div className="text-xs uppercase tracking-wider text-slate-500">{layer.label}</div>
                      <div className="mt-1 text-sm font-medium text-white">{layer.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ───────────────── Download ───────────────── */}
      <section id="download" className="scroll-mt-20 border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <Badge className="mb-4 border-emerald-500/30 bg-emerald-500/20 text-emerald-300">
                <Download className="mr-1 h-3 w-3" />
                {LICENSE_BADGE}
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white">Download Rusta {RUSTA_VERSION}</h2>
              <p className="mx-auto max-w-2xl text-slate-400">
                One self-contained binary per platform — no OpenSSL, nothing else to install. The
                terminal UI is not in the release binaries; build with{' '}
                <code className="text-slate-300">--features tui</code> for it.
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
                {LICENSE_SUMMARY}{' '}
                <a
                  href={repoUrl('rusta')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 underline underline-offset-4 hover:text-white"
                >
                  Source on GitHub
                </a>
                .
              </p>
              <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-600">{RUSTA_NOT_AFFILIATED}</p>
            </div>

            <DownloadSection variant="full" product="rusta" />

            <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-slate-800 bg-slate-950 p-6">
              <h3 className="font-semibold text-white">Or build from source</h3>
              <p className="mt-2 text-sm text-slate-400">With Rust 1.89 or newer:</p>
              <pre className="mt-3 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-300 sm:text-sm">
                <code>{`git clone https://github.com/vladimirpesic/rusta.git && cd rusta
cargo build --release -p rusta-cli                  # target/release/rusta
cargo build --release -p rusta-cli --features tui   # with the terminal UI`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="border-t border-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Better together</h2>
            <p className="mb-8 text-slate-400">
              Rusta drives the model. Devscriptor gives it a map of your codebase. Install both and
              the agent starts with 75 code-intelligence tools within reach. Together they resolved
              75–81% of SWE-bench Multilingual with Kimi, GLM and DeepSeek models.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/download/"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Download Both
              </a>
              <a
                href="/mcp-tools/"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
              >
                <Layers className="h-4 w-4" />
                Explore the 75 MCP Tools
              </a>
              <a
                href="/benchmarks/"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
              >
                <Trophy className="h-4 w-4" />
                See the Benchmark
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
