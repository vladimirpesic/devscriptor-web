// SWE-bench Multilingual results of Rusta with Devscriptor: every figure the
// benchmarks page shows. They are computed from the runs' records and the
// harness's reports, which BENCHMARK_ARCHIVE holds in full.

export type BenchmarkModelId = 'deepseek' | 'glm' | 'kimi'

export interface ModelResult {
  id: BenchmarkModelId
  name: string
  vendor: string
  /** The model id Rusta sent. */
  modelId: string
  resolved: number
  tasks: number
  /** The 95 % Wilson interval of the share resolved. */
  interval: [number, number]
  /** Time the agent worked on a task. */
  minutes: { median: number; mean: number }
  /** Model requests in a task. */
  steps: { median: number }
  /** Tokens over all tasks; `cached` is the part of `input` read from the prompt cache. */
  tokens: { input: number; cached: number; output: number }
  /** What the runs cost in dollars, for pay-per-token billing. */
  usd: number | null
  /** How the runs were paid for. */
  cost: string
  devscriptor: {
    /** Runs that called a Devscriptor tool at least once. */
    runs: number
    calls: number
    /** The most-called tools, with their call counts. */
    tools: [string, number][]
    resolvedWith: number
    resolvedWithout: number
  }
  /** Runs that ended without changing any file. */
  emptyPatches: number
}

export interface LanguageResult {
  language: string
  tasks: number
  resolved: Record<BenchmarkModelId, number>
}

export interface LeaderboardEntry {
  name: string
  org: string
  /** Percent of the tasks resolved. */
  resolved: number
}

export const MULTILINGUAL = {
  dataset: 'SWE-bench/SWE-bench_Multilingual',
  datasetUrl: 'https://huggingface.co/datasets/SWE-bench/SWE-bench_Multilingual',
  aboutUrl: 'https://www.swebench.com/multilingual.html',
  tasks: 300,
  repositories: 41,
  languages: 9,
  runDates: '9–11 November 2026',
  rusta: '1.0.0',
  devscriptor: '1.0.4',
  harness: '5.0.2',
  maxSteps: 250,
  hoursPerTask: 4,
  effort: 'max',
}

export const MODEL_RESULTS: ModelResult[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek V4.1-Flash',
    vendor: 'DeepSeek',
    modelId: 'deepseek-flash',
    resolved: 244,
    tasks: 300,
    interval: [0.7654, 0.8534],
    minutes: { median: 4.7, mean: 5.7 },
    steps: { median: 44 },
    tokens: { input: 967063951, cached: 945544832, output: 8863983 },
    usd: 13.98,
    cost: '$13.98 at DeepSeek’s pay-per-token prices',
    devscriptor: {
      runs: 240,
      calls: 551,
      tools: [['semantic_search', 215], ['search_context', 117], ['search_functions', 92], ['add_context_note', 39], ['get_context_statistics', 22], ['get_statistics', 20]],
      resolvedWith: 190,
      resolvedWithout: 54,
    },
    emptyPatches: 0,
  },
  {
    id: 'glm',
    name: 'GLM-5.3',
    vendor: 'Z.AI',
    modelId: 'glm-5.3',
    resolved: 236,
    tasks: 300,
    interval: [0.7368, 0.8292],
    minutes: { median: 9.9, mean: 13.4 },
    steps: { median: 32 },
    tokens: { input: 559388018, cached: 540136128, output: 6977279 },
    usd: null,
    cost: 'GLM Coding Plan Max subscription',
    devscriptor: {
      runs: 276,
      calls: 629,
      tools: [['semantic_search', 224], ['search_functions', 136], ['search_context', 100], ['add_context_note', 87], ['search_classes', 33], ['get_references', 20]],
      resolvedWith: 217,
      resolvedWithout: 19,
    },
    emptyPatches: 1,
  },
  {
    id: 'kimi',
    name: 'Kimi K2.8 Preview',
    vendor: 'Moonshot AI',
    modelId: 'kimi-for-coding',
    resolved: 226,
    tasks: 300,
    interval: [0.7016, 0.7987],
    minutes: { median: 10.0, mean: 13.0 },
    steps: { median: 32 },
    tokens: { input: 1294409074, cached: 1262766950, output: 15701402 },
    usd: null,
    cost: 'Kimi Code subscription',
    devscriptor: {
      runs: 272,
      calls: 663,
      tools: [['search_functions', 244], ['semantic_search', 231], ['add_context_note', 91], ['search_context', 35], ['search_classes', 25], ['get_entity_details', 17]],
      resolvedWith: 203,
      resolvedWithout: 23,
    },
    emptyPatches: 1,
  },
]

/** JavaScript and TypeScript share a row: several of their repositories hold both. */
export const LANGUAGE_RESULTS: LanguageResult[] = [
  { language: 'C', tasks: 30, resolved: { deepseek: 26, glm: 26, kimi: 25 } },
  { language: 'C++', tasks: 12, resolved: { deepseek: 8, glm: 9, kimi: 9 } },
  { language: 'Go', tasks: 42, resolved: { deepseek: 27, glm: 27, kimi: 25 } },
  { language: 'Java', tasks: 43, resolved: { deepseek: 40, glm: 38, kimi: 38 } },
  { language: 'JavaScript / TypeScript', tasks: 43, resolved: { deepseek: 37, glm: 32, kimi: 35 } },
  { language: 'PHP', tasks: 43, resolved: { deepseek: 35, glm: 36, kimi: 30 } },
  { language: 'Ruby', tasks: 44, resolved: { deepseek: 33, glm: 31, kimi: 30 } },
  { language: 'Rust', tasks: 43, resolved: { deepseek: 38, glm: 37, kimi: 34 } },
]

/** Tasks by how many of the three models resolved them. */
export const OVERLAP = {
  all: 212,
  any: 256,
  none: 44,
  only: { deepseek: 9, glm: 7, kimi: 2 },
}

/** The official leaderboard's Multilingual entries, all run with the same minimal agent. */
export const LEADERBOARD: { url: string; agent: string; dated: string; entries: LeaderboardEntry[] } = {
  url: 'https://www.swebench.com/',
  agent: 'mini-SWE-agent 2.0',
  dated: 'February 2026',
  entries: [
    { name: 'Gemini 3 Flash', org: 'Google DeepMind', resolved: 72.7 },
    { name: 'Claude 4.6 Opus', org: 'Anthropic', resolved: 72.0 },
    { name: 'Claude 4.5 Opus', org: 'Anthropic', resolved: 70.7 },
    { name: 'GLM 5', org: 'Z.ai', resolved: 69.7 },
    { name: 'Gemini 3 Pro', org: 'Google DeepMind', resolved: 68.7 },
    { name: 'MiniMax M2.5', org: 'Minimax', resolved: 68.3 },
    { name: 'Kimi K2.5', org: 'Moonshot AI', resolved: 67.3 },
    { name: 'Claude 4.5 Sonnet', org: 'Anthropic', resolved: 67.0 },
    { name: 'GPT 5.2 (high)', org: 'OpenAI', resolved: 66.7 },
    { name: 'GPT 5.2 Codex', org: 'OpenAI', resolved: 66.3 },
    { name: 'Claude 4.5 Haiku', org: 'Anthropic', resolved: 64.7 },
    { name: 'DeepSeek V3.2', org: 'DeepSeek', resolved: 59.0 },
    { name: 'GPT 5 mini', org: 'OpenAI', resolved: 39.7 },
  ],
}

/** The prompt every run got, with the task's issue in place of the placeholder. */
export const TASK_PROMPT = `The repository at /testbed is checked out at the commit an issue was reported against.

<issue>
@PROBLEM_STATEMENT@
</issue>

Change the non-test files under /testbed so that the issue is resolved. The tests
that check the fix are already written and will be added afterwards, so you do not
need to write or change tests. You may run the project's existing tests and your own
scripts. The environment has no internet access; the project's dependencies are
already installed.

Devscriptor's code-intelligence tools are connected and /testbed is already
indexed: load them with select_tools and use them (semantic search, definitions,
references) to find the relevant code before reading files.

Make the smallest change that resolves the issue.`

const RESULTS_RELEASE =
  'https://github.com/vladimirpesic/devscriptor-web/releases/download/swe-bench-multilingual'

/** Every prediction, harness report and trajectory behind the figures above. */
export const BENCHMARK_ARCHIVE = {
  name: 'rusta-devscriptor-swe-bench-multilingual.tar.gz',
  url: `${RESULTS_RELEASE}/rusta-devscriptor-swe-bench-multilingual.tar.gz`,
  sha256Url: `${RESULTS_RELEASE}/rusta-devscriptor-swe-bench-multilingual.tar.gz.sha256`,
  sizeMb: 53,
}
