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

/** Runs of the smoke test's tasks with and without the prompt's sentence about Devscriptor. */
export interface SentenceCheckRow {
  /** The runs' folder under comparison/ in the archive; null for the full run's own runs. */
  folder: string | null
  rusta: string
  /** Whether the prompt asked the model to use Devscriptor. */
  sentence: boolean
  /** Runs that called Devscriptor at least once. */
  using: number
  calls: number
  resolved: number
  byModel: Record<BenchmarkModelId, { using: number; calls: number }>
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

/**
 * Devscriptor's use on the smoke test's tasks, each run by every model, with Rusta 1.0.0
 * and 1.0.1 and a prompt that does not mention Devscriptor, beside the full run's runs of
 * the same tasks, whose prompt does.
 */
export const WITHOUT_SENTENCE = {
  tasks: 8,
  runs: 24,
  rows: [
    {
      folder: 'rusta-1.0.0-without-sentence',
      rusta: '1.0.0',
      sentence: false,
      using: 5,
      calls: 15,
      resolved: 17,
      byModel: { deepseek: { using: 3, calls: 12 }, glm: { using: 2, calls: 3 }, kimi: { using: 0, calls: 0 } },
    },
    {
      folder: null,
      rusta: '1.0.0',
      sentence: true,
      using: 23,
      calls: 50,
      resolved: 16,
      byModel: { deepseek: { using: 7, calls: 10 }, glm: { using: 8, calls: 19 }, kimi: { using: 8, calls: 21 } },
    },
    {
      folder: 'rusta-1.0.1-without-sentence',
      rusta: '1.0.1',
      sentence: false,
      using: 19,
      calls: 49,
      resolved: 18,
      byModel: { deepseek: { using: 6, calls: 13 }, glm: { using: 6, calls: 17 }, kimi: { using: 7, calls: 19 } },
    },
  ] as SentenceCheckRow[],
}

/**
 * The full run's runs whose tool calls named what the warm-up's test run left in the image
 * (test reports and caches, test logs, the tests' output in Go's build cache), and how many
 * of them were resolved. They are of `tasks` tasks.
 */
export const LEFTOVER_READS: { tasks: number } & Record<BenchmarkModelId, { runs: number; resolved: number }> = {
  tasks: 47,
  deepseek: { runs: 35, resolved: 26 },
  glm: { runs: 13, resolved: 11 },
  kimi: { runs: 13, resolved: 9 },
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

/** One of DeepSeek V4.1-Flash's two runs of every task, side by side: with Devscriptor or without it. */
export interface ArmResult {
  /** The arm's folder under arms/ in the archive. */
  folder: string
  devscriptor: boolean
  resolved: number
  /** The 95 % Wilson interval of the share resolved. */
  interval: [number, number]
  /** Model requests in a task. */
  steps: { median: number }
  tokens: { input: number; cached: number; output: number }
  usd: number
  /** Runs that called Devscriptor at least once, and its calls. */
  devscriptorRuns: number
  devscriptorCalls: number
  /** Tasks resolved, in the order of LANGUAGE_RESULTS. */
  byLanguage: number[]
}

/**
 * Every task run twice more by DeepSeek V4.1-Flash with Rusta 1.0.1 and a prompt that does not mention
 * Devscriptor, side by side: with Devscriptor 1.0.5, and without it. `paired` counts the
 * tasks by which arms resolved them, with the exact McNemar test's p.
 */
export const ARMS = {
  model: 'deepseek' as BenchmarkModelId,
  rusta: '1.0.1',
  devscriptor: '1.0.5',
  tasks: 300,
  runDates: '12 November 2026',
  paired: { both: 234, onlyWith: 7, onlyWithout: 11, neither: 48, p: 0.4807 },
  rows: [
    {
      folder: 'with-devscriptor',
      devscriptor: true,
      resolved: 241,
      interval: [0.7546, 0.8444],
      steps: { median: 44 },
      tokens: { input: 1056354495, cached: 1041210880, output: 9376557 },
      usd: 15.13,
      devscriptorRuns: 274,
      devscriptorCalls: 591,
      byLanguage: [26, 9, 28, 40, 31, 36, 33, 38],
    },
    {
      folder: 'without-devscriptor',
      devscriptor: false,
      resolved: 245,
      interval: [0.769, 0.8564],
      steps: { median: 44.5 },
      tokens: { input: 870072635, cached: 856665856, output: 8336993 },
      usd: 13.43,
      devscriptorRuns: 0,
      devscriptorCalls: 0,
      byLanguage: [28, 9, 26, 40, 35, 36, 33, 38],
    },
  ] as ArmResult[],
}

/**
 * How soon the arms' runs found the code: the first model request whose tool calls named a
 * source file the fix changes (1 for the first), and the issues that name one themselves.
 */
export const LOCATING = {
  issueNamesFile: 59,
  tasks: 300,
  rows: [
    { folder: 'with-devscriptor', medianStep: 2, atFirst: 57, byThird: 263, never: 0 },
    { folder: 'without-devscriptor', medianStep: 2, atFirst: 91, byThird: 270, never: 0 },
  ],
}

/** The arm with Devscriptor's calls, and those Rusta 1.0.1's guidance asked for whatever the task. */
export const STANDING_ORDERS = {
  calls: 591,
  tools: [['get_statistics', 98], ['search_context', 106], ['get_context_statistics', 8], ['add_context_note', 35]] as [string, number][],
}

/**
 * Rusta's first request of a task (jqlang__jq-2235), counted by DeepSeek: without
 * Devscriptor, and with it before and after the changes that make its share smaller.
 * `parts` splits Devscriptor's share.
 */
export const REQUEST_TOKENS = {
  without: 11731,
  before: { rusta: '1.0.1', devscriptor: '1.0.5', total: 18776, preloaded: 12, parts: { toolDefinitions: 2590, toolList: 2321, guidance: 2003, reminder: 131 } },
  after: { rusta: '1.0.2', devscriptor: '1.0.7', total: 15554, preloaded: 6, parts: { toolDefinitions: 959, toolList: 1548, guidance: 1180, reminder: 136 } },
}

export interface FollowUpRow {
  /** The runs' folder under arms/ in the archive. */
  folder: string
  resolved: number
  requests: number
  input: number
  output: number
  /** At DeepSeek's off-peak prices: the runs were made at different hours. */
  usd: number
  devscriptorCalls: number
  contextGraphCalls: number
}

/**
 * Tasks run again with the changes of Rusta 1.0.2 and Devscriptor 1.0.7, beside the arms'
 * runs of the same tasks: every fifth task, then those of them whose runs called the
 * Context Graph's tools, with Rusta 1.0.2's guidance for it.
 */
export const FOLLOW_UPS: { folder: string; tasks: number; runDates: string; rows: FollowUpRow[] }[] = [
  {
    folder: 'devscriptor-lean',
    tasks: 60,
    runDates: '18–19 November 2026',
    rows: [
      { folder: 'without-devscriptor', resolved: 51, requests: 2954, input: 159409643, output: 1616309, usd: 1.836, devscriptorCalls: 0, contextGraphCalls: 0 },
      { folder: 'with-devscriptor', resolved: 49, requests: 2885, input: 163193247, output: 1646676, usd: 1.886, devscriptorCalls: 115, contextGraphCalls: 26 },
      { folder: 'devscriptor-lean', resolved: 51, requests: 2674, input: 152389286, output: 1589752, usd: 1.845, devscriptorCalls: 107, contextGraphCalls: 26 },
    ],
  },
  {
    folder: 'devscriptor-notes',
    tasks: 18,
    runDates: '19 November 2026',
    rows: [
      { folder: 'without-devscriptor', resolved: 14, requests: 1170, input: 71914777, output: 642643, usd: 0.74, devscriptorCalls: 0, contextGraphCalls: 0 },
      { folder: 'with-devscriptor', resolved: 14, requests: 1117, input: 71747906, output: 680402, usd: 0.769, devscriptorCalls: 51, contextGraphCalls: 15 },
      { folder: 'devscriptor-lean', resolved: 14, requests: 1084, input: 70289445, output: 662734, usd: 0.777, devscriptorCalls: 50, contextGraphCalls: 24 },
      { folder: 'devscriptor-notes', resolved: 13, requests: 1007, input: 65954493, output: 650006, usd: 0.734, devscriptorCalls: 27, contextGraphCalls: 3 },
    ],
  },
]

const RESULTS_RELEASE =
  'https://github.com/vladimirpesic/devscriptor-web/releases/download/swe-bench-multilingual'

/** Every prediction, harness report and trajectory behind the figures above. */
export const BENCHMARK_ARCHIVE = {
  name: 'rusta-devscriptor-swe-bench-multilingual.tar.gz',
  url: `${RESULTS_RELEASE}/rusta-devscriptor-swe-bench-multilingual.tar.gz`,
  sha256Url: `${RESULTS_RELEASE}/rusta-devscriptor-swe-bench-multilingual.tar.gz.sha256`,
  sizeMb: 122,
}
