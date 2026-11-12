'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Bot,
  Brain,
  Lock,
  Server,
  ChevronRight,
  Download,
  Cpu,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { RUSTA_VERSION } from '@/lib/github'
import { LICENSE_SPDX } from '@/lib/licensing'
import { RustaLogo } from '@/components/rusta-logo'

const pillars = [
  {
    icon: Sparkles,
    title: 'Kimi, GLM and DeepSeek, natively',
    desc: 'Defaults to each vendor’s coding model — kimi-for-coding (K2.8 Preview), glm-5.3, deepseek-flash — and runs K3.1 Pro and the rest with --model. Each model’s window, input and effort levels come from the vendor’s live model list, so a new model needs no update.',
  },
  {
    icon: Brain,
    title: 'Preserved Thinking',
    desc: 'Reasoning carries across turns instead of being thrown away. Kimi spells it thinking.keep, GLM clear_thinking with inverted polarity, and DeepSeek wants it echoed back on every request with tools. Rusta translates.',
  },
  {
    icon: Server,
    title: 'Devscriptor, auto-wired',
    desc: 'Detects your Devscriptor install and registers its 75 MCP tools on first run: the twelve it uses most are at hand from the first request, and the rest load on demand so they do not crowd the context. Zero configuration.',
  },
  {
    icon: KeyRound,
    title: 'The right key, the right door',
    desc: 'Kimi and Z.AI sell a Coding Plan and pay-per-token credits at separate endpoints. rusta init asks which key you hold, verifies it before saving — on both Kimi Coding hosts — and routes it.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe in any repo',
    desc: 'A cloned repository’s .rusta.toml cannot start MCP servers, redirect your key or loosen permissions until you trust the folder, and cannot declare hooks at all. Rusta shows exactly what trusting it would apply.',
  },
  {
    icon: Lock,
    title: 'Open weights, on-prem',
    desc: 'Kimi, GLM and DeepSeek publish open weights for models Rusta runs. Point --provider openai --base-url at your own server and the whole stack — model, index, agent — stays inside your perimeter.',
  },
]

export function Rusta() {
  return (
    <section id="rusta" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-transparent" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-950/30 via-slate-900/50 to-slate-950">
            <CardContent className="p-8 sm:p-12">
              {/* Header */}
              <div className="mb-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <RustaLogo className="mx-auto mb-6 h-28 w-28 drop-shadow-[0_8px_24px_rgba(245,158,11,0.25)] sm:h-32 sm:w-32" />
                  <Badge className="mb-4 border-amber-500/30 bg-amber-500/20 text-amber-300">
                    <Bot className="mr-1 h-3 w-3" />
                    Companion tool · Rusta v{RUSTA_VERSION}
                  </Badge>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl"
                >
                  <span className="text-white">Meet </span>
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                    Rusta
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mx-auto max-w-2xl text-lg text-slate-400"
                >
                  Kimi, GLM and DeepSeek are among the strongest coding models available — and most
                  agents reach them through a generic OpenAI-compatible shim that quietly drops what
                  makes them good. Rusta is the coding agent that doesn&apos;t.
                </motion.p>
              </div>

              {/* Pillars */}
              <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pillars.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-5"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                      <p.icon className="h-5 w-5 text-amber-400" />
                    </div>
                    <h3 className="mb-2 font-semibold text-white">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{p.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Terminal + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2"
              >
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                  <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-3 font-mono text-xs text-slate-500">terminal</span>
                  </div>
                  <div className="overflow-x-auto p-4 font-mono text-xs sm:text-sm">
                    <div className="text-slate-500"># Pick a provider, paste a key — verified, then saved</div>
                    <div className="text-emerald-400">$ rusta init</div>
                    <div className="mt-1 text-slate-500"># Check the setup, Devscriptor included</div>
                    <div className="text-emerald-400">$ rusta doctor</div>
                    <div className="mt-1 text-slate-500"># Then the REPL</div>
                    <div className="text-amber-400">$ rusta</div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['Native Rust', 'Kimi · GLM · DeepSeek · OpenAI', '26 built-in tools', 'Sub-agents & swarms', LICENSE_SPDX].map(
                      (chip) => (
                        <span
                          key={chip}
                          className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-slate-400"
                        >
                          <Cpu className="h-3 w-3 text-amber-400" />
                          {chip}
                        </span>
                      )
                    )}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a href="/rusta/" className="flex-1">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 font-semibold text-white shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-orange-500"
                      >
                        Explore Rusta
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </a>
                    <a href="/rusta/#download" className="flex-1">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-slate-700 hover:bg-slate-800"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
